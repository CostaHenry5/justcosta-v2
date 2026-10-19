"use client";
import { useState } from "react";
import { Check, Copy, ShieldCheck, Globe, AlertTriangle } from "lucide-react";
import type { ProSource } from "./api";

const HEADING = /^[A-Z][A-Z0-9 /&()'’-]{2,60}:\s*/;
const DANGER = /^(RED FLAGS|ESCALATE OR REFER IF|CONTRAINDICATIONS AND CAUTIONS|ALAMA ZA HATARI)/;

const SOURCE_LABEL: Record<ProSource, { text: string; Icon: typeof Globe; tone: string }> = {
  stg_index: { text: "Grounded in retrieved STG/NEMLIT 2026 excerpts", Icon: ShieldCheck, tone: "text-emerald-800 bg-emerald-50 border-emerald-200" },
  moh_web: { text: "Searched moh.go.tz — verify against the STG document", Icon: Globe, tone: "text-amber-900 bg-amber-50 border-amber-200" },
  none: { text: "Not grounded in guideline excerpts — verify before use", Icon: AlertTriangle, tone: "text-red-900 bg-red-50 border-red-200" },
};

export function ProAnswer({ text, source, showSource = true }: { text: string; source: ProSource; showSource?: boolean }) {
  const [copied, setCopied] = useState(false);
  const label = SOURCE_LABEL[source];
  // Tag each line with whether it sits under a danger heading (computed once, before rendering).
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Array<{ line: string; danger: boolean }>>((acc, line) => {
      const heading = HEADING.test(line);
      const danger = heading ? DANGER.test(line) : (acc.at(-1)?.danger ?? false);
      acc.push({ line, danger });
      return acc;
    }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[15px] leading-7 text-slate-800 sm:p-5">
      {lines.map(({ line: trimmed, danger: inDanger }, index) => {
          const headingMatch = trimmed.match(HEADING);
          if (headingMatch) {
            const rest = trimmed.slice(headingMatch[0].length);
            return (
              <div key={index} className="mt-4 first:mt-0">
                <p className={`text-xs font-extrabold tracking-[.12em] ${inDanger ? "text-red-700" : "text-indigo-800"}`}>
                  {headingMatch[0].replace(/:\s*$/, "")}
                </p>
                {rest && <p className="mt-1">{rest}</p>}
              </div>
            );
          }
          if (/^[-•]\s+/.test(trimmed))
            return (
              <p key={index} className={`mt-1 flex gap-2 ${inDanger ? "text-red-900" : ""}`}>
                <span aria-hidden="true" className={inDanger ? "text-red-500" : "text-indigo-400"}>•</span>
                <span>{trimmed.replace(/^[-•]\s+/, "")}</span>
              </p>
            );
          if (/^Source:/i.test(trimmed))
            return (
              <p key={index} className="mt-4 text-xs text-slate-500">
                {trimmed}
              </p>
            );
          return (
            <p key={index} className="mt-2">
              {trimmed}
            </p>
          );
        })}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        {showSource ? (
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${label.tone}`}>
            <label.Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label.text}
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              /* clipboard blocked */
            }
          }}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-800"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
