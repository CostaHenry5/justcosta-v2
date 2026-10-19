"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, FileText, LogOut, MessagesSquare, Pill, Stethoscope } from "lucide-react";
import { ProGate, clearAttestation, readAttestation, type Attestation } from "@/components/fastmed/pro/ProGate";
import { ProChat } from "@/components/fastmed/pro/ProChat";
import { DrugReference } from "@/components/fastmed/pro/DrugReference";
import { Calculators } from "@/components/fastmed/pro/Calculators";
import { ProNotes } from "@/components/fastmed/pro/ProNotes";

const TABS = [
  { id: "chat", label: "Clinical chat", Icon: MessagesSquare, intro: "Case-based reasoning: red flags, differentials, workup and STG 2026 management." },
  { id: "drug", label: "Drug reference", Icon: Pill, intro: "Indications, doses and cautions from the STG/NEMLIT 2026." },
  { id: "calc", label: "Calculators", Icon: Calculator, intro: "Doses, fluids, burns, GCS, BMI and MAP — calculated on your device." },
  { id: "notes", label: "Notes", Icon: FileText, intro: "Turn rough notes into a SOAP note, SBAR handover, referral or discharge summary." },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function FastMedProPage() {
  const [attestation, setAttestation] = useState<Attestation | null>(null);
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState<TabId>("chat");
  const [language, setLanguage] = useState<"en" | "sw">("en");

  useEffect(() => {
    queueMicrotask(() => {
      setAttestation(readAttestation());
      setChecked(true);
    });
  }, []);

  const active = TABS.find((item) => item.id === tab)!;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef2ff_0,#f8fafc_30rem)] px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/clinical-assistant"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 font-bold text-indigo-800 hover:bg-indigo-50"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" /> FastMED health support
          </Link>
          {attestation && (
            <button
              type="button"
              onClick={() => {
                clearAttestation();
                setAttestation(null);
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-slate-600 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> Leave Pro
            </button>
          )}
        </div>

        <header className="rounded-3xl border border-indigo-100 bg-white/90 p-5 shadow-sm sm:p-8">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-700 text-white">
              <Stethoscope className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[.16em] text-indigo-700">FastMED Pro</p>
              <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Clinical decision support</h1>
              <p className="mt-2 max-w-3xl leading-7 text-slate-600">
                For nurses, midwives, clinical officers, doctors and pharmacists in Tanzania. Grounded in the Tanzania
                Ministry of Health STG/NEMLIT, 7th Edition (2026).
              </p>
              {attestation && (
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Signed in as: {attestation.role} (self-confirmed)
                </p>
              )}
            </div>
          </div>
        </header>

        {!checked ? null : !attestation ? (
          <ProGate onConfirm={setAttestation} />
        ) : (
          <>
            <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="FastMED Pro tools">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={tab === id}
                  onClick={() => setTab(id)}
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 font-extrabold ${
                    tab === id ? "border-indigo-700 bg-indigo-700 text-white" : "border-slate-200 bg-white text-slate-800 hover:border-indigo-400"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" /> {label}
                </button>
              ))}
            </nav>

            <section className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-slate-600">{active.intro}</p>
                {tab !== "calc" && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-600">Answer in</span>
                    {(["en", "sw"] as const).map((code) => (
                      <button
                        key={code}
                        type="button"
                        aria-pressed={language === code}
                        onClick={() => setLanguage(code)}
                        className={
                          language === code
                            ? "rounded-full bg-indigo-700 px-3 py-1.5 text-sm font-bold text-white"
                            : "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold"
                        }
                      >
                        {code === "en" ? "English" : "Kiswahili"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Keep every tool mounted so work isn't lost when switching tabs. */}
              <div hidden={tab !== "chat"}>
                <ProChat language={language} />
              </div>
              <div hidden={tab !== "drug"}>
                <DrugReference language={language} />
              </div>
              <div hidden={tab !== "calc"}>
                <Calculators />
              </div>
              <div hidden={tab !== "notes"}>
                <ProNotes language={language} />
              </div>
            </section>

            <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              <strong>Clinical decision support only.</strong> FastMED Pro can make mistakes and does not replace clinical
              judgement, local protocols or senior review. Verify doses and recommendations against the STG/NEMLIT 2026
              before acting. Text you send is processed by FastMED&apos;s AI service to generate answers and is not saved
              by FastMED. Do not enter patient identifiers.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
