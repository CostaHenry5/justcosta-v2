import type { ChatMessage } from "@/lib/fastmed-types";

export type ProMode = "chat" | "drug" | "notes";
export type ProNoteType = "soap" | "referral" | "sbar" | "discharge";
export type ProSource = "stg_index" | "moh_web" | "none";
export type ProReply = { reply: string; source: ProSource };

export async function askPro(options: {
  mode: ProMode;
  messages: ChatMessage[];
  language: "en" | "sw";
  noteType?: ProNoteType;
  signal?: AbortSignal;
}): Promise<ProReply> {
  const response = await fetch("/api/fastmed-pro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: options.mode,
      messages: options.messages,
      language: options.language,
      noteType: options.noteType,
    }),
    signal: options.signal,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "FastMED Pro could not respond right now.");
  return { reply: String(data.reply || ""), source: (data.source as ProSource) || "none" };
}

/** Very small check for things that look like patient identifiers. */
export function looksIdentifying(text: string) {
  return /\b(mrn|file no\.?|reg(istration)? no\.?|ip no\.?|nida)\b|\b\d{8,}\b|\+?255\s?\d{3}\s?\d{3}\s?\d{3}/i.test(text);
}
