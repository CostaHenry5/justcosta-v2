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
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [concerns, setConcerns] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [guidance, setGuidance] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function createSummary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowSummary(true);
    setGuidance("");
    setError("");
  }

  async function getGuidance() {
    setIsLoading(true);
    setError("");
    setGuidance("");
    try {
      const response = await fetch("/api/clinical-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, location, symptoms, duration, concerns }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "The AI service could not respond right now.");
      }
      setGuidance(data.guidance || "No guidance was returned. Please speak with a qualified clinician.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to JustCosta
        </Link>

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/30 sm:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
              <HeartPulse className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Patient health visit helper</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Prepare for your next healthcare visit.</h1>
              <p className="mt-4 max-w-2xl text-slate-300">Use this check-in to organise your symptoms, patient particulars, and questions before speaking with a qualified healthcare professional.</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-red-400/30 bg-red-500/10 p-5">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
              <div>
                <h2 className="font-semibold text-red-100">Get urgent help now if you have:</h2>
                <ul className="mt-3 space-y-2 text-sm text-red-100/90">
                  {urgentSigns.map((sign) => <li key={sign}>• {sign}</li>)}
                </ul>
                <p className="mt-3 text-sm text-red-100/90">Contact your local emergency service or go to the nearest emergency department.</p>
              </div>
            </div>
          </div>

          <form onSubmit={createSummary} className="mt-8 space-y-5">
            <div>
              <h2 className="text-xl font-semibold">Patient particulars</h2>
              <p className="mt-1 text-sm text-slate-400">These details help organise a visit summary. Your name stays on this page and is not sent to the AI.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-200">
                Patient name
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Optional" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400" />
              </label>
              <label className="block text-sm font-medium text-slate-200">
                Age
                <input value={age} onChange={(event) => setAge(event.target.value)} type="number" min="0" max="130" required placeholder="For example, 32" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400" />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-200">
              Location
              <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Region, district, or ward (optional)" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400" />
            </label>

            <div className="border-t border-slate-800 pt-5">
              <h2 className="text-xl font-semibold">Your visit notes</h2>
              <p className="mt-1 text-sm text-slate-400">Your notes are not stored by this website.</p>
            </div>

            <label className="block text-sm font-medium text-slate-200">
              What symptoms or concerns would you like to discuss?
              <textarea value={symptoms} onChange={(event) => setSymptoms(event.target.value)} required rows={4} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400" />
            </label>

            <label className="block text-sm font-medium text-slate-200">
              When did this begin, and has it changed?
              <textarea value={duration} onChange={(event) => setDuration(event.target.value)} required rows={3} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400" />
            </label>

            <label className="block text-sm font-medium text-slate-200">
              What questions or worries do you have?
              <textarea value={concerns} onChange={(event) => setConcerns(event.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400" />
            </label>

            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
              <ClipboardList className="h-5 w-5" />
              Create my visit summary
            </button>
          </form>

          {showSummary && (
            <section className="mt-8 rounded-2xl border border-cyan-400/25 bg-cyan-400/5 p-6">
              <h2 className="text-xl font-semibold text-cyan-100">Your visit summary</h2>
              <div className="mt-4 space-y-4 text-sm text-slate-200">
                {name && <p><span className="font-semibold text-slate-100">Patient name:</span> {name}</p>}
                <p><span className="font-semibold text-slate-100">Age:</span> {age}</p>
                {location && <p><span className="font-semibold text-slate-100">Location:</span> {location}</p>}
                <p><span className="font-semibold text-slate-100">Symptoms or concerns:</span> {symptoms}</p>
                <p><span className="font-semibold text-slate-100">When it began or changed:</span> {duration}</p>
                {concerns && <p><span className="font-semibold text-slate-100">Questions or worries:</span> {concerns}</p>}
              </div>

              <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-300">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                  <p>If you choose AI guidance, only your age, broad location, symptoms, timing, and concerns will be sent to the AI service. Your name is not sent. This website does not save a copy.</p>
                </div>
              </div>

              <button type="button" onClick={getGuidance} disabled={isLoading} className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60">
                {isLoading ? "Getting AI guidance..." : "Get AI guidance"}
              </button>

              {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
              {guidance && <div className="mt-5 whitespace-pre-wrap rounded-xl border border-slate-700 bg-slate-950/70 p-5 text-sm leading-6 text-slate-200">{guidance}</div>}
            </section>
          )}

          <div className="mt-8 flex gap-3 rounded-2xl border border-slate-700 bg-slate-950/50 p-5 text-sm text-slate-300">
            <ShieldCheck className="h-5 w-5 shrink-0 text-cyan-300" />
            <p><span className="font-semibold text-slate-100">Important to know:</span> This tool supports preparation for a healthcare visit. It is not a diagnosis, treatment plan, prescription, or emergency service. A qualified clinician who can assess you directly should make medical decisions.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
