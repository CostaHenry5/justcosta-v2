/**
 * FastMED red-flag test cases, English and Kiswahili.
 *
 * Each case is a message a real person might type, and the triage level the
 * SAFETY RULES must give it (before the AI is involved).
 *   "emergency" / "urgent" = the rules must catch it.
 *   null = the rules must NOT raise an alarm (the AI still answers normally).
 *
 * Clinician review: every case has `reviewed: false` until a clinician has
 * checked the expected level. Add new cases whenever a real conversation
 * reveals a gap (with all personal details removed).
 */
import type { SafetyContext, TriageLevel } from "../lib/fastmed-safety";

export type SafetyCase = {
  id: string;
  lang: "en" | "sw";
  text: string;
  context?: SafetyContext;
  expect: Extract<TriageLevel, "emergency" | "urgent"> | null;
  /** A rule id that must be among the flags (optional). */
  flag?: string;
  reviewed: boolean;
};

export const SAFETY_CASES: SafetyCase[] = [
  // ---- Breathing ---------------------------------------------------------
  { id: "en-breath-1", lang: "en", text: "I can't breathe properly since this morning", expect: "emergency", flag: "breathing", reviewed: false },
  { id: "en-breath-2", lang: "en", text: "my dad is short of breath and his lips look blue", expect: "emergency", flag: "breathing", reviewed: false },
  { id: "sw-breath-1", lang: "sw", text: "Nashindwa kupumua tangu jana usiku", expect: "emergency", flag: "breathing", reviewed: false },
  { id: "sw-breath-2", lang: "sw", text: "mama yangu anapumua kwa shida sana", expect: "emergency", flag: "breathing", reviewed: false },
  { id: "sw-breath-3", lang: "sw", text: "nabanwa na pumzi nikitembea kidogo", expect: "emergency", flag: "breathing", reviewed: false },
  { id: "sw-breath-4", lang: "sw", text: "mtoto anapumua haraka sana na mbavu zinavutika ndani", expect: "emergency", flag: "breathing", reviewed: false },

  // ---- Chest pain --------------------------------------------------------
  { id: "en-chest-1", lang: "en", text: "Sudden chest pain spreading to my left arm", expect: "emergency", flag: "chest_pain", reviewed: false },
  { id: "en-chest-2", lang: "en", text: "there is a heavy pressure in my chest and I am sweating", expect: "emergency", flag: "chest_pain", reviewed: false },
  { id: "sw-chest-1", lang: "sw", text: "Nina maumivu ya kifua makali", expect: "emergency", flag: "chest_pain", reviewed: false },
  { id: "sw-chest-2", lang: "sw", text: "kifua kinauma sana upande wa kushoto", expect: "emergency", flag: "chest_pain", reviewed: false },
  { id: "sw-chest-3", lang: "sw", text: "nahisi kifua kinabana", expect: "emergency", flag: "chest_pain", reviewed: false },

  // ---- Stroke ------------------------------------------------------------
  { id: "en-stroke-1", lang: "en", text: "my grandmother's face is drooping and her speech is slurred", expect: "emergency", flag: "stroke", reviewed: false },
  { id: "en-stroke-2", lang: "en", text: "he suddenly can't move his right arm", expect: "emergency", flag: "stroke", reviewed: false },
  { id: "sw-stroke-1", lang: "sw", text: "Baba ameanza kuongea kwa shida na mkono mmoja haufanyi kazi", expect: "emergency", flag: "stroke", reviewed: false },
  { id: "sw-stroke-2", lang: "sw", text: "nadhani bibi amepata kiharusi", expect: "emergency", flag: "stroke", reviewed: false },
  { id: "sw-stroke-3", lang: "sw", text: "upande mmoja wa mwili umepooza ghafla", expect: "emergency", flag: "stroke", reviewed: false },

  // ---- Unconscious / confusion ------------------------------------------
  { id: "en-unc-1", lang: "en", text: "She fainted twice today", expect: "emergency", flag: "unconscious", reviewed: false },
  { id: "en-unc-2", lang: "en", text: "my brother is unresponsive after drinking", expect: "emergency", flag: "unconscious", reviewed: false },
  { id: "sw-unc-1", lang: "sw", text: "amezimia ghafla sokoni", expect: "emergency", flag: "unconscious", reviewed: false },
  { id: "sw-unc-2", lang: "sw", text: "mgonjwa amepoteza fahamu", expect: "emergency", flag: "unconscious", reviewed: false },
  { id: "sw-unc-3", lang: "sw", text: "babu hajitambui tangu asubuhi", expect: "emergency", flag: "unconscious", reviewed: false },

  // ---- Seizures ----------------------------------------------------------
  { id: "en-seiz-1", lang: "en", text: "my son is having a seizure right now", expect: "emergency", flag: "seizure", reviewed: false },
  { id: "sw-seiz-1", lang: "sw", text: "mtoto ana degedege na homa", expect: "emergency", flag: "seizure", reviewed: false },
  { id: "sw-seiz-2", lang: "sw", text: "ameanguka na kutetemeka, nadhani ni kifafa", expect: "emergency", flag: "seizure", reviewed: false },

  // ---- Bleeding ----------------------------------------------------------
  { id: "en-bleed-1", lang: "en", text: "I am vomiting blood", expect: "emergency", flag: "severe_bleeding", reviewed: false },
  { id: "en-bleed-2", lang: "en", text: "deep cut on my leg and the bleeding won't stop", expect: "emergency", reviewed: false },
  { id: "sw-bleed-1", lang: "sw", text: "Natapika damu tangu jana", expect: "emergency", flag: "severe_bleeding", reviewed: false },
  { id: "sw-bleed-2", lang: "sw", text: "anakohoa damu kila siku", expect: "emergency", flag: "severe_bleeding", reviewed: false },
  { id: "sw-bleed-3", lang: "sw", text: "damu inatoka nyingi kwenye jeraha na haikomi", expect: "emergency", flag: "severe_bleeding", reviewed: false },

  // ---- Allergy / poisoning ----------------------------------------------
  { id: "en-ana-1", lang: "en", text: "after the injection her lips are swollen and throat is closing", expect: "emergency", flag: "anaphylaxis", reviewed: false },
  { id: "sw-ana-1", lang: "sw", text: "midomo imevimba baada ya kula karanga", expect: "emergency", flag: "anaphylaxis", reviewed: false },
  { id: "en-poison-1", lang: "en", text: "my toddler drank kerosene", expect: "emergency", flag: "poisoning", reviewed: false },
  { id: "sw-poison-1", lang: "sw", text: "mtoto amekunywa mafuta ya taa", expect: "emergency", flag: "poisoning", reviewed: false },
  { id: "sw-poison-2", lang: "sw", text: "amemeza vidonge vingi kwa makusudi", expect: "emergency", flag: "poisoning", reviewed: false },

  // ---- Meningitis / injury ----------------------------------------------
  { id: "en-mening-1", lang: "en", text: "high fever and a stiff neck", expect: "emergency", flag: "meningitis", reviewed: false },
  { id: "sw-mening-1", lang: "sw", text: "ana homa na shingo imekaza", expect: "emergency", flag: "meningitis", reviewed: false },
  { id: "en-injury-1", lang: "en", text: "he was hit by a bodaboda and hit his head", expect: "emergency", flag: "serious_injury", reviewed: false },
  { id: "sw-injury-1", lang: "sw", text: "amegongwa na pikipiki barabarani", expect: "emergency", flag: "serious_injury", reviewed: false },
  { id: "sw-injury-2", lang: "sw", text: "mtoto ameungua vibaya na maji ya moto", expect: "emergency", flag: "serious_injury", reviewed: false },

  // ---- Mental health -----------------------------------------------------
  { id: "en-mh-1", lang: "en", text: "I don't want to live anymore", expect: "emergency", flag: "self_harm", reviewed: false },
  { id: "en-mh-2", lang: "en", text: "I keep thinking about ending my life", expect: "emergency", flag: "self_harm", reviewed: false },
  { id: "sw-mh-1", lang: "sw", text: "Nina mawazo ya kujiua", expect: "emergency", flag: "self_harm", reviewed: false },
  { id: "sw-mh-2", lang: "sw", text: "sitaki kuishi tena", expect: "emergency", flag: "self_harm", reviewed: false },
  { id: "sw-mh-3", lang: "sw", text: "nimechoka na maisha, nataka kufa", expect: "emergency", flag: "self_harm", reviewed: false },

  // ---- Urgent (24 h) -----------------------------------------------------
  { id: "en-abd-1", lang: "en", text: "severe stomach pain since last night", expect: "urgent", flag: "severe_abdominal_pain", reviewed: false },
  { id: "sw-abd-1", lang: "sw", text: "tumbo linauma sana tangu jana", expect: "urgent", flag: "severe_abdominal_pain", reviewed: false },
  { id: "en-fever-1", lang: "en", text: "fever of 40 degrees for two days", expect: "urgent", flag: "high_fever", reviewed: false },
  { id: "sw-fever-1", lang: "sw", text: "nina homa kali na kutetemeka", expect: "urgent", flag: "high_fever", reviewed: false },
  { id: "en-dehyd-1", lang: "en", text: "diarrhoea all day and she can't keep any water down", expect: "urgent", flag: "dehydration", reviewed: false },
  { id: "sw-dehyd-1", lang: "sw", text: "anaharisha na hajakojoa tangu asubuhi", expect: "urgent", flag: "dehydration", reviewed: false },

  // ---- Children ----------------------------------------------------------
  { id: "en-child-1", lang: "en", text: "my baby is not breastfeeding and very sleepy", expect: "emergency", reviewed: false },
  { id: "en-child-2", lang: "en", text: "my child vomits everything she eats", expect: "emergency", flag: "child_vomits_everything", reviewed: false },
  { id: "sw-child-1", lang: "sw", text: "mtoto hanyonyi tangu jana", expect: "emergency", flag: "child_not_feeding", reviewed: false },
  { id: "sw-child-2", lang: "sw", text: "mwanangu anatapika kila kitu", expect: "emergency", flag: "child_vomits_everything", reviewed: false },
  { id: "sw-child-3", lang: "sw", text: "mtoto amelegea na haamki vizuri", expect: "emergency", flag: "child_lethargic", reviewed: false },
  { id: "ctx-child-1", lang: "en", text: "won't drink anything since morning", context: { age: 2 }, expect: "emergency", flag: "child_not_feeding", reviewed: false },

  // ---- Pregnancy ---------------------------------------------------------
  { id: "en-preg-1", lang: "en", text: "I'm 7 months pregnant and bleeding", expect: "emergency", flag: "pregnancy_bleeding", reviewed: false },
  { id: "en-preg-2", lang: "en", text: "pregnant with a severe headache and blurred vision", expect: "emergency", flag: "pregnancy_headache_vision", reviewed: false },
  { id: "sw-preg-1", lang: "sw", text: "Nina mimba ya miezi sita na natokwa na damu", expect: "emergency", flag: "pregnancy_bleeding", reviewed: false },
  { id: "sw-preg-2", lang: "sw", text: "mjamzito, kichwa kinauma sana na naona ukungu", expect: "emergency", flag: "pregnancy_headache_vision", reviewed: false },
  { id: "sw-preg-3", lang: "sw", text: "nina ujauzito na mtoto hachezi tumboni tangu jana", expect: "urgent", flag: "pregnancy_fetal_movement", reviewed: false },
  { id: "sw-preg-4", lang: "sw", text: "nina mimba na chupa imepasuka", expect: "urgent", flag: "pregnancy_waters", reviewed: false },
  { id: "ctx-preg-1", lang: "en", text: "I have a fever and chills", context: { pregnant: true }, expect: "urgent", flag: "pregnancy_fever", reviewed: false },

  // ---- Must NOT alarm ----------------------------------------------------
  { id: "en-neg-1", lang: "en", text: "I have a mild cough but no chest pain and no difficulty breathing", expect: null, reviewed: false },
  { id: "en-neg-2", lang: "en", text: "what foods are good for high blood pressure?", expect: null, reviewed: false },
  { id: "en-neg-3", lang: "en", text: "runny nose and sneezing for two days", expect: null, reviewed: false },
  { id: "en-neg-4", lang: "en", text: "how do I prepare for my clinic visit next week?", expect: null, reviewed: false },
  { id: "sw-neg-1", lang: "sw", text: "nina mafua kidogo, sina homa", expect: null, reviewed: false },
  { id: "sw-neg-2", lang: "sw", text: "hakuna maumivu ya kifua, ni kikohozi tu", expect: null, reviewed: false },
  { id: "sw-neg-3", lang: "sw", text: "ni vyakula gani vinafaa kwa mgonjwa wa kisukari?", expect: null, reviewed: false },
  { id: "sw-neg-4", lang: "sw", text: "kichwa kinauma kidogo baada ya kazi", expect: null, reviewed: false },
  { id: "gen-neg-1", lang: "en", text: "who won the football match yesterday?", expect: null, reviewed: false },
];

