"use client";
import { useState } from "react";
import Link from "next/link";
import { BadgeCheck, Stethoscope } from "lucide-react";

export const ROLES = [
  "Registered Nurse",
  "Nurse-Midwife",
  "Clinical Officer",
  "Medical Doctor",
  "Pharmacist",
  "Other licensed health professional",
  "Health professions student (supervised)",
] as const;
export type ProRole = (typeof ROLES)[number];

export type Attestation = { role: ProRole; confirmedAt: string };
const STORAGE_KEY = "fastmed-pro-attestation";

export function readAttestation(): Attestation | null {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && ROLES.includes(saved.role) && typeof saved.confirmedAt === "string") return saved;
  } catch {
    /* storage unavailable */
  }
  return null;
}

export function clearAttestation() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

const STATEMENTS = [
  "I am a qualified healthcare professional (or a supervised student) and will use FastMED Pro only to support my own clinical work.",
  "I understand FastMED Pro is decision support. It can be wrong, and it does not replace my clinical judgement, local protocols or a senior's advice.",
  "I will verify doses and recommendations against the STG/NEMLIT 2026 or another authoritative source before acting.",
  "I will not enter patient names, phone numbers, file numbers or other identifiers.",
];

export function ProGate({ onConfirm }: { onConfirm: (attestation: Attestation) => void }) {
  const [role, setRole] = useState<ProRole | "">("");
  const [checked, setChecked] = useState<boolean[]>(STATEMENTS.map(() => false));
  const ready = role !== "" && checked.every(Boolean);

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-indigo-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
          <Stethoscope className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold">For healthcare professionals</h2>
          <p className="mt-1 text-slate-600">
            FastMED Pro gives clinical-level information, including medicine doses. Please confirm the following to
            continue.
          </p>
        </div>
      </div>

      <label className="mt-6 block font-bold">
        Your role
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as ProRole)}
          className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-normal focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Select your role…</option>
          {ROLES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-5 space-y-3">
        {STATEMENTS.map((statement, index) => (
          <label key={statement} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 text-sm leading-6">
            <input
              type="checkbox"
              checked={checked[index]}
              onChange={(event) =>
                setChecked((current) => current.map((value, i) => (i === index ? event.target.checked : value)))
              }
              className="mt-1 h-4 w-4 accent-indigo-700"
            />
            {statement}
          </label>
        ))}
      </div>

      <button
        type="button"
        disabled={!ready}
        onClick={() => {
          if (!role) return;
          const attestation: Attestation = { role, confirmedAt: new Date().toISOString() };
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attestation));
          } catch {
            /* keep for this visit only */
          }
          onConfirm(attestation);
        }}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 font-extrabold text-white disabled:opacity-40"
      >
        <BadgeCheck className="h-5 w-5" aria-hidden="true" /> Continue to FastMED Pro
      </button>
      <p className="mt-4 text-center text-sm text-slate-500">
        Not a healthcare professional?{" "}
        <Link href="/clinical-assistant" className="font-bold text-cyan-800 underline">
          Use FastMED health support instead
        </Link>
        .
      </p>
    </section>
  );
}
