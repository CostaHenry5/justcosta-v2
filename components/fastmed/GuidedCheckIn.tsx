"use client";
import { FormEvent, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ClipboardList } from "lucide-react";
import type { Intake, IntakeForWhom, IntakeOnset, IntakePregnancy, IntakeSeverity } from "@/lib/fastmed-types";
import { DANGER_SIGN_CHECKLIST, ruleById, type Language } from "@/lib/fastmed-safety";
import {
  EMPTY_INTAKE,
  FOR_WHOM_LABEL,
  ONSET_LABEL,
  PREGNANCY_LABEL,
  SEVERITY_LABEL,
  intakeAge,
  pregnancyRelevant,
} from "@/lib/fastmed-intake";

const T = {
  en: {
    eyebrow: "Quick health check-in",
    title: "Answer a few questions",
    intro: "About one minute. FastMed asks what a nurse would ask first, so the guidance fits your situation. You can also just type in the chat below.",
    step: (n: number) => `Step ${n} of 4`,
    who: "Who is this for?",
    age: "Age (years)",
    under1: "Under 1 year",
    pregnant: "Is the person pregnant, or could they be?",
    concern: "What is the main problem?",
    concernPlaceholder: "For example: fever and headache, cough, stomach pain…",
    onset: "When did it start?",
    severity: "How bad is it?",
    signs: "Is any of these happening now?",
    signsHint: "Tick all that apply. If any is ticked, FastMed will show emergency advice right away.",
    none: "None of these",
    extras: "Optional details",
    name: "Name",
    nameHint: "Stays on this device. Never sent to the AI.",
    location: "Region or district",
    locationHint: "Used only in your visit summary.",
    questions: "Questions or worries for the clinician",
    back: "Back",
    next: "Next",
    submit: "Get FastMed guidance",
    submitting: "Getting guidance…",
    required: "Please answer this question to continue.",
  },
  sw: {
    eyebrow: "Uchunguzi wa haraka wa afya",
    title: "Jibu maswali machache",
    intro: "Takriban dakika moja. FastMed inauliza kile ambacho muuguzi angeuliza kwanza, ili ushauri uendane na hali yako. Unaweza pia kuandika moja kwa moja kwenye mazungumzo hapa chini.",
    step: (n: number) => `Hatua ${n} kati ya 4`,
    who: "Ni kwa ajili ya nani?",
    age: "Umri (miaka)",
    under1: "Chini ya mwaka 1",
    pregnant: "Je, mhusika ni mjamzito, au anaweza kuwa?",
    concern: "Tatizo kuu ni nini?",
    concernPlaceholder: "Kwa mfano: homa na maumivu ya kichwa, kikohozi, maumivu ya tumbo…",
    onset: "Lilianza lini?",
    severity: "Ni kali kiasi gani?",
    signs: "Je, kuna mojawapo ya haya yanayotokea sasa?",
    signsHint: "Chagua yote yanayohusika. Ukichagua lolote, FastMed itaonyesha ushauri wa dharura mara moja.",
    none: "Hakuna kati ya haya",
    extras: "Maelezo ya hiari",
    name: "Jina",
    nameHint: "Linabaki kwenye kifaa hiki. Halitumwi kwa AI.",
    location: "Mkoa au wilaya",
    locationHint: "Linatumika kwenye muhtasari wako tu.",
    questions: "Maswali au wasiwasi kwa mtaalamu",
    back: "Rudi",
    next: "Endelea",
    submit: "Pata ushauri wa FastMed",
    submitting: "Inapata ushauri…",
    required: "Tafadhali jibu swali hili ili kuendelea.",
  },
};

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 rounded-xl border px-4 py-2 text-left text-sm font-bold transition ${
        selected
          ? "border-cyan-700 bg-cyan-700 text-white"
          : "border-slate-300 bg-white text-slate-800 hover:border-cyan-500"
      }`}
    >
      {children}
    </button>
  );
}

export function GuidedCheckIn({
  language,
  loading,
  onSubmit,
  onDangerSignsChange,
}: {
  language: Language;
  loading: boolean;
  onSubmit: (intake: Intake) => void;
  onDangerSignsChange: (ids: string[]) => void;
}) {
  const t = T[language];
  const [step, setStep] = useState(1);
  const [intake, setIntake] = useState<Intake>(EMPTY_INTAKE);
  const [noneTicked, setNoneTicked] = useState(false);
  const [error, setError] = useState("");

  const update = <K extends keyof Intake>(key: K, value: Intake[K]) =>
    setIntake((current) => ({ ...current, [key]: value }));

  const showPregnancy = pregnancyRelevant(intake);
  const age = intakeAge(intake);
  const isChild = intake.forWhom === "child" || (age !== null && age < 5);
  const pregnancyContext = showPregnancy && (intake.pregnant === "yes" || intake.pregnant === "unsure");
  const checklist = DANGER_SIGN_CHECKLIST.filter(
    (item) =>
      item.context === "any" ||
      (item.context === "child" && isChild) ||
      (item.context === "pregnancy" && pregnancyContext),
  );

  function toggleSign(id: string) {
    const next = intake.dangerSigns.includes(id)
      ? intake.dangerSigns.filter((sign) => sign !== id)
      : [...intake.dangerSigns, id];
    update("dangerSigns", next);
    setNoneTicked(false);
    onDangerSignsChange(next);
  }

  function valid(current: number) {
    if (current === 1) return age !== null && (!showPregnancy || intake.pregnant !== "na");
    if (current === 2) return intake.concern.trim().length > 1 && Boolean(intake.onset) && Boolean(intake.severity);
    if (current === 3) return noneTicked || intake.dangerSigns.length > 0;
    return true;
  }

  function next() {
    if (!valid(step)) return setError(t.required);
    setError("");
    setStep((value) => Math.min(4, value + 1));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (step < 4) return next();
    onSubmit({ ...intake, pregnant: showPregnancy ? intake.pregnant : "na" });
  }

  const inputClass =
    "mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-normal focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-100";

  return (
    <section className="rounded-3xl border border-cyan-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-start gap-3">
        <ClipboardList className="mt-1 h-6 w-6 shrink-0 text-cyan-700" aria-hidden="true" />
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-cyan-700">{t.eyebrow}</p>
          <h2 className="mt-1 text-2xl font-extrabold">{t.title}</h2>
          <p className="mt-1 text-slate-600">{t.intro}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-2 flex-1 rounded-full ${n <= step ? "bg-cyan-600" : "bg-slate-200"}`} />
        ))}
      </div>
      <p className="mt-2 text-sm font-bold text-slate-500">{t.step(step)}</p>

      <form onSubmit={submit} className="mt-4 space-y-5">
        {step === 1 && (
          <>
            <fieldset>
              <legend className="font-bold">{t.who}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(FOR_WHOM_LABEL) as IntakeForWhom[]).map((key) => (
                  <Chip key={key} selected={intake.forWhom === key} onClick={() => update("forWhom", key)}>
                    {FOR_WHOM_LABEL[key][language]}
                  </Chip>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-wrap items-end gap-3">
              <label className="font-bold">
                {t.age}
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={130}
                  value={intake.age}
                  onChange={(event) => update("age", event.target.value)}
                  className={`${inputClass} w-32`}
                />
              </label>
              <Chip selected={intake.age === "0"} onClick={() => update("age", "0")}>
                {t.under1}
              </Chip>
            </div>
            {showPregnancy && (
              <fieldset>
                <legend className="font-bold">{t.pregnant}</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(Object.keys(PREGNANCY_LABEL) as IntakePregnancy[]).map((key) => (
                    <Chip key={key} selected={intake.pregnant === key} onClick={() => update("pregnant", key)}>
                      {PREGNANCY_LABEL[key][language]}
                    </Chip>
                  ))}
                </div>
              </fieldset>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <label className="block font-bold">
              {t.concern}
              <textarea
                rows={3}
                maxLength={1500}
                value={intake.concern}
                onChange={(event) => update("concern", event.target.value)}
                placeholder={t.concernPlaceholder}
                className={`${inputClass} p-4`}
              />
            </label>
            <fieldset>
              <legend className="font-bold">{t.onset}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(ONSET_LABEL) as IntakeOnset[]).map((key) => (
                  <Chip key={key} selected={intake.onset === key} onClick={() => update("onset", key)}>
                    {ONSET_LABEL[key][language]}
                  </Chip>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="font-bold">{t.severity}</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {(Object.keys(SEVERITY_LABEL) as IntakeSeverity[]).map((key) => (
                  <Chip key={key} selected={intake.severity === key} onClick={() => update("severity", key)}>
                    {SEVERITY_LABEL[key][language]}
                  </Chip>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="font-bold">{t.signs}</legend>
            <p className="mt-1 text-sm text-slate-600">{t.signsHint}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {checklist.map((item) => {
                const checked = intake.dangerSigns.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm font-semibold ${
                      checked ? "border-red-400 bg-red-50 text-red-950" : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSign(item.id)}
                      className="mt-0.5 h-4 w-4 accent-red-700"
                    />
                    {ruleById(item.id)?.label[language]}
                  </label>
                );
              })}
              <label
                className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm font-bold sm:col-span-2 ${
                  noneTicked ? "border-cyan-500 bg-cyan-50" : "border-slate-200 bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={noneTicked}
                  onChange={(event) => {
                    setNoneTicked(event.target.checked);
                    if (event.target.checked) {
                      update("dangerSigns", []);
                      onDangerSignsChange([]);
                    }
                  }}
                  className="mt-0.5 h-4 w-4"
                />
                {t.none}
              </label>
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-2 font-bold">{t.extras}</legend>
            <label className="font-bold">
              {t.name}
              <input value={intake.name} onChange={(event) => update("name", event.target.value)} className={inputClass} />
              <span className="mt-1 block text-xs font-semibold text-slate-500">{t.nameHint}</span>
            </label>
            <label className="font-bold">
              {t.location}
              <input
                value={intake.location}
                onChange={(event) => update("location", event.target.value)}
                className={inputClass}
              />
              <span className="mt-1 block text-xs font-semibold text-slate-500">{t.locationHint}</span>
            </label>
            <label className="font-bold sm:col-span-2">
              {t.questions}
              <textarea
                rows={3}
                maxLength={800}
                value={intake.questions}
                onChange={(event) => update("questions", event.target.value)}
                className={`${inputClass} p-4`}
              />
            </label>
          </fieldset>
        )}

        {error && <p className="font-semibold text-red-700">{error}</p>}

        <div className="flex flex-wrap justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep((value) => value - 1);
              }}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 font-bold"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t.back}
            </button>
          ) : (
            <span />
          )}
          {step < 4 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-700 px-5 font-extrabold text-white"
            >
              {t.next} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="min-h-12 rounded-xl bg-cyan-700 px-6 font-extrabold text-white disabled:opacity-50"
            >
              {loading ? t.submitting : t.submit}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
