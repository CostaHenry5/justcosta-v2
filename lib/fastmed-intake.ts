import type {
  Intake,
  IntakeForWhom,
  IntakeOnset,
  IntakePregnancy,
  IntakeSafetyContext,
  IntakeSeverity,
} from "@/lib/fastmed-types";
import { ruleById, type Language } from "@/lib/fastmed-safety";

export const EMPTY_INTAKE: Intake = {
  forWhom: "self",
  name: "",
  age: "",
  pregnant: "na",
  location: "",
  concern: "",
  onset: "",
  severity: "",
  dangerSigns: [],
  questions: "",
};

export const FOR_WHOM_LABEL: Record<IntakeForWhom, Record<Language, string>> = {
  self: { en: "Myself", sw: "Mimi mwenyewe" },
  child: { en: "My child", sw: "Mtoto wangu" },
  other: { en: "Someone else", sw: "Mtu mwingine" },
};

export const PREGNANCY_LABEL: Record<IntakePregnancy, Record<Language, string>> = {
  yes: { en: "Yes", sw: "Ndiyo" },
  no: { en: "No", sw: "Hapana" },
  unsure: { en: "Not sure", sw: "Sina uhakika" },
  na: { en: "Not applicable", sw: "Haihusiki" },
};

export const ONSET_LABEL: Record<IntakeOnset, Record<Language, string>> = {
  today: { en: "Today", sw: "Leo" },
  "1_3_days": { en: "1–3 days ago", sw: "Siku 1–3 zilizopita" },
  "4_7_days": { en: "4–7 days ago", sw: "Siku 4–7 zilizopita" },
  over_week: { en: "More than a week", sw: "Zaidi ya wiki moja" },
  over_month: { en: "More than a month", sw: "Zaidi ya mwezi mmoja" },
};

export const SEVERITY_LABEL: Record<IntakeSeverity, Record<Language, string>> = {
  mild: { en: "Mild — can do normal activities", sw: "Kidogo — naweza kufanya shughuli za kawaida" },
  moderate: { en: "Moderate — affecting daily activities", sw: "Wastani — inaathiri shughuli za kila siku" },
  severe: { en: "Severe — hard to function", sw: "Kali — ni vigumu kufanya chochote" },
};

export function intakeAge(intake: Intake): number | null {
  const value = Number.parseInt(intake.age, 10);
  return Number.isFinite(value) && value >= 0 && value <= 130 ? value : null;
}

/** Pregnancy question is shown for adults/teens who are not the user's child. */
export function pregnancyRelevant(intake: Intake) {
  const age = intakeAge(intake);
  return intake.forWhom !== "child" && age !== null && age >= 12 && age <= 55;
}

export function intakeSafety(intake: Intake): IntakeSafetyContext {
  return {
    age: intakeAge(intake),
    pregnant: intake.pregnant === "yes" || intake.pregnant === "unsure",
    dangerSigns: intake.dangerSigns,
  };
}

/** The structured message sent to the AI. Never includes the name or location. */
export function intakeToMessage(intake: Intake, language: Language) {
  const sw = language === "sw";
  const age = intakeAge(intake);
  const lines = [
    sw ? "Muhtasari wa uchunguzi wa awali:" : "Health check-in:",
    `${sw ? "Kwa ajili ya" : "For"}: ${FOR_WHOM_LABEL[intake.forWhom][language]}`,
    age !== null ? `${sw ? "Umri" : "Age"}: ${age === 0 ? (sw ? "chini ya mwaka 1" : "under 1 year") : age}` : "",
    pregnancyRelevant(intake) && intake.pregnant !== "na"
      ? `${sw ? "Ujauzito" : "Pregnant"}: ${PREGNANCY_LABEL[intake.pregnant][language]}`
      : "",
    `${sw ? "Tatizo kuu" : "Main concern"}: ${intake.concern.trim()}`,
    intake.onset ? `${sw ? "Ilianza" : "Started"}: ${ONSET_LABEL[intake.onset][language]}` : "",
    intake.severity ? `${sw ? "Ukali" : "Severity"}: ${SEVERITY_LABEL[intake.severity][language]}` : "",
    `${sw ? "Dalili za hatari" : "Danger signs"}: ${
      intake.dangerSigns.length
        ? intake.dangerSigns.map((id) => ruleById(id)?.label[language] ?? id).join("; ")
        : sw
          ? "hakuna iliyochaguliwa"
          : "none selected"
    }`,
    intake.questions.trim() ? `${sw ? "Maswali" : "Questions"}: ${intake.questions.trim()}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}
