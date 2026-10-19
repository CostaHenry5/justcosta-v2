"use client";
import { FormEvent, useRef, useState } from "react";
import { AlertTriangle, RotateCcw, Send } from "lucide-react";
import type { ChatMessage } from "@/lib/fastmed-types";
import { askPro, looksIdentifying, type ProSource } from "./api";
import { ProAnswer } from "./ProAnswer";

const EXAMPLES = [
  "28-year-old woman, 32 weeks pregnant, BP 158/104, headache and blurred vision since this morning. Differentials and immediate management?",
  "3-year-old, fever 39.5°C for 2 days, fast breathing (RR 52), chest indrawing, still drinking. Classification and management?",
  "45-year-old man, known diabetic, 3 days of fever, dysuria and right flank pain. Workup and empirical treatment per STG?",
];

type Turn = ChatMessage & { source?: ProSource };

export function ProChat({ language }: { language: "en" | "sw" }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function submit(event?: FormEvent, text?: string) {
    event?.preventDefault();
    const content = (text ?? draft).trim();
    if (!content || loading) return;
    const next: Turn[] = [...turns, { role: "user", content }];
    setTurns(next);
    setDraft("");
    setError("");
    setLoading(true);
    abortRef.current = new AbortController();
    try {
      const result = await askPro({
        mode: "chat",
        language,
        messages: next.map(({ role, content: body }) => ({ role, content: body })),
        signal: abortRef.current.signal,
      });
      setTurns([...next, { role: "assistant", content: result.reply, source: result.source }]);
    } catch (caught) {
      if ((caught as Error).name !== "AbortError") setError((caught as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function newCase() {
    abortRef.current?.abort();
    setTurns([]);
    setDraft("");
    setError("");
  }

  return (
    <div className="space-y-4">
      {!turns.length && (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 sm:p-5">
          <p className="font-extrabold text-indigo-950">Describe a case</p>
          <p className="mt-1 text-sm text-slate-600">
            Age, sex, key symptoms and duration, vital signs, relevant history and what you have found so far. FastMED
            Pro returns red flags, differentials, workup and STG 2026 management.
          </p>
          <div className="mt-3 grid gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => submit(undefined, example)}
                className="rounded-xl border border-indigo-200 bg-white p-3 text-left text-sm text-slate-700 hover:border-indigo-400"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {turns.map((turn, index) =>
        turn.role === "user" ? (
          <div key={index} className="ml-auto max-w-3xl whitespace-pre-wrap rounded-2xl rounded-br-sm bg-indigo-700 p-4 text-white">
            {turn.content}
          </div>
        ) : (
          <div key={index} className="max-w-4xl">
            <ProAnswer text={turn.content} source={turn.source ?? "none"} />
          </div>
        ),
      )}
      {loading && <div className="max-w-xl rounded-2xl bg-slate-100 p-4 text-slate-600">Reviewing the case against STG 2026…</div>}
      {error && <p className="font-semibold text-red-700">{error}</p>}

      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
        <label htmlFor="pro-case" className="sr-only">
          Case details or follow-up question
        </label>
        <div className="flex items-end gap-3">
          <textarea
            id="pro-case"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            rows={3}
            maxLength={4000}
            placeholder={turns.length ? "Add findings or ask a follow-up…" : "Describe the case…"}
            className="min-h-20 flex-1 resize-y rounded-xl border border-slate-300 bg-white p-3 text-base focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <button
            disabled={!draft.trim() || loading}
            aria-label="Send"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-700 text-white disabled:opacity-40"
          >
            <Send className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {looksIdentifying(draft) && (
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-amber-800">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" /> This looks like it may contain a phone or file number.
            Please remove patient identifiers.
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>De-identify cases. Decision support only — verify before acting.</span>
          {turns.length > 0 && (
            <button type="button" onClick={newCase} className="inline-flex items-center gap-1 text-sm font-bold text-indigo-800">
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> New case
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
