"use client";
import { FormEvent, useRef, useState } from "react";
import { ArrowLeft, HeartPulse, Send, Sparkles, Stethoscope } from "lucide-react";
import Link from "next/link";
import type { ChatMessage } from "@/lib/fastmed-types";
import { AITransparencyNotice } from "@/components/fastmed/AITransparencyNotice";
import { PractitionerDirectory } from "@/components/fastmed/PractitionerDirectory";
import { PrivacyNotice } from "@/components/fastmed/PrivacyNotice";

export default function ClinicalAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [healthContext, setHealthContext] = useState(false);
  const [showVisitSummary, setShowVisitSummary] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function send(event: FormEvent) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || loading) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages); setDraft(""); setLoading(true); setError("");
    abortRef.current = new AbortController();
    try {
      const response = await fetch("/api/clinical-assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: nextMessages, language }), signal: abortRef.current.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "FastMed could not respond right now.");
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
      setHealthContext(Boolean(data.isHealthRelated));
    } catch (caught) {
      if ((caught as Error).name !== "AbortError") setError(caught instanceof Error ? caught.message : "FastMed could not respond right now.");
    } finally { setLoading(false); abortRef.current = null; }
  }

  function reset() { abortRef.current?.abort(); setMessages([]); setDraft(""); setError(""); setHealthContext(false); setShowVisitSummary(false); }
  const userHealthMessages = messages.filter((message) => message.role === "user").map((message) => message.content);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ecfeff_0,#f8fafc_34rem)] px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 font-bold text-cyan-800 hover:bg-cyan-50"><ArrowLeft className="h-5 w-5" aria-hidden="true" /> Back to JustCosta</Link>
        <header className="mt-4 rounded-3xl border border-cyan-100 bg-white/90 p-5 shadow-sm sm:p-8">
          <div className="flex gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><HeartPulse className="h-6 w-6" aria-hidden="true" /></div><div><p className="text-sm font-extrabold uppercase tracking-[.16em] text-cyan-700">FastMed</p><h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">How can we help today?</h1><p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">Talk naturally about health, work, technology, everyday decisions, or anything else. When health comes up, FastMed responds more carefully and can help you prepare for a visit or find a verified practitioner.</p></div></div>
          <div className="mt-5 flex flex-wrap items-center gap-2"><span className="text-sm font-bold text-slate-700">Reply in</span><button onClick={() => setLanguage("en")} className={language === "en" ? "rounded-full bg-cyan-700 px-4 py-2 text-sm font-bold text-white" : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold"}>English</button><button onClick={() => setLanguage("sw")} className={language === "sw" ? "rounded-full bg-cyan-700 px-4 py-2 text-sm font-bold text-white" : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold"}>Kiswahili</button></div>
        </header>
        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" aria-label="FastMed conversation">
          <div className="min-h-[24rem] space-y-4 p-4 sm:p-6" aria-live="polite">
            {!messages.length && <div className="mx-auto flex max-w-xl flex-col items-center py-14 text-center"><Sparkles className="h-9 w-9 text-cyan-600" aria-hidden="true" /><h2 className="mt-4 text-xl font-extrabold">Start a conversation</h2><p className="mt-2 text-slate-600">No category needed. Ask a question or tell FastMed what is on your mind.</p></div>}
            {messages.map((message, index) => <div key={index} className={message.role === "user" ? "ml-auto max-w-3xl rounded-2xl rounded-br-sm bg-cyan-700 p-4 text-white" : "mr-auto max-w-3xl whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-slate-100 p-4 leading-7 text-slate-800"}>{message.content}</div>)}
            {loading && <div className="mr-auto rounded-2xl bg-slate-100 p-4 text-slate-600">FastMed is thinking…</div>}
            {healthContext && messages.at(-1)?.role === "assistant" && <div className="max-w-3xl"><AITransparencyNotice /></div>}
          </div>
          <form onSubmit={send} className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5"><label htmlFor="fastmed-message" className="sr-only">Message FastMed</label><div className="flex items-end gap-3"><textarea id="fastmed-message" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={2} maxLength={3000} placeholder={language === "sw" ? "Andika ujumbe wako…" : "Message FastMed…"} className="min-h-14 flex-1 resize-none rounded-2xl border border-slate-300 bg-white p-4 text-base focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-100" /><button disabled={!draft.trim() || loading} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-700 text-white disabled:opacity-50" aria-label="Send message"><Send className="h-5 w-5" /></button></div>{error && <p className="mt-3 font-semibold text-red-700">{error}</p>}<div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-500">FastMed can make mistakes. Check important information.</p>{messages.length > 0 && <button type="button" onClick={reset} className="text-sm font-bold text-cyan-800">Start new conversation</button>}</div></form>
        </section>
        {healthContext && <section className="mt-6 rounded-3xl border border-cyan-200 bg-white p-5 sm:p-7"><div className="flex items-start gap-3"><Stethoscope className="mt-1 h-6 w-6 text-cyan-700" aria-hidden="true" /><div><h2 className="text-xl font-extrabold">Prepare for professional care</h2><p className="mt-1 text-slate-600">Create a draft from the health details you shared. Review and edit it before you choose to share it.</p></div></div><button type="button" onClick={() => setShowVisitSummary((value) => !value)} className="mt-4 min-h-11 rounded-xl border border-cyan-700 px-4 py-2 font-bold text-cyan-800">{showVisitSummary ? "Hide draft summary" : "Prepare visit summary"}</button>{showVisitSummary && <div className="mt-4 rounded-2xl bg-slate-50 p-5"><p className="text-sm font-extrabold uppercase tracking-wide text-cyan-800">AI-prepared visit summary</p><p className="mt-3 font-semibold text-slate-900">Information shared by the user:</p><ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">{userHealthMessages.map((item, index) => <li key={index}>{item}</li>)}</ul><p className="mt-4 text-sm text-slate-600">This draft only includes your words. FastMed has not sent it to anyone.</p></div>}</section>}
        <div className="mt-6"><PrivacyNotice /></div>
        <div className="mt-8"><PractitionerDirectory /></div>
      </div>
    </main>
  );
}
