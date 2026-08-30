"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AlertTriangle, ArrowLeft, ClipboardList, HeartPulse, ShieldCheck } from "lucide-react";

const urgentSigns = [
  "Trouble breathing, severe chest pain, or blue/grey lips",
  "Fainting, a new seizure, confusion, or sudden weakness on one side",
  "Severe bleeding, a serious injury, or thoughts of harming yourself or someone else",
];

export default function ClinicalAssistantPage() {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [concerns, setConcerns] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  function createSummary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowSummary(true);
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="mx-auto max-w-5xl px-6 py-12 sm:py-20">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700">
          <ArrowLeft size={18} />
          Back to JustCosta
        </Link>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
              <HeartPulse size={17} />
              Patient health visit helper
            </div>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Prepare for your next healthcare visit.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Use this private check-in to organise your symptoms and questions before speaking with a qualified healthcare professional.
            </p>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/40">
              <div className="flex gap-3">
                <AlertTriangle className="mt-1 shrink-0 text-amber-600" />
                <div>
                  <h2 className="font-bold text-amber-900 dark:text-amber-100">Get urgent help now if you have:</h2>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-900 dark:text-amber-100">
                    {urgentSigns.map((sign) => <li key={sign}>• {sign}</li>)}
                  </ul>
                  <p className="mt-3 text-sm font-semibold text-amber-900 dark:text-amber-100">
                    Contact your local emergency service or go to the nearest emergency department.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={createSummary} className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="flex items-center gap-3">
                <ClipboardList className="text-blue-600" />
                <h2 className="text-2xl font-bold">Your visit notes</h2>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Nothing entered here is stored or sent.</p>

              <label className="mt-6 block text-sm font-bold">
                What symptoms or concerns would you like to discuss?
                <textarea value={symptoms} onChange={(event) => setSymptoms(event.target.value)} required rows={4} placeholder="For example: headache, cough, pain, tiredness…" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950" />
              </label>

              <label className="mt-5 block text-sm font-bold">
                When did this begin, and has it changed?
                <textarea value={duration} onChange={(event) => setDuration(event.target.value)} required rows={3} placeholder="For example: started three days ago and is getting worse…" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950" />
              </label>

              <label className="mt-5 block text-sm font-bold">
                What questions or worries do you have?
                <textarea value={concerns} onChange={(event) => setConcerns(event.target.value)} rows={3} placeholder="For example: What could be causing this? What should I monitor?" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950" />
              </label>

              <button type="submit" className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
                Create my visit summary
              </button>
            </form>

            {showSummary && (
              <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/40">
                <h2 className="text-xl font-bold text-blue-950 dark:text-blue-100">Summary to share with a clinician</h2>
                <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-200">
                  <p><strong>Symptoms or concerns:</strong><br />{symptoms}</p>
                  <p><strong>When it began / changes:</strong><br />{duration}</p>
                  {concerns && <p><strong>Questions or worries:</strong><br />{concerns}</p>}
                </div>
              </section>
            )}
          </div>

          <aside className="h-fit rounded-2xl bg-slate-900 p-6 text-white">
            <ShieldCheck className="text-blue-300" size={28} />
            <h2 className="mt-4 text-xl font-bold">Important to know</h2>
            <p className="mt-3 leading-7 text-slate-300">
              This tool supports preparation for a healthcare visit. It is not a diagnosis, treatment plan, prescription, or emergency service.
            </p>
            <p className="mt-4 leading-7 text-slate-300">
              A qualified clinician who can assess you directly should make medical decisions.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
