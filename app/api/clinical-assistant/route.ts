import { NextResponse } from "next/server";
import type { ChatMessage } from "@/lib/fastmed-types";

const HEALTH_TERMS = /\b(pain|fever|cough|blood|bleed|breath|chest|vomit|diarrh|pregnan|medicine|dose|symptom|sick|hospital|doctor|nurse|clinic|health|maumivu|homa|kikohozi|damu|kupumua|kutapika|kuharisha|mimba|dawa|dalili|hospitali|daktari|muuguzi|afya)\b/i;
const URGENT_TERMS = /\b(chest pain|cannot breathe|can't breathe|severe bleeding|unconscious|seizure|stroke|self[- ]?harm|suicide|maumivu ya kifua|hawezi kupumua|damu nyingi|amepoteza fahamu|degedege|kujiua)\b/i;
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
    const isHealthRelated = HEALTH_TERMS.test(messages.filter((message) => message.role === "user").map((message) => message.content).join(" "));
    const isUrgent = URGENT_TERMS.test(latest);
    const language = body.language === "sw" ? "Kiswahili" : "English";
    let excerpts = "";

    if (isHealthRelated) {
      const vectorStoreId = process.env.OPENAI_STG_VECTOR_STORE_ID_2026;
      if (!vectorStoreId) return NextResponse.json({ error: "The 2026 Tanzania guideline library is not configured yet. FastMed will not substitute an older clinical guideline." }, { status: 503 });
      const search = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/search`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ query: latest, max_num_results: 4, rewrite_query: true }) });
      const searchData = await search.json();
      if (!search.ok) return NextResponse.json({ error: "The 2026 guideline library could not be searched right now." }, { status: 502 });
      excerpts = Array.isArray(searchData.data) ? searchData.data.slice(0, 4).flatMap((result: { content?: Array<{ text?: string }> }) => result.content || []).map((item: { text?: string }) => item.text || "").filter(Boolean).join("\n\n---\n\n") : "";
    }

    const generalInstructions = `You are FastMed, a warm general-purpose AI assistant within JustCosta. Reply in ${language}. Continue the conversation naturally, including short replies such as Yes that refer to an earlier offer. Be useful and concise. Do not pretend to have completed real-world actions.`;
    const healthInstructions = `\nThe conversation is health-related. Give careful general health information, never a diagnosis or prescription. Ask useful follow-up questions when key context is missing. Do not fabricate patient facts or practitioners. Mention the verified practitioner directory only when professional care is contextually appropriate. Never claim information was shared. ${isUrgent ? "Put clear urgent-care advice first and tell the user not to wait for an AI reply." : "Identify red flags and recommend professional evaluation when appropriate."} Base condition-specific statements only on the supplied Tanzania STG/NEMLIT 7th Edition (2026) excerpts. If excerpts are insufficient, say so. End with exactly: ${SOURCE}`;
    const input = messages.map((message) => ({ role: message.role, content: message.content }));
    if (isHealthRelated) input.push({ role: "user", content: `Relevant 2026 guideline excerpts:\n${excerpts || "No clearly relevant excerpt was found. Do not guess."}` });
    const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5.4", store: false, max_output_tokens: 700, instructions: generalInstructions + (isHealthRelated ? healthInstructions : ""), input }) });
    const data = await response.json();
    if (!response.ok) { console.error("FastMed response failed", data); return NextResponse.json({ error: "FastMed could not respond right now. Please try again later." }, { status: 502 }); }
    const reply = textFromResponse(data);
    if (!reply) return NextResponse.json({ error: "FastMed returned no response. Please try again." }, { status: 502 });
    return NextResponse.json({ reply, isHealthRelated, source: isHealthRelated ? SOURCE : null });
  } catch (error) { console.error("FastMed error", error); return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 }); }
}
