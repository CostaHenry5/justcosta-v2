"use client";
import { useEffect, useState } from "react";
import { ruleById } from "@/lib/fastmed-safety";

type Usage = {
  days: number;
  messages: number;
  conversations: number;
  healthRelated: number;
  swahili: number;
  usedCheckIn: number;
  messagesWithRedactions: number;
  triage: { emergency: number; urgent: number; soon: number; self_care: number };
  topRedFlags: Array<{ id: string; total: number }>;
};

const TRIAGE_ROWS: Array<{ key: keyof Usage["triage"]; label: string; colour: string }> = [
  { key: "emergency", label: "Emergency", colour: "bg-red-600" },
  { key: "urgent", label: "Urgent (24 h)", colour: "bg-orange-500" },
  { key: "soon", label: "Within days", colour: "bg-amber-400" },
  { key: "self_care", label: "Home care", colour: "bg-emerald-500" },
];

function percent(part: number, whole: number) {
  return whole ? `${Math.round((part / whole) * 100)}%` : "–";
}

/** Anonymous FastMED usage for the last 30 days. Shows counts only — no conversations. */
export function UsagePanel({ load }: { load: () => Promise<Usage> }) {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    load()
      .then(setUsage)
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load usage."));
  }, [load]);

  if (error)
    return <section className="mt-7 rounded-2xl bg-white p-6 shadow text-red-700 font-semibold">{error}</section>;
  if (!usage)
    return <section className="mt-7 rounded-2xl bg-white p-6 shadow text-slate-500">Loading usage…</section>;

  const triageTotal = Object.values(usage.triage).reduce((sum, value) => sum + value, 0);
  const stats = [
    { label: "Conversations", value: usage.conversations.toLocaleString() },
    { label: "Messages", value: usage.messages.toLocaleString() },
    { label: "Health-related", value: percent(usage.healthRelated, usage.messages) },
    { label: "In Kiswahili", value: percent(usage.swahili, usage.messages) },
    { label: "Started with check-in", value: percent(usage.usedCheckIn, usage.conversations) },
    { label: "Personal details removed", value: usage.messagesWithRedactions.toLocaleString() },
  ];

  return (
    <section className="mt-7 rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-extrabold">FastMED usage · last {usage.days} days</h2>
      <p className="mt-1 text-sm text-slate-600">
        Anonymous counts only. No messages, names or phone numbers are stored.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-slate-50 p-4">
            <p className="text-2xl font-extrabold text-cyan-900">{stat.value}</p>
            <p className="text-sm font-semibold text-slate-600">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-extrabold">Triage results</h3>
          <div className="mt-3 space-y-2">
            {TRIAGE_ROWS.map((row) => (
              <div key={row.key} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0 font-semibold text-slate-700">{row.label}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full ${row.colour}`}
                    style={{ width: triageTotal ? `${(usage.triage[row.key] / triageTotal) * 100}%` : "0%" }}
                  />
                </div>
                <span className="w-10 text-right font-bold">{usage.triage[row.key]}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-extrabold">Most common warning signs</h3>
          {usage.topRedFlags.length ? (
            <ol className="mt-3 space-y-1 text-sm">
              {usage.topRedFlags.map((flag) => (
                <li key={flag.id} className="flex justify-between gap-3">
                  <span>{ruleById(flag.id)?.label.en ?? flag.id}</span>
                  <span className="font-bold">{flag.total}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-slate-500">None detected yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
