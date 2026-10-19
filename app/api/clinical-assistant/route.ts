import { NextResponse } from "next/server";
import type { ChatMessage } from "@/lib/fastmed-types";
import {
  RED_FLAG_RULES,
  detectRedFlags,
  extractTriage,
  highestTriage,
} from "@/lib/fastmed-safety";

const HEALTH_TERMS =
  /\b(pain|fever|cough|blood|bleed|breath|chest|vomit|diarrh|pregnan|medicine|dose|symptom|sick|hospital|doctor|nurse|clinic|health|maumivu|homa|kikohozi|damu|kupumua|kutapika|kuharisha|mimba|dawa|dalili|hospitali|daktari|muuguzi|afya)\b/i;
const KNOWN_FLAG_IDS = new Set(RED_FLAG_RULES.map((rule) => rule.id));
const GENERAL_SWITCH_TERMS =
  /\b(football|soccer|sports?|technology|computer|phone|business|career|job|work|school|education|relationship|music|movie|travel|weather|mpira|teknolojia|biashara|kazi|shule|elimu|mahusiano|muziki|safari)\b/i;
const SOURCE =
  "Tanzania Ministry of Health STG/NEMLIT, 7th Edition (2026), where relevant excerpts are available.";

function textFromResponse(data: {
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
}) {
  return (data.output || [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content || [])
    .filter((part) => part.type === "output_text")
    .map((part) => part.text || "")
    .join("\n")
    .trim();
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey)
    return NextResponse.json(
      { error: "FastMed is not configured yet. Please try again later." },
      { status: 503 },
    );
  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body.messages)
      ? body.messages
          .filter(
            (message: ChatMessage) =>
              (message.role === "user" || message.role === "assistant") &&
              typeof message.content === "string",
          )
          .slice(-12)
      : [];
    const totalLength = messages.reduce(
      (sum, message) => sum + message.content.length,
      0,
    );
    if (!messages.length || messages.at(-1)?.role !== "user")
      return NextResponse.json(
        { error: "Please enter a message." },
        { status: 400 },
      );
    if (totalLength > 12000)
      return NextResponse.json(
        {
          error:
            "This conversation is too long. Please start a new conversation.",
        },
        { status: 400 },
      );
    const latest = messages.at(-1)?.content || "";
    const recentUserMessages = messages
      .filter((message) => message.role === "user")
      .map((message) => message.content);
    const previousWasHealth = recentUserMessages
      .slice(0, -1)
      .some((content) => HEALTH_TERMS.test(content));
    const explicitTopicSwitch =
      GENERAL_SWITCH_TERMS.test(latest) && !HEALTH_TERMS.test(latest);
    const isShortContinuation = latest.trim().split(/\s+/).length <= 5;
    // Guided check-in context (age, pregnancy, ticked danger signs). Never includes name.
    const rawIntake = body.intake && typeof body.intake === "object" ? body.intake : null;
    const intakeAge =
      rawIntake && typeof rawIntake.age === "number" && rawIntake.age >= 0 && rawIntake.age <= 130
        ? rawIntake.age
        : null;
    const intakeSigns: string[] =
      rawIntake && Array.isArray(rawIntake.dangerSigns)
        ? rawIntake.dangerSigns.filter(
            (id: unknown): id is string => typeof id === "string" && KNOWN_FLAG_IDS.has(id),
          )
        : [];
    const safety = detectRedFlags(recentUserMessages.join("\n"), {
      age: intakeAge,
      pregnant: Boolean(rawIntake?.pregnant),
      checkedSigns: intakeSigns,
    });
    const isHealthRelated =
      Boolean(rawIntake) ||
      safety.flags.length > 0 ||
      (!explicitTopicSwitch &&
        (HEALTH_TERMS.test(latest) || (isShortContinuation && previousWasHealth)));
    const isUrgent = safety.level === "emergency";
    const flagSummary = safety.flags.map((flag) => flag.label.en).join("; ");
    const language = body.language === "sw" ? "Kiswahili" : "English";
    let excerpts = "";
    let useOfficialWebSearch = false;

    if (isHealthRelated) {
      const vectorStoreId = process.env.OPENAI_STG_VECTOR_STORE_ID_2026;
      if (vectorStoreId) {
        const search = await fetch(
          `https://api.openai.com/v1/vector_stores/${vectorStoreId}/search`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: latest,
              max_num_results: 4,
              rewrite_query: true,
            }),
          },
        );
        const searchData = await search.json();
        if (search.ok)
          excerpts = Array.isArray(searchData.data)
            ? searchData.data
                .slice(0, 4)
                .flatMap(
                  (result: { content?: Array<{ text?: string }> }) =>
                    result.content || [],
                )
                .map((item: { text?: string }) => item.text || "")
                .filter(Boolean)
                .join("\n\n---\n\n")
            : "";
      }
      useOfficialWebSearch = !excerpts;
    }

    const generalInstructions = `You are FastMed, a warm general-purpose AI assistant within JustCosta. Reply in ${language}. Follow the user's latest requested topic even when it differs from earlier messages. Continue naturally, including short replies such as Yes that refer to an earlier offer. Be useful and concise. Do not pretend to have completed real-world actions.`;
    const healthInstructions = `\nThe conversation is health-related. Respond as a careful clinical-information assistant for a patient in Tanzania. Give substantial, medically useful guidance while never claiming a diagnosis or replacing an examination. Explain the relevant clinical possibilities, important assessment questions, danger signs, appropriate level and timing of care, and safe supportive measures. Do not prescribe, change medicines, or give dosing. Do not fabricate patient facts or practitioners. ${isUrgent ? `FastMed's safety rules detected emergency warning signs (${flagSummary}). Put URGENT HELP first: tell the user to go to the nearest hospital emergency department now and not to wait for an AI reply. In Tanzania the emergency number is 112, and public ambulances are limited, so advise arranging transport to hospital immediately.` : safety.level === "urgent" ? `FastMed's safety rules detected warning signs (${flagSummary}) that need assessment within 24 hours. Say this clearly near the start.` : "Clearly distinguish routine follow-up from symptoms needing prompt or emergency assessment."}${safety.mentalHealth ? " The user may be at risk of self-harm. Respond with warmth and without judgement, encourage them to stay with someone they trust, go to the nearest hospital or call 112 now, and keep the reply short and supportive." : ""}${safety.isChild ? " The patient is a young child; apply child danger signs and be more cautious." : ""}${safety.isPregnancy ? " The patient is or may be pregnant; apply pregnancy danger signs and be more cautious." : ""} Ground every condition-specific statement in the official Tanzania Ministry of Health STG/NEMLIT 7th Edition (2026). The official final document is https://www.moh.go.tz/storage/app/uploads/public/6a8/c97/408/6a8c97408b3be007728156.pdf. When web search is available, search the official Ministry source before answering and never substitute an older edition. State when a requested detail cannot be confirmed from the retrieved 2026 material. Use plain text only with no Markdown, asterisks, hash marks, bullet symbols, or decorative characters. Use these headings: CLINICAL CONTEXT:, STG 2026 INFORMATION:, IMPORTANT:, URGENT HELP: when warranted, and NEXT STEP:. For Kiswahili use MUKTADHA WA KITABIBU:, TAARIFA ZA STG 2026:, MUHIMU:, HUDUMA YA HARAKA:, and HATUA INAYOFUATA:. After NEXT STEP, write the source line exactly: ${SOURCE} Then, as the very last line, write exactly one triage line: TRIAGE: EMERGENCY (needs emergency care now), TRIAGE: URGENT (see a clinician within 24 hours), TRIAGE: SOON (see a clinician within a few days), or TRIAGE: SELF_CARE (home care and monitoring). Use this English line even when replying in Kiswahili. When unsure between two levels, choose the more urgent one.${safety.level ? ` The triage must be at least ${safety.level.toUpperCase()}.` : ""}`;
    const input = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
    if (isHealthRelated && excerpts)
      input.push({
        role: "user",
        content: `Relevant 2026 guideline excerpts:\n${excerpts}`,
      });
    const responseBody: Record<string, unknown> = {
      model: process.env.OPENAI_MODEL || "gpt-5.4",
      store: false,
      max_output_tokens: 1400,
      instructions:
        generalInstructions + (isHealthRelated ? healthInstructions : ""),
      input,
    };
    if (useOfficialWebSearch)
      Object.assign(responseBody, {
        tools: [
          {
            type: "web_search",
            filters: { allowed_domains: ["moh.go.tz"] },
            search_context_size: "high",
          },
        ],
        tool_choice: "required",
        max_tool_calls: 2,
      });
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responseBody),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("FastMed response failed", data);
      return NextResponse.json(
        {
          error: "FastMed could not respond right now. Please try again later.",
        },
        { status: 502 },
      );
    }
    const cleaned = textFromResponse(data)
      .replace(/\*/g, "")
      .replace(/^#{1,6}\s*/gm, "")
      .replace(/^\s*[-•]\s+/gm, "")
      .trim();
    const { level: aiTriage, text: reply } = extractTriage(cleaned);
    // Rules can only raise the level, never lower it.
    const triage = isHealthRelated ? highestTriage(aiTriage, safety.level) : null;
    if (!reply)
      return NextResponse.json(
        { error: "FastMed returned no response. Please try again." },
        { status: 502 },
      );
    return NextResponse.json({
      reply,
      isHealthRelated,
      source: isHealthRelated ? SOURCE : null,
      triage,
      redFlags: safety.flags.map((flag) => flag.id),
    });
  } catch (error) {
    console.error("FastMed error", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
