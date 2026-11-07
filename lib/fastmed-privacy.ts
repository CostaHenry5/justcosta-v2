/**
 * FastMED privacy helpers.
 *
 * Personal details are removed from every message BEFORE it is sent to the
 * AI provider (which runs outside Tanzania). Red-flag safety checks still run
 * on the original text, on our own server, so redaction never weakens safety.
 *
 * Deliberately conservative: it removes things that identify a person
 * (phone numbers, emails, ID/account numbers, a name the user states) and
 * leaves clinical numbers alone (temperatures, blood pressure, doses, dates).
 */

/** Bump when the consent wording changes; users are asked to agree again. */
export const CONSENT_VERSION = "2026-11-v1";

export type RedactionResult = { text: string; redactions: number };

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

// Tanzanian mobile numbers: +255 7xx xxx xxx, 255..., 07xx..., 06xx...
const TZ_PHONE = /(?:\+?255|\b0)[\s-]?[67]\d{2}[\s-]?\d{3}[\s-]?\d{3}\b/g;

// Any other long run of digits (9+ digits, spaces/dashes allowed between them):
// national ID (NIDA), insurance/membership numbers, bank or mobile-money accounts.
// Shorter numbers (39.5, 140/90, 500 mg, 2026-11-07) are kept.
const LONG_NUMBER = /\b\d(?:[\s-]?\d){8,}\b/g;

// A name the person states about themselves or the patient.
const NAME_INTRO =
  /\b(my name is|my name's|i am called|i'm called|call me|his name is|her name is|jina langu ni|jina lake ni|naitwa|anaitwa|mimi ni)\s+([A-Za-zÀ-ÿ'’-]+(?:\s+[A-Z][A-Za-zÀ-ÿ'’-]+){0,2})/gi;

// Words that commonly follow "mimi ni" / "naitwa" but are not names.
const NOT_A_NAME = new Set([
  "a", "an", "the", "not", "very", "so", "mgonjwa", "mjamzito", "mama", "baba", "mtoto", "mwanafunzi",
  "daktari", "muuguzi", "mwalimu", "mkulima", "mfanyabiashara", "mzee", "kijana", "msichana", "mvulana",
  "mgeni", "pregnant", "sick", "student", "nurse", "doctor", "teacher", "farmer", "mother", "father",
]);

export function redactPersonalData(input: string): RedactionResult {
  let redactions = 0;
  let text = input || "";

  text = text.replace(EMAIL, () => {
    redactions++;
    return "[email removed]";
  });
  text = text.replace(TZ_PHONE, () => {
    redactions++;
    return "[phone removed]";
  });
  text = text.replace(LONG_NUMBER, () => {
    redactions++;
    return "[number removed]";
  });
  text = text.replace(NAME_INTRO, (match, intro: string, name: string) => {
    const words = name.split(/\s+/);
    if (NOT_A_NAME.has(words[0].toLowerCase())) return match;
    // The first word is the name; later words count only if they are capitalised
    // (e.g. "Amina Juma"), so "my name is amina and I have fever" keeps "and I".
    let nameLength = 1;
    while (nameLength < words.length && /^[A-ZÀ-Þ]/.test(words[nameLength])) nameLength++;
    const rest = words.slice(nameLength).join(" ");
    redactions++;
    return `${intro} [name removed]${rest ? ` ${rest}` : ""}`;
  });

  return { text, redactions };
}

/** Redacts every message in a conversation; returns the total count. */
export function redactConversation<T extends { content: string }>(messages: T[]) {
  let total = 0;
  const cleaned = messages.map((message) => {
    const { text, redactions } = redactPersonalData(message.content);
    total += redactions;
    return { ...message, content: text };
  });
  return { messages: cleaned, redactions: total };
}
