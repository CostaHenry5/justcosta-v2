"use client";
import { useState } from "react";
import { Check, Copy, Download, FileText, MessageCircle, Printer } from "lucide-react";
import type { ChatMessage, Intake } from "@/lib/fastmed-types";
import { TRIAGE_COPY, type Language, type RedFlagRule, type TriageLevel } from "@/lib/fastmed-safety";
import {
  FOR_WHOM_LABEL,
  ONSET_LABEL,
  PREGNANCY_LABEL,
  SEVERITY_LABEL,
  intakeAge,
  pregnancyRelevant,
} from "@/lib/fastmed-intake";

type Props = {
  language: Language;
  intake: Intake | null;
  intakeMessage: string | null;
  messages: ChatMessage[];
  triage: TriageLevel | null;
  flags: RedFlagRule[];
};

export function buildVisitSummary({ language, intake, intakeMessage, messages, triage, flags }: Props) {
  const sw = language === "sw";
  const L = (en: string, swText: string) => (sw ? swText : en);
  const date = new Date().toLocaleDateString(sw ? "sw-TZ" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const lines: string[] = [L("FASTMED VISIT SUMMARY", "MUHTASARI WA FASTMED KWA AJILI YA KLINIKI"), `${L("Date", "Tarehe")}: ${date}`, ""];

  if (intake) {
    const age = intakeAge(intake);
    lines.push(L("PATIENT", "MGONJWA"));
    if (intake.name.trim()) lines.push(`${L("Name", "Jina")}: ${intake.name.trim()}`);
    if (age !== null) lines.push(`${L("Age", "Umri")}: ${age === 0 ? L("under 1 year", "chini ya mwaka 1") : age}`);
    lines.push(`${L("Completed by", "Imejazwa na")}: ${FOR_WHOM_LABEL[intake.forWhom][language]}`);
    if (pregnancyRelevant(intake) && intake.pregnant !== "na")
      lines.push(`${L("Pregnant", "Ujauzito")}: ${PREGNANCY_LABEL[intake.pregnant][language]}`);
    if (intake.location.trim()) lines.push(`${L("Location", "Mahali")}: ${intake.location.trim()}`);
    lines.push("", L("MAIN CONCERN", "TATIZO KUU"), intake.concern.trim());
    if (intake.onset) lines.push(`${L("Started", "Ilianza")}: ${ONSET_LABEL[intake.onset][language]}`);
    if (intake.severity) lines.push(`${L("Severity", "Ukali")}: ${SEVERITY_LABEL[intake.severity][language]}`);
    lines.push("");
  }

  lines.push(L("WARNING SIGNS", "DALILI ZA HATARI"));
  lines.push(flags.length ? flags.map((flag) => `- ${flag.label[language]}`).join("\n") : L("None reported", "Hakuna zilizoripotiwa"));
  lines.push("");

  if (triage) {
    lines.push(L("FASTMED SUGGESTED LEVEL OF CARE", "KIWANGO CHA HUDUMA KILICHOPENDEKEZWA NA FASTMED"));
    lines.push(TRIAGE_COPY[triage][language].title, "");
  }

  const otherMessages = messages
    .filter((message) => message.role === "user" && message.content !== intakeMessage)
    .map((message) => `- ${message.content.trim()}`);
  if (otherMessages.length) {
    lines.push(L("WHAT THE PATIENT TOLD FASTMED", "ALICHOELEZA MGONJWA KWA FASTMED"), ...otherMessages, "");
  }

  if (intake?.questions.trim()) {
    lines.push(L("QUESTIONS FOR THE CLINICIAN", "MASWALI KWA MTAALAMU"), intake.questions.trim(), "");
  }

  lines.push(
    L(
      "Prepared by the patient with FastMed (AI-generated health information). This is not a diagnosis. Please review and confirm with clinical assessment.",
      "Imeandaliwa na mgonjwa kwa kutumia FastMed (taarifa za afya zilizotengenezwa na AI). Huu si utambuzi wa ugonjwa. Tafadhali hakiki na uthibitishe kwa uchunguzi wa kitabibu.",
    ),
  );
  return lines.join("\n");
}

export function VisitSummary(props: Props) {
  const { language } = props;
  const sw = language === "sw";
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const text = buildVisitSummary(props);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked; the text is visible to copy manually. */
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "fastmed-visit-summary.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  function print() {
    const win = window.open("", "_blank", "width=760,height=900");
    if (!win) return;
    win.document.title = "FastMed Visit Summary";
    const pre = win.document.createElement("pre");
    pre.textContent = text;
    pre.style.cssText = "white-space:pre-wrap;font:15px/1.6 Arial,sans-serif;color:#0f172a";
    win.document.body.style.padding = "32px";
    win.document.body.append(pre);
    win.focus();
    win.print();
  }

  const button =
    "inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-700 bg-white px-4 py-2 font-bold text-cyan-800 hover:bg-cyan-50";

  return (
    <section className="rounded-3xl border border-cyan-200 bg-white p-5 sm:p-7">
      <div className="flex items-start gap-3">
        <FileText className="mt-1 h-6 w-6 shrink-0 text-cyan-700" aria-hidden="true" />
        <div>
          <h2 className="text-xl font-extrabold">{sw ? "Muhtasari wa kumpelekea mtaalamu" : "Visit summary for your clinician"}</h2>
          <p className="mt-1 text-slate-600">
            {sw
              ? "Muhtasari mfupi unaoweza kumwonyesha au kumtumia daktari au muuguzi. Hakiki kabla ya kushiriki. FastMed haijautuma kwa mtu yeyote."
              : "A short summary you can show or send to a doctor or nurse. Review it before sharing. FastMed has not sent it to anyone."}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => setOpen((value) => !value)} className={button}>
          <FileText className="h-4 w-4" aria-hidden="true" />
          {open ? (sw ? "Ficha muhtasari" : "Hide summary") : sw ? "Onyesha muhtasari" : "View summary"}
        </button>
        <button type="button" onClick={copy} className={button}>
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? (sw ? "Imenakiliwa" : "Copied") : sw ? "Nakili" : "Copy"}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noreferrer"
          className={button}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
        </a>
        <button type="button" onClick={print} className={button}>
          <Printer className="h-4 w-4" aria-hidden="true" /> {sw ? "Chapisha" : "Print"}
        </button>
        <button type="button" onClick={download} className={button}>
          <Download className="h-4 w-4" aria-hidden="true" /> {sw ? "Pakua" : "Download"}
        </button>
      </div>
      {open && (
        <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 font-sans text-sm leading-6 text-slate-800">
          {text}
        </pre>
      )}
    </section>
  );
}
