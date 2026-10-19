/**
 * FastMED safety rules.
 *
 * Deterministic red-flag detection that runs BEFORE and ALONGSIDE the AI.
 * The same rules run in the browser (instant emergency banner) and on the
 * server (forces urgent-first instructions and sets a minimum triage level).
 *
 * Principle: rules can only RAISE the triage level, never lower it.
 * Patterns are deliberately broad — a false alarm is safer than a miss.
 */

export type TriageLevel = "emergency" | "urgent" | "soon" | "self_care";
export type Language = "en" | "sw";

export const TRIAGE_RANK: Record<TriageLevel, number> = {
  self_care: 0,
  soon: 1,
  urgent: 2,
  emergency: 3,
};

export type RedFlagContext = "any" | "child" | "pregnancy";
export type RedFlagCategory = "physical" | "mental_health";

export type RedFlagRule = {
  id: string;
  level: Extract<TriageLevel, "emergency" | "urgent">;
  context: RedFlagContext;
  category: RedFlagCategory;
  label: Record<Language, string>;
  patterns: RegExp[];
};

export const RED_FLAG_RULES: RedFlagRule[] = [
  // ---- Any age -----------------------------------------------------------
  {
    id: "chest_pain",
    level: "emergency",
    context: "any",
    category: "physical",
    label: { en: "Chest pain", sw: "Maumivu ya kifua" },
    patterns: [
      /chest (pain|tightness|pressure)/,
      /pain in (my|the|his|her) chest/,
      /maumivu ya kifua/,
      /kifua (kinauma|kinabana)/,
    ],
  },
  {
    id: "breathing",
    level: "emergency",
    context: "any",
    category: "physical",
    label: { en: "Difficulty breathing", sw: "Shida ya kupumua" },
    patterns: [
      /(can'?t|cannot|unable to|not able to|struggling to|hard to) breathe/,
      /difficulty (in )?breathing/,
      /short(ness)? of breath/,
      /gasping/,
      /breathing (very )?(fast|fast and hard|badly)/,
      /(hawezi|siwezi|anashindwa|nashindwa) kupumua/,
      /kupumua kwa shida/,
      /(kubanwa|anabanwa|nabanwa) na pumzi/,
      /anapumua (kwa haraka|haraka sana)/,
    ],
  },
  {
    id: "stroke",
    level: "emergency",
    context: "any",
    category: "physical",
    label: {
      en: "Signs of stroke (face drooping, one-sided weakness, slurred speech)",
      sw: "Dalili za kiharusi (uso kulegea, udhaifu upande mmoja, kuongea kwa shida)",
    },
    patterns: [
      /face (is )?droop/,
      /one[- ]sided weakness/,
      /weak(ness)? on one side/,
      /(can'?t|cannot) move (my|his|her|one) (arm|leg|side)/,
      /slurred speech/,
      /sudden(ly)? (can'?t|cannot|unable to) (speak|talk)/,
      /\bstroke\b/,
      /kiharusi/,
      /kupooza/,
      /udhaifu upande mmoja/,
      /(anaongea|naongea) kwa shida/,
    ],
  },
  {
    id: "unconscious",
    level: "emergency",
    context: "any",
    category: "physical",
    label: {
      en: "Fainting, unconsciousness or severe confusion",
      sw: "Kuzimia, kupoteza fahamu au kuchanganyikiwa sana",
    },
    patterns: [
      /unconscious/,
      /passed out/,
      /fainted|fainting/,
      /(not|won'?t|can'?t) wak(e|ing) up/,
      /unresponsive/,
      /(very|suddenly|severely) confused/,
      /(amepoteza|kupoteza) fahamu/,
      /(amezimia|kuzimia)/,
      /hajitambui/,
      /hazinduki/,
      /amechanganyikiwa/,
    ],
  },
  {
    id: "seizure",
    level: "emergency",
    context: "any",
    category: "physical",
    label: { en: "Seizure or convulsions", sw: "Degedege au kifafa" },
    patterns: [
      /seizure/,
      /convuls/,
      /\bfitting\b/,
      /having fits/,
      /degedege/,
      /kifafa/,
      /anatetemeka mwili mzima/,
    ],
  },
  {
    id: "severe_bleeding",
    level: "emergency",
    context: "any",
    category: "physical",
    label: {
      en: "Heavy bleeding, or vomiting/coughing blood",
      sw: "Kutokwa na damu nyingi, au kutapika/kukohoa damu",
    },
    patterns: [
      /(severe|heavy|a lot of|lots of) bleeding/,
      /bleeding (heavily|a lot|won'?t stop|that won'?t stop|nonstop)/,
      /(vomit(ing)?|throwing up|coughing( up)?) blood/,
      /blood in (my |the )?vomit/,
      /damu nyingi/,
      /damu (haikomi|haiachi)/,
      /(anatapika|natapika|kutapika) damu/,
      /(anakohoa|nakohoa|kukohoa) damu/,
    ],
  },
  {
    id: "anaphylaxis",
    level: "emergency",
    context: "any",
    category: "physical",
    label: {
      en: "Swelling of the throat, tongue or lips",
      sw: "Kuvimba koo, ulimi au midomo",
    },
    patterns: [
      /swollen (throat|tongue|lips)/,
      /(throat|tongue|lips) (is |are )?(swelling|swollen)/,
      /throat (is )?closing/,
      /anaphyla/,
      /kuvimba (koo|ulimi|midomo)/,
      /(koo|ulimi|midomo) (imevimba|umevimba|inavimba)/,
    ],
  },
  {
    id: "poisoning",
    level: "emergency",
    context: "any",
    category: "physical",
    label: { en: "Poisoning or overdose", sw: "Sumu au kumeza dawa nyingi" },
    patterns: [
      /poison/,
      /overdose/,
      /swallowed (bleach|chemical|pills|tablets|battery|kerosene|paraffin)/,
      /drank (bleach|poison|kerosene|paraffin|pesticide)/,
      /\bsumu\b/,
      /amekunywa (mafuta ya taa|dawa ya wadudu)/,
      /amemeza (vidonge|dawa) (vingi|nyingi)/,
    ],
  },
  {
    id: "meningitis",
    level: "emergency",
    context: "any",
    category: "physical",
    label: { en: "Stiff neck with fever", sw: "Shingo kukaza pamoja na homa" },
    patterns: [/stiff neck/, /neck (is )?stiff/, /shingo (imekaza|ngumu|inakaza)/],
  },
  {
    id: "serious_injury",
    level: "emergency",
    context: "any",
    category: "physical",
    label: {
      en: "Serious injury, head injury or bad burn",
      sw: "Jeraha kubwa, jeraha la kichwa au kuungua vibaya",
    },
    patterns: [
      /head injury/,
      /hit (my|his|her|the) head/,
      /hit by (a )?(car|motorbike|bodaboda|bus|truck)/,
      /(severe|bad|serious) (burn|injury|accident)/,
      /deep (cut|wound)/,
      /broken bone sticking out/,
      /jeraha (kubwa|la kichwa)/,
      /(amegongwa|amegongwa na gari|amegongwa na pikipiki)/,
      /(ameungua|kuungua) vibaya/,
    ],
  },
  {
    id: "self_harm",
    level: "emergency",
    context: "any",
    category: "mental_health",
    label: {
      en: "Thoughts of suicide or self-harm",
      sw: "Mawazo ya kujiua au kujidhuru",
    },
    patterns: [
      /suicid/,
      /kill (myself|himself|herself)/,
      /end (my|his|her) (own )?life/,
      /self[- ]?harm/,
      /hurt(ing)? myself/,
      /want to die/,
      /don'?t want to (live|be alive)/,
      /kujiua/,
      /kujidhuru/,
      /nataka kufa/,
      /sitaki kuishi/,
    ],
  },
  {
    id: "severe_abdominal_pain",
    level: "urgent",
    context: "any",
    category: "physical",
    label: { en: "Severe abdominal pain", sw: "Maumivu makali ya tumbo" },
    patterns: [
      /(severe|extreme|unbearable|very bad) (abdominal|stomach|belly|tummy) pain/,
      /maumivu makali ya tumbo/,
      /tumbo linauma sana/,
    ],
  },
  {
    id: "high_fever",
    level: "urgent",
    context: "any",
    category: "physical",
    label: { en: "Very high fever", sw: "Homa kali sana" },
    patterns: [
      /(very high|extremely high|high grade) fever/,
      /fever (of |above |over )?(39|40|41)/,
      /(39|40|41)(\.\d)? ?(°|deg|c\b)/,
      /homa kali/,
    ],
  },
  {
    id: "dehydration",
    level: "urgent",
    context: "any",
    category: "physical",
    label: {
      en: "Signs of dehydration (no urine, cannot keep fluids down)",
      sw: "Dalili za upungufu wa maji (hakojoi, hawezi kubaki na maji)",
    },
    patterns: [
      /(no|not passing|haven'?t passed|hasn'?t passed) urine/,
      /(can'?t|cannot) keep (any )?(water|fluids|anything) down/,
      /(hajakojoa|sijakojoa|hakojoi)/,
      /hawezi kubaki na (maji|chochote)/,
    ],
  },

  // ---- Children (IMCI general danger signs) ------------------------------
  {
    id: "child_not_feeding",
    level: "emergency",
    context: "child",
    category: "physical",
    label: {
      en: "Child unable to drink or breastfeed",
      sw: "Mtoto hawezi kunywa au kunyonya",
    },
    patterns: [
      /(not|unable to|can'?t|won'?t|refus(es|ing) to|stopped) (drink(ing)?|breastfeed(ing)?|feed(ing)?|nurs(e|ing)|suck(ing)?)/,
      /(hanyonyi|hawezi kunyonya|hawezi kunywa|anakataa kunyonya|ameacha kunyonya)/,
    ],
  },
  {
    id: "child_vomits_everything",
    level: "emergency",
    context: "child",
    category: "physical",
    label: { en: "Child vomits everything", sw: "Mtoto anatapika kila kitu" },
    patterns: [/vomit(s|ing)? everything/, /throw(s|ing) up everything/, /(anatapika|kutapika) kila kitu/],
  },
  {
    id: "child_lethargic",
    level: "emergency",
    context: "child",
    category: "physical",
    label: {
      en: "Child very sleepy, floppy or hard to wake",
      sw: "Mtoto ana usingizi mzito, amelegea au haamki kwa urahisi",
    },
    patterns: [
      /very sleepy/,
      /letharg/,
      /floppy/,
      /hard to wake/,
      /usingizi mzito/,
      /amelegea/,
      /haamki/,
    ],
  },

  // ---- Pregnancy danger signs -------------------------------------------
  {
    id: "pregnancy_bleeding",
    level: "emergency",
    context: "pregnancy",
    category: "physical",
    label: { en: "Bleeding during pregnancy", sw: "Kutokwa na damu wakati wa ujauzito" },
    patterns: [/bleed/, /spotting/, /\bdamu\b/],
  },
  {
    id: "pregnancy_headache_vision",
    level: "emergency",
    context: "pregnancy",
    category: "physical",
    label: {
      en: "Severe headache or blurred vision in pregnancy",
      sw: "Maumivu makali ya kichwa au kuona ukungu wakati wa ujauzito",
    },
    patterns: [
      /(severe|bad|terrible) headache/,
      /(blurred|blurry|double) vision/,
      /seeing (spots|stars|flashing)/,
      /maumivu makali ya kichwa/,
      /kichwa kinauma sana/,
      /kuona (ukungu|giza|nyota)/,
    ],
  },
  {
    id: "pregnancy_abdominal_pain",
    level: "emergency",
    context: "pregnancy",
    category: "physical",
    label: {
      en: "Severe abdominal pain in pregnancy",
      sw: "Maumivu makali ya tumbo wakati wa ujauzito",
    },
    patterns: [
      /(severe|strong|bad|sharp) (abdominal|stomach|belly|tummy|lower belly) pain/,
      /maumivu makali ya tumbo/,
      /tumbo linauma sana/,
    ],
  },
  {
    id: "pregnancy_waters",
    level: "urgent",
    context: "pregnancy",
    category: "physical",
    label: {
      en: "Waters broken or leaking fluid",
      sw: "Chupa kupasuka au maji kutoka",
    },
    patterns: [/water(s)? (broke|has broken|have broken)/, /leaking fluid/, /chupa (imepasuka|kupasuka)/, /maji yanatoka/],
  },
  {
    id: "pregnancy_fetal_movement",
    level: "urgent",
    context: "pregnancy",
    category: "physical",
    label: {
      en: "Baby moving less than usual",
      sw: "Mtoto tumboni anacheza kidogo kuliko kawaida",
    },
    patterns: [
      /baby (is )?(not moving|moving less|stopped moving)/,
      /(reduced|less|decreased) (fetal |baby )?movement/,
      /mtoto (hachezi|amepunguza kucheza|ameacha kucheza)/,
      /hachezi tumboni/,
    ],
  },
  {
    id: "pregnancy_fever",
    level: "urgent",
    context: "pregnancy",
    category: "physical",
    label: { en: "Fever during pregnancy", sw: "Homa wakati wa ujauzito" },
    patterns: [/fever/, /\bhoma\b/],
  },
  {
    id: "pregnancy_swelling",
    level: "urgent",
    context: "pregnancy",
    category: "physical",
    label: {
      en: "Sudden swelling of face or hands in pregnancy",
      sw: "Kuvimba ghafla uso au mikono wakati wa ujauzito",
    },
    patterns: [/swollen (face|hands)/, /(face|hands) (are |is )?swollen/, /kuvimba (uso|mikono)/],
  },
];

/** Checklist shown in the guided check-in. Each item maps to a rule id. */
export const DANGER_SIGN_CHECKLIST: Array<{ id: string; context: RedFlagContext }> = [
  { id: "breathing", context: "any" },
  { id: "chest_pain", context: "any" },
  { id: "unconscious", context: "any" },
  { id: "seizure", context: "any" },
  { id: "severe_bleeding", context: "any" },
  { id: "stroke", context: "any" },
  { id: "child_not_feeding", context: "child" },
  { id: "child_vomits_everything", context: "child" },
  { id: "child_lethargic", context: "child" },
  { id: "pregnancy_bleeding", context: "pregnancy" },
  { id: "pregnancy_headache_vision", context: "pregnancy" },
  { id: "pregnancy_fetal_movement", context: "pregnancy" },
  { id: "self_harm", context: "any" },
];

export function ruleById(id: string) {
  return RED_FLAG_RULES.find((rule) => rule.id === id);
}

const CHILD_WORDS =
  /\b(baby|babies|infant|newborn|toddler|my (son|daughter|child|kid)|child|mtoto|watoto|kichanga|mwanangu)\b/;
const PREGNANCY_WORDS = /\b(pregnan\w*|expecting a baby|mimba|mjamzito|ujauzito)\b/;
const NEGATION_BEFORE =
  /\b(no|not|without|denies|denied|never|don'?t|doesn'?t|didn'?t|haven'?t|hasn'?t|hakuna|bila|sina|hana|hajawa na)\s+(\w+\s+){0,2}$/;

export type SafetyContext = {
  /** Age in years, if known. */
  age?: number | null;
  /** True when the user said the patient is (or may be) pregnant. */
  pregnant?: boolean | null;
  /** Danger signs ticked in the guided check-in. */
  checkedSigns?: string[];
};

export type SafetyResult = {
  level: TriageLevel | null;
  flags: RedFlagRule[];
  mentalHealth: boolean;
  isChild: boolean;
  isPregnancy: boolean;
};

function normalise(text: string) {
  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, " ");
}

function matchesWithoutNegation(text: string, pattern: RegExp) {
  const global = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
  for (const match of text.matchAll(global)) {
    const before = text.slice(Math.max(0, (match.index ?? 0) - 40), match.index ?? 0);
    if (!NEGATION_BEFORE.test(before)) return true;
  }
  return false;
}

export function detectRedFlags(rawText: string, context: SafetyContext = {}): SafetyResult {
  const text = normalise(rawText || "");
  const isChild =
    (typeof context.age === "number" && context.age >= 0 && context.age < 5) ||
    CHILD_WORDS.test(text);
  const isPregnancy = Boolean(context.pregnant) || PREGNANCY_WORDS.test(text);
  const checked = new Set(context.checkedSigns || []);

  const flags = RED_FLAG_RULES.filter((rule) => {
    if (checked.has(rule.id)) return true;
    if (rule.context === "child" && !isChild) return false;
    if (rule.context === "pregnancy" && !isPregnancy) return false;
    return rule.patterns.some((pattern) => matchesWithoutNegation(text, pattern));
  });

  // When a pregnancy rule fires, drop the weaker general duplicate.
  const ids = new Set(flags.map((flag) => flag.id));
  const deduped = flags.filter(
    (flag) => !(flag.id === "severe_abdominal_pain" && ids.has("pregnancy_abdominal_pain")),
  );

  const level = deduped.reduce<TriageLevel | null>(
    (highest, flag) =>
      highest === null || TRIAGE_RANK[flag.level] > TRIAGE_RANK[highest] ? flag.level : highest,
    null,
  );

  return {
    level,
    flags: deduped,
    mentalHealth: deduped.some((flag) => flag.category === "mental_health"),
    isChild,
    isPregnancy,
  };
}

/** Returns the more serious of two triage levels. Rules can only raise, never lower. */
export function highestTriage(a: TriageLevel | null | undefined, b: TriageLevel | null | undefined) {
  if (!a) return b ?? null;
  if (!b) return a;
  return TRIAGE_RANK[a] >= TRIAGE_RANK[b] ? a : b;
}

const TRIAGE_LINE = /^\s*(TRIAGE|KIWANGO)\s*:\s*(EMERGENCY|URGENT|SOON|SELF[_ ]?CARE)\s*$/im;

/** Pulls the model's "TRIAGE: X" line out of a reply and returns the cleaned text. */
export function extractTriage(reply: string): { level: TriageLevel | null; text: string } {
  const match = reply.match(TRIAGE_LINE);
  if (!match) return { level: null, text: reply.trim() };
  const raw = match[2].toUpperCase().replace(/[ _]/g, "");
  const level: TriageLevel =
    raw === "EMERGENCY" ? "emergency" : raw === "URGENT" ? "urgent" : raw === "SOON" ? "soon" : "self_care";
  return { level, text: reply.replace(TRIAGE_LINE, "").replace(/\n{3,}/g, "\n\n").trim() };
}

export const TRIAGE_COPY: Record<
  TriageLevel,
  Record<Language, { title: string; action: string }>
> = {
  emergency: {
    en: {
      title: "Emergency — go now",
      action: "Go to the nearest hospital emergency department now. Do not wait.",
    },
    sw: {
      title: "Dharura — nenda sasa",
      action: "Nenda kitengo cha dharura cha hospitali iliyo karibu sasa hivi. Usisubiri.",
    },
  },
  urgent: {
    en: {
      title: "Urgent — see a clinician within 24 hours",
      action: "Get checked at a clinic or hospital today or within 24 hours. Go sooner if things get worse.",
    },
    sw: {
      title: "Haraka — muone mtaalamu ndani ya saa 24",
      action: "Pata uchunguzi kliniki au hospitali leo au ndani ya saa 24. Wahi mapema hali ikizidi.",
    },
  },
  soon: {
    en: {
      title: "See a clinician in the next few days",
      action: "Book a clinic visit in the next few days. Go sooner if new warning signs appear.",
    },
    sw: {
      title: "Muone mtaalamu ndani ya siku chache",
      action: "Panga kwenda kliniki ndani ya siku chache. Wahi mapema dalili za hatari zikijitokeza.",
    },
  },
  self_care: {
    en: {
      title: "Home care and monitor",
      action: "This can usually be managed at home for now. Seek care if it lasts, worsens or warning signs appear.",
    },
    sw: {
      title: "Huduma ya nyumbani na ufuatiliaji",
      action: "Kwa sasa hali hii mara nyingi hudhibitiwa nyumbani. Tafuta huduma ikiendelea, ikizidi au dalili za hatari zikitokea.",
    },
  },
};
