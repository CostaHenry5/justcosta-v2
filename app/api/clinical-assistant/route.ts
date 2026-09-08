import { NextResponse } from "next/server";
import type { ChatMessage } from "@/lib/fastmed-types";

const HEALTH_TERMS = /\b(pain|fever|cough|blood|bleed|breath|chest|vomit|diarrh|pregnan|medicine|dose|symptom|sick|hospital|doctor|nurse|clinic|health|maumivu|homa|kikohozi|damu|kupumua|kutapika|kuharisha|mimba|dawa|dalili|hospitali|daktari|muuguzi|afya)\b/i;
const URGENT_TERMS = /\b(chest pain|cannot breathe|can't breathe|severe bleeding|unconscious|seizure|stroke|self[- ]?harm|suicide|maumivu ya kifua|hawezi kupumua|damu nyingi|amepoteza fahamu|degedege|kujiua)\b/i;
const GENERAL_SWITCH_TERMS = /\b(football|soccer|sports?|technology|computer|phone|business|career|job|work|school|education|relationship|music|movie|travel|weather|mpira|teknolojia|biashara|kazi|shule|elimu|mahusiano|muziki|safari)\b/i;
const SOURCE = "Tanzania Ministry of Health STG/NEMLIT, 7th Edition (2026), where relevant excerpts are available.";

function textFromResponse(data: { output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }> }) {
  return (data.output || []).filter((item) => item.type === "message").flatMap((item) => item.content || []).filter((part) => part.type === "output_text").map((part) => part.text || "").join("\n").trim();
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "FastMed is not configured yet. Please try again later." }, { status: 503 });
  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages.filter((message: ChatMessage) => (message.role === "user" || message.role === "assistant") && typeof message.content === "string").slice(-12) : [];
    const totalLength = messages.reduce((sum, message) => sum + message.content.length, 0);
    if (!messages.length || messages.at(-1)?.role !== "user") return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
    if (totalLength > 12000) return NextResponse.json({ error: "This conversation is too long. Please start a new conversation." }, { status: 400 });
    const latest = messages.at(-1)?.content || "";
    const recentUserMessages = messages.filter((message) => message.role === "user").map((message) => message.content);
    const previousWasHealth = recentUserMessages.slice(0, -1).some((content) => HEALTH_TERMS.test(content));
    const explicitTopicSwitch = GENERAL_SWITCH_TERMS.test(latest) && !HEALTH_TERMS.test(latest);
    const isShortContinuation = latest.trim().split(/\s+/).length <= 5;
    const isHealthRelated = !explicitTopicSwitch && (HEALTH_TERMS.test(latest) || (isShortContinuation && previousWasHealth));
    const isUrgent = URGENT_TERMS.test(latest);
    const language = body.language === "sw" ? "Kiswahili" : "English";
    let excerpts = "";
    let useOfficialWebSearch = false;

    if (isHealthRelated) {
      const vectorStoreId = process.env.OPENAI_STG_VECTOR_STORE_ID_2026;
      if (vectorStoreId) {
        const search = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/search`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ query: latest, max_num_results: 4, rewrite_query: true }) });
        const searchData = await search.json();
        if (search.ok) excerpts = Array.isArray(searchData.data) ? searchData.data.slice(0, 4).flatMap((result: { content?: Array<{ text?: string }> }) => result.content || []).map((item: { text?: string }) => item.text || "").filter(Boolean).join("\n\n---\n\n") : "";
      }
      useOfficialWebSearch = !excerpts;
    }

    const generalInstructions = `You are FastMed, a warm general-purpose AI assistant within JustCosta. Reply in ${language}. Follow the user's latest requested topic even when it differs from earlier messages. Continue naturally, including short replies such as Yes that refer to an earlier offer. Be useful and concise. Do not pretend to have completed real-world actions.`;
    const healthInstructions = `\nThe conversation is health-related. Give useful, careful general medical guidance, never a diagnosis or prescription. Ask useful follow-up questions when key context is missing. Do not fabricate patient facts or practitioners. Mention the practitioner directory only when professional care is contextually appropriate. Never claim information was shared. ${isUrgent ? "Put clear urgent-care advice first and tell the user not to wait for an AI reply." : "Identify red flags and recommend professional evaluation when appropriate."} Base condition-specific statements on the official Tanzania Ministry of Health STG/NEMLIT 7th Edition (2026). The official final document is https://www.moh.go.tz/storage/app/uploads/public/6a8/c97/408/6a8c97408b3be007728156.pdf. When web search is available, search only official Ministry of Health material and do not substitute an older edition. If the 2026 source does not support a specific claim, clearly say that it was not confirmed in the available excerpt. Format the response with short sections using these exact headings when relevant: URGENT HELP:, IMPORTANT:, and NEXT STEP:. Omit URGENT HELP when there is no urgent warning. For Kiswahili use HUDUMA YA HARAKA:, MUHIMU:, and HATUA INAYOFUATA:. End with exactly: ${SOURCE}`;
    const input = messages.map((message) => ({ role: message.role, content: message.content }));
    if (isHealthRelated && excerpts) input.push({ role: "user", content: `Relevant 2026 guideline excerpts:\n${excerpts}` });
    const responseBody: Record<string, unknown> = { model: process.env.OPENAI_MODEL || "gpt-5.4", store: false, max_output_tokens: 700, instructions: generalInstructions + (isHealthRelated ? healthInstructions : ""), input };
    if (useOfficialWebSearch) Object.assign(responseBody, { tools: [{ type: "web_search", filters: { allowed_domains: ["moh.go.tz"] }, search_context_size: "high" }], tool_choice: "auto", max_tool_calls: 2 });
    const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(responseBody) });
    const data = await response.json();
    if (!response.ok) { console.error("FastMed response failed", data); return NextResponse.json({ error: "FastMed could not respond right now. Please try again later." }, { status: 502 }); }
    const reply = textFromResponse(data);
    if (!reply) return NextResponse.json({ error: "FastMed returned no response. Please try again." }, { status: 502 });
    return NextResponse.json({ reply, isHealthRelated, source: isHealthRelated ? SOURCE : null });
  } catch (error) { console.error("FastMed error", error); return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 }); }
}
