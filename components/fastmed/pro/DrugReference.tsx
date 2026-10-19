"use client";
import { FormEvent, useState } from "react";
import { Pill, Search } from "lucide-react";
import { askPro, type ProSource } from "./api";
import { ProAnswer } from "./ProAnswer";

const COMMON = [
  "Artemether-lumefantrine",
  "Amoxicillin",
  "Ceftriaxone",
  "Magnesium sulfate",
  "Oxytocin",
  "Metformin",
  "Amlodipine",
  "Paracetamol",
];

export function DrugReference({ language }: { language: "en" | "sw" }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ name: string; text: string; source: ProSource } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookUp(event?: FormEvent, name?: string) {
    event?.preventDefault();
    const medicine = (name ?? query).trim();
    if (!medicine || loading) return;
    setQuery(medicine);
    setLoading(true);
    setError("");
    try {
      const reply = await askPro({
        mode: "drug",
        language,
        messages: [{ role: "user", content: `Medicine: ${medicine}` }],
      });
      setResult({ name: medicine, text: reply.reply, source: reply.source });
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={lookUp} className="flex gap-3">
        <label htmlFor="drug-query" className="sr-only">
          Medicine name
        </label>
        <div className="relative flex-1">
          <Pill className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="drug-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={120}
            placeholder="Medicine name (generic), e.g. ceftriaxone"
            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-base focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <button
          disabled={!query.trim() || loading}
          className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-indigo-700 px-5 font-extrabold text-white disabled:opacity-40"
        >
          <Search className="h-4 w-4" aria-hidden="true" /> {loading ? "Looking up…" : "Look up"}
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {COMMON.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => lookUp(undefined, name)}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-indigo-400"
          >
            {name}
          </button>
        ))}
      </div>
      {error && <p className="font-semibold text-red-700">{error}</p>}
      {result && !loading && <ProAnswer text={result.text} source={result.source} />}
      <p className="text-xs leading-5 text-slate-500">
        Doses are reproduced from retrieved STG/NEMLIT 2026 text where available. Sections marked &quot;Not confirmed&quot;
        were not found in the retrieved excerpts. Always check the dose, the patient&apos;s weight, renal and hepatic
        function, allergies and pregnancy status before prescribing or administering.
      </p>
    </div>
  );
}
