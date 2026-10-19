import { NextResponse } from "next/server";
import type { ChatMessage } from "@/lib/fastmed-types";

/**
 * FastMED Pro — clinician-facing AI.
 * Modes:
 *  - chat:  case-based clinical reasoning (differentials, workup, management per STG)
 *  - drug:  drug reference from STG/NEMLIT 2026
 *  - notes: turn rough notes into structured documentation
 */

type Mode = "chat" | "drug" | "notes";
const NOTE_TYPES = ["soap", "referral", "sbar", "discharge"] as const;
type NoteType = (typeof NOTE_TYPES)[number];

const STG_URL =
  "https://www.moh.go.tz/storage/app/uploads/public/6a8/c97/408/6a8c97408b3be007728156.pdf";
const SOURCE_LINE =
  "Source: Tanzania Ministry of Health STG/NEMLIT, 7th Edition (2026), where retrieved excerpts were available.";

function textFromResponse(data: {
  output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
}) {
  return (data.output || [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content || [])
    .filter((part) => part.type === "output_text")
    .map((part) => part.text || "")
    .join("\n")
    .trim();
}

async function searchGuidelines(apiKey: string, query: string) {
  const vectorStoreId = process.env.OPENAI_STG_VECTOR_STORE_ID_2026;
  if (!vectorStoreId || !query.trim()) return "";
  try {
    const search = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/search`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: query.slice(0, 1000), max_num_results: 6, rewrite_query: true }),
    });
    if (!search.ok) return "";
    const data = await search.json();
    return Array.isArray(data.data)
      ? data.data
          .slice(0, 6)
          .flatMap((result: { content?: Array<{ text?: string }> }) => result.content || [])
          .map((item: { text?: string }) => item.text || "")
          .filter(Boolean)
          .join("\n\n---\n\n")
      : "";
  } catch {
    return "";
  }
}

const COMMON = `You are FastMED Pro, a clinical decision-support assistant for qualified healthcare professionals in Tanzania (nurses, midwives, clinical officers, doctors, pharmacists). The user has confirmed they are a healthcare professional; write for a clinician, using standard clinical terminology, concisely and practically.
Ground condition-specific and drug-specific statements in the Tanzania Ministry of Health Standard Treatment Guidelines and National Essential Medicines List (STG/NEMLIT), 7th Edition (2026), official document: ${STG_URL}. Never substitute an older edition. If a detail is not in the retrieved 2026 material, say "Not confirmed in retrieved STG 2026 excerpts" and, where helpful, give widely accepted practice clearly labelled as such.
Never invent doses, guideline recommendations, references, or patient facts. Flag uncertainty explicitly. Highlight life-threatening possibilities and when to escalate or refer.
You support but do not replace clinical judgement; the treating clinician remains responsible.
Use plain text only: no Markdown, asterisks, hash marks, or tables. Put each heading on its own line in CAPITALS followed by a colon. Use short lines starting with "- " for lists.`;

const MODE_INSTRUCTIONS: Record<Mode, string> = {
  chat: `TASK: Case-based clinical reasoning. Use these headings as relevant: SUMMARY:, RED FLAGS:, DIFFERENTIAL DIAGNOSIS: (most likely first, with brief for/against points; mark must-not-miss diagnoses), SUGGESTED WORKUP:, MANAGEMENT PER STG 2026: (include doses only when stated in the retrieved STG material, with route, frequency, duration and adult/child distinction), ESCALATE OR REFER IF:, KEY UNCERTAINTIES:. If essential history or examination findings are missing, list the most useful questions first.`,
  drug: `TASK: Drug reference. For the named medicine use these headings: MEDICINE:, NEMLIT LISTING: (level of use / formulations if stated), INDICATIONS PER STG 2026:, ADULT DOSE:, PAEDIATRIC DOSE:, CONTRAINDICATIONS AND CAUTIONS:, IMPORTANT INTERACTIONS:, PREGNANCY AND BREASTFEEDING:, MONITORING:. State doses exactly as given in the retrieved STG/NEMLIT text. If a section is not covered by the retrieved material, write "Not confirmed in retrieved STG 2026 excerpts" for that section rather than filling it from memory. If the query is not a medicine, say so briefly.`,
  notes: `TASK: Clinical documentation. Rewrite the clinician's rough notes into the requested document. Use ONLY information present in the notes; never add findings, results, diagnoses or plans that were not written. Where an expected item is missing, write "[not documented]". Keep abbreviations the clinician used. Do not include patient names or identifiers even if present; replace them with "[patient]". Do not add an STG source line for this task.`,
};

const NOTE_FORMATS: Record<NoteType, string> = {
  soap: "Format: SOAP note with headings SUBJECTIVE:, OBJECTIVE:, ASSESSMENT:, PLAN:.",
  referral:
    "Format: referral letter with headings REASON FOR REFERRAL:, HISTORY:, EXAMINATION FINDINGS:, INVESTIGATIONS:, TREATMENT GIVEN:, REQUEST:.",
  sbar: "Format: SBAR handover with headings SITUATION:, BACKGROUND:, ASSESSMENT:, RECOMMENDATION:.",
  discharge:
    "Format: discharge summary with headings DIAGNOSIS:, PRESENTATION:, COURSE IN FACILITY:, MEDICATIONS ON DISCHARGE:, FOLLOW-UP:, ADVICE GIVEN:.",
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey)
    return NextResponse.json({ error: "FastMED Pro is not configured yet. Please try again later." }, { status: 503 });

  try {
    const body = await request.json();
    const mode: Mode = body.mode === "drug" || body.mode === "notes" ? body.mode : "chat";
    const language = body.language === "sw" ? "Kiswahili" : "English";
    const noteType: NoteType = NOTE_TYPES.includes(body.noteType) ? body.noteType : "soap";

    const messages: ChatMessage[] = Array.isArray(body.messages)
      ? body.messages
          .filter(
            (message: ChatMessage) =>
              (message.role === "user" || message.role === "assistant") && typeof message.content === "string",
          )
          .slice(mode === "chat" ? -12 : -1)
      : [];
    if (!messages.length || messages.at(-1)?.role !== "user" || !messages.at(-1)?.content.trim())
      return NextResponse.json({ error: "Please enter some text first." }, { status: 400 });
    const totalLength = messages.reduce((sum, message) => sum + message.content.length, 0);
    if (totalLength > 16000)
      return NextResponse.json({ error: "This is too long. Please shorten it or start a new case." }, { status: 400 });

    const latest = messages.at(-1)!.content;
    const excerpts = mode === "notes" ? "" : await searchGuidelines(apiKey, mode === "drug" ? `${latest} dose indications` : latest);
    const useWebSearch = mode !== "notes" && !excerpts;

    const instructions = [
      COMMON,
      MODE_INSTRUCTIONS[mode],
      mode === "notes" ? NOTE_FORMATS[noteType] : "",
      `Reply in ${language}. Keep drug names, units and doses in standard international form.`,
      mode !== "notes" ? `End with this line exactly: ${SOURCE_LINE}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const input = messages.map((message) => ({ role: message.role, content: message.content }));
    if (excerpts) input.push({ role: "user", content: `Retrieved STG/NEMLIT 2026 excerpts:\n${excerpts}` });

    const responseBody: Record<string, unknown> = {
      model: process.env.OPENAI_MODEL || "gpt-5.4",
      store: false,
      max_output_tokens: mode === "notes" ? 1400 : 1800,
      instructions,
      input,
    };
    if (useWebSearch)
      Object.assign(responseBody, {
        tools: [{ type: "web_search", filters: { allowed_domains: ["moh.go.tz"] }, search_context_size: "high" }],
        tool_choice: "required",
        max_tool_calls: 2,
      });

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(responseBody),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("FastMED Pro response failed", data);
      return NextResponse.json({ error: "FastMED Pro could not respond right now. Please try again." }, { status: 502 });
    }
    const reply = textFromResponse(data)
      .replace(/\*\*/g, "")
      .replace(/^#{1,6}\s*/gm, "")
      .trim();
    if (!reply) return NextResponse.json({ error: "FastMED Pro returned no answer. Please try again." }, { status: 502 });

    const source = excerpts ? "stg_index" : useWebSearch ? "moh_web" : "none";
    return NextResponse.json({ reply, source, mode });
  } catch (error) {
    console.error("FastMED Pro error", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
