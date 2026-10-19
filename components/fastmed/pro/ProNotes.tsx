"use client";
import { useState } from "react";
import { AlertTriangle, FileText } from "lucide-react";
import { askPro, looksIdentifying, type ProNoteType } from "./api";
import { ProAnswer } from "./ProAnswer";

const TYPES: Array<{ id: ProNoteType; label: string; hint: string }> = [
  { id: "soap", label: "SOAP note", hint: "Subjective, Objective, Assessment, Plan" },
  { id: "sbar", label: "SBAR handover", hint: "Situation, Background, Assessment, Recommendation" },
  { id: "referral", label: "Referral letter", hint: "For transfer to another facility or specialist" },
  { id: "discharge", label: "Discharge summary", hint: "Diagnosis, course, medicines, follow-up" },
];

export function ProNotes({ language }: { language: "en" | "sw" }) {
  const [type, setType] = useState<ProNoteType>("soap");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!notes.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const reply = await askPro({ mode: "notes", noteType: type, language, messages: [{ role: "user", content: notes }] });
      setResult(reply.reply);
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-4">
        {TYPES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={type === item.id}
            onClick={() => setType(item.id)}
            className={`rounded-xl border p-3 text-left ${
              type === item.id ? "border-indigo-700 bg-indigo-700 text-white" : "border-slate-300 bg-white hover:border-indigo-400"
            }`}
          >
            <span className="block font-extrabold">{item.label}</span>
            <span className={`mt-0.5 block text-xs ${type === item.id ? "text-indigo-100" : "text-slate-500"}`}>{item.hint}</span>
          </button>
        ))}
      </div>
      <label className="block font-bold">
        Rough notes
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={8}
          maxLength={8000}
          placeholder="e.g. 34F, 3/7 fever, chills, headache. T 38.9, P 104, BP 110/70. mRDT +ve. No danger signs. Started AL. Review 3/7."
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-4 font-mono text-sm font-normal focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </label>
      {looksIdentifying(notes) && (
        <p className="flex items-center gap-2 text-sm font-semibold text-amber-800">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" /> This looks like it may contain a phone or file number.
          Please remove patient identifiers.
        </p>
      )}
      <button
        type="button"
        onClick={generate}
        disabled={!notes.trim() || loading}
        className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-indigo-700 px-5 font-extrabold text-white disabled:opacity-40"
      >
        <FileText className="h-4 w-4" aria-hidden="true" /> {loading ? "Writing…" : `Create ${TYPES.find((t) => t.id === type)?.label}`}
      </button>
      {error && <p className="font-semibold text-red-700">{error}</p>}
      {result && !loading && <ProAnswer text={result} source="none" showSource={false} />}
      <p className="text-xs leading-5 text-slate-500">
        FastMED Pro uses only what you wrote and marks missing items as [not documented]. Review and edit before filing —
        you remain responsible for the record. Do not paste names, phone numbers or file numbers.
      </p>
    </div>
  );
}