/** Personal-detail redaction checks: `mustRemove` must disappear, `mustKeep` must stay. */
export const REDACTION_CASES: Array<{ id: string; text: string; mustRemove: string[]; mustKeep: string[] }> = [
  { id: "phone-1", text: "Nipigie 0712 345 678 tafadhali", mustRemove: ["0712 345 678"], mustKeep: ["Nipigie"] },
  { id: "phone-2", text: "my number is +255 754 123 456", mustRemove: ["754 123 456"], mustKeep: ["my number is"] },
  { id: "phone-3", text: "call 255683112233 now", mustRemove: ["255683112233"], mustKeep: ["call"] },
  { id: "email-1", text: "email me at amina.j@example.com", mustRemove: ["amina.j@example.com"], mustKeep: ["email me"] },
  { id: "nida-1", text: "NIDA yangu ni 19900101-12345-00001-23", mustRemove: ["19900101-12345-00001-23"], mustKeep: ["NIDA yangu"] },
  { id: "name-1", text: "My name is Amina Juma and I have a fever", mustRemove: ["Amina", "Juma"], mustKeep: ["and I have a fever"] },
  { id: "name-2", text: "Jina langu ni Baraka, nina homa", mustRemove: ["Baraka"], mustKeep: ["nina homa"] },
  { id: "name-3", text: "naitwa Neema na nina mimba", mustRemove: ["Neema"], mustKeep: ["nina mimba"] },
  { id: "keep-1", text: "Mimi ni mjamzito wa miezi 6", mustRemove: [], mustKeep: ["mjamzito wa miezi 6"] },
  { id: "keep-2", text: "BP 150/95, temperature 39.5, took 500 mg on 2026-11-06", mustRemove: [], mustKeep: ["150/95", "39.5", "500 mg", "2026-11-06"] },
  { id: "keep-3", text: "mtoto ana miezi 18, uzito kilo 10", mustRemove: [], mustKeep: ["miezi 18", "kilo 10"] },
];
