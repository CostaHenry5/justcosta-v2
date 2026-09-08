"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Download,
  HeartPulse,
  MessageCircle,
  Printer,
  Save,
  Send,
  Sparkles,
  Stethoscope,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import type { ChatMessage } from "@/lib/fastmed-types";
import { AITransparencyNotice } from "@/components/fastmed/AITransparencyNotice";
import { PractitionerDirectory } from "@/components/fastmed/PractitionerDirectory";
import { PrivacyNotice } from "@/components/fastmed/PrivacyNotice";

const healthLibrary = [
  {
    title: "Tanzania Ministry of Health Guidelines",
    description:
      "Official Ministry publications, strategies, and health resources for Tanzania.",
    href: "https://www.moh.go.tz/",
  },
  {
    title: "Patient Safety",
    description:
      "WHO information about safer care, clear communication, and questions patients can ask.",
    href: "https://www.who.int/news-room/fact-sheets/detail/patient-safety",
  },
  {
    title: "Emergency Warning Signs",
    description:
      "Learn when breathing problems, chest pain, fainting, bleeding, or sudden weakness need urgent care.",
    href: "https://www.who.int/news-room/questions-and-answers/item/coronavirus-disease-covid-19-home-care-for-families-and-caregivers",
  },
];

const redFlagRules = [
  {
    label: "chest pain or pressure",
    pattern: /\b(chest pain|chest pressure|tightness in (my |the )?chest)\b/i,
  },
  {
    label: "difficulty breathing",
    pattern:
      /\b(can'?t breathe|cannot breathe|difficulty breathing|shortness of breath|struggling to breathe)\b/i,
  },
  {
    label: "loss of consciousness or seizure",
    pattern:
      /\b(unconscious|not waking|passed out|fainted|seizure|convulsion)\b/i,
  },
  {
    label: "stroke warning signs",
    pattern:
      /\b(face droop|one[- ]sided weakness|sudden weakness|slurred speech|cannot speak)\b/i,
  },
  {
    label: "severe bleeding",
    pattern:
      /\b(severe bleeding|bleeding heavily|won'?t stop bleeding|vomiting blood|coughing blood)\b/i,
  },
  {
    label: "a severe allergic reaction",
    pattern:
      /\b(swollen tongue|throat swelling|severe allergic reaction|anaphylaxis)\b/i,
  },
  {
    label: "immediate self-harm risk",
    pattern: /\b(kill myself|suicide|end my life|hurt myself)\b/i,
  },
];

export default function ClinicalAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [healthContext, setHealthContext] = useState(false);
  const [showVisitSummary, setShowVisitSummary] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientLocation, setPatientLocation] = useState("");
  const [patientSymptoms, setPatientSymptoms] = useState("");
  const [symptomDuration, setSymptomDuration] = useState("");
  const [patientConcerns, setPatientConcerns] = useState("");
  const [particularsSubmitted, setParticularsSubmitted] = useState(false);
  const [saveOnDevice, setSaveOnDevice] = useState(false);
  const [savedConversations, setSavedConversations] = useState<ChatMessage[][]>(
    [],
  );
  const abortRef = useRef<AbortController | null>(null);
  const guidanceRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        window.localStorage.getItem("fastmed-conversations") || "[]",
      );
      if (Array.isArray(saved))
        queueMicrotask(() => setSavedConversations(saved.slice(0, 5)));
    } catch {
      /* Ignore invalid device-only data. */
    }
  }, []);

  function saveConversation(conversation: ChatMessage[]) {
    if (!conversation.length) return;
    const next = [conversation, ...savedConversations].slice(0, 5);
    setSavedConversations(next);
    window.localStorage.setItem("fastmed-conversations", JSON.stringify(next));
  }

  async function requestReply(nextMessages: ChatMessage[]) {
    if (!nextMessages.length || loading) return;
    setLoading(true);
    setError("");
    abortRef.current = new AbortController();
    try {
      const response = await fetch("/api/clinical-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, language }),
        signal: abortRef.current.signal,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "FastMed could not respond right now.");
      const completed: ChatMessage[] = [
        ...nextMessages,
        { role: "assistant", content: data.reply },
      ];
      setMessages(completed);
      if (saveOnDevice) saveConversation(completed);
      setHealthContext(Boolean(data.isHealthRelated));
    } catch (caught) {
      if ((caught as Error).name !== "AbortError")
        setError(
          caught instanceof Error
            ? caught.message
            : "FastMed could not respond right now.",
        );
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  async function sendContent(content: string) {
    if (!content || loading) return;
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
    ];
    setMessages(nextMessages);
    setDraft("");
    await requestReply(nextMessages);
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;
    if (!messages.length && !particularsSubmitted) {
      setMessages([{ role: "user", content }]);
      setDraft("");
      return;
    }
    await sendContent(content);
  }

  async function submitParticulars(event: FormEvent) {
    event.preventDefault();
    const clinicalMessage = [
      `Patient age: ${patientAge}`,
      patientLocation ? `Location: ${patientLocation}` : "",
      `Symptoms or health concern: ${patientSymptoms}`,
      `When it began or changed: ${symptomDuration}`,
      patientConcerns ? `Questions or worries: ${patientConcerns}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    setParticularsSubmitted(true);
    await sendContent(clinicalMessage);
    window.setTimeout(
      () =>
        guidanceRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      100,
    );
  }

  function visitSummaryText() {
    const latestGuidance = [...messages]
      .reverse()
      .find((message) => message.role === "assistant")?.content;
    return [
      "FASTMED VISIT SUMMARY",
      patientName ? `Patient name: ${patientName}` : "",
      `Age: ${patientAge}`,
      patientLocation ? `Location: ${patientLocation}` : "",
      `Symptoms or health concern: ${patientSymptoms}`,
      `When it began or changed: ${symptomDuration}`,
      patientConcerns ? `Questions or worries: ${patientConcerns}` : "",
      latestGuidance ? `FASTMED GUIDANCE\n${latestGuidance}` : "",
      "Prepared with FastMed. Review this summary before sharing it with a healthcare professional.",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  function downloadVisitSummary() {
    const url = URL.createObjectURL(
      new Blob([visitSummaryText()], { type: "text/plain" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "fastmed-visit-summary.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  function printVisitSummary() {
    const printWindow = window.open("", "_blank", "width=760,height=900");
    if (!printWindow) return;
    printWindow.document.title = "FastMed Visit Summary";
    const heading = printWindow.document.createElement("h1");
    heading.textContent = "FastMed Visit Summary";
    const summary = printWindow.document.createElement("pre");
    summary.textContent = visitSummaryText();
    summary.style.cssText =
      "white-space:pre-wrap;font:16px/1.6 Arial,sans-serif;color:#0f172a";
    printWindow.document.body.style.padding = "32px";
    printWindow.document.body.append(heading, summary);
    printWindow.focus();
    printWindow.print();
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setDraft("");
    setError("");
    setHealthContext(false);
    setShowVisitSummary(false);
    setParticularsSubmitted(false);
  }
  const userHealthMessages = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content);
  const safetyText = [
    draft,
    patientSymptoms,
    patientConcerns,
    ...messages
      .filter((message) => message.role === "user")
      .map((message) => message.content),
  ].join(" ");
  const redFlags = redFlagRules
    .filter((rule) => rule.pattern.test(safetyText))
    .map((rule) => rule.label);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ecfeff_0,#f8fafc_34rem)] px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto flex max-w-6xl flex-col">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 font-bold text-cyan-800 hover:bg-cyan-50"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Back to JustCosta
        </Link>
        <header className="mt-4 rounded-3xl border border-cyan-100 bg-white/90 p-5 shadow-sm sm:p-8">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
              <HeartPulse className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[.16em] text-cyan-700">
                FastMed health support
              </p>
              <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
                How are you feeling today?
              </h1>
              <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
                Tell FastMed what you are experiencing. We can help you
                understand your symptoms, prepare for a healthcare visit,
                identify warning signs, and connect you with a healthcare
                practitioner.
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                FastMed provides AI-generated health information and does not
                replace assessment by a qualified healthcare professional.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-700">Reply in</span>
            <button
              onClick={() => setLanguage("en")}
              className={
                language === "en"
                  ? "rounded-full bg-cyan-700 px-4 py-2 text-sm font-bold text-white"
                  : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold"
              }
            >
              English
            </button>
            <button
              onClick={() => setLanguage("sw")}
              className={
                language === "sw"
                  ? "rounded-full bg-cyan-700 px-4 py-2 text-sm font-bold text-white"
                  : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold"
              }
            >
              Kiswahili
            </button>
          </div>
          <p
            className="mt-2 text-sm font-semibold text-cyan-900"
            aria-live="polite"
          >
            {language === "sw"
              ? "Umechagua Kiswahili. Majibu ya FastMed AI yatakuwa kwa Kiswahili, si lebo za ukurasa pekee."
              : "You selected English. FastMed AI replies will be in English, not only the page labels."}
          </p>
        </header>
        {redFlags.length > 0 && (
          <aside
            role="alert"
            className="order-1 mt-6 rounded-2xl border-2 border-red-600 bg-red-50 p-5 text-red-950 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="mt-0.5 h-6 w-6 shrink-0"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-lg font-extrabold">Urgent safety alert</h2>
                <p className="mt-1 font-semibold">
                  Our independent keyword safety check noticed words that may
                  describe {redFlags.join(", ")}.
                </p>
                <p className="mt-2">
                  If this is happening now, do not wait for FastMed or a
                  practitioner reply. Go to the nearest emergency department or
                  contact local emergency services now. This automatic check is
                  not a diagnosis and may flag wording that does not apply to
                  you.
                </p>
              </div>
            </div>
          </aside>
        )}
        {particularsSubmitted && patientAge && patientSymptoms && (
          <section className="order-2 mt-6 rounded-3xl border-2 border-cyan-200 bg-cyan-50 p-5 sm:p-7">
            <p className="text-sm font-extrabold uppercase tracking-wide text-cyan-800">
              Patient summary
            </p>
            <div className="mt-4 grid gap-3 text-slate-800 sm:grid-cols-2">
              {patientName && (
                <p>
                  <strong>Name:</strong> {patientName}
                </p>
              )}
              <p>
                <strong>Age:</strong> {patientAge}
              </p>
              {patientLocation && (
                <p>
                  <strong>Location:</strong> {patientLocation}
                </p>
              )}
              <p className="sm:col-span-2">
                <strong>Symptoms or concern:</strong> {patientSymptoms}
              </p>
              <p className="sm:col-span-2">
                <strong>When it began or changed:</strong> {symptomDuration}
              </p>
              {patientConcerns && (
                <p className="sm:col-span-2">
                  <strong>Questions or worries:</strong> {patientConcerns}
                </p>
              )}
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Your name remains on this page and was not sent to the AI service.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={downloadVisitSummary}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-700 bg-white px-4 py-2 font-bold text-cyan-800"
              >
                <Download className="h-4 w-4" /> Download summary
              </button>
              <button
                type="button"
                onClick={printVisitSummary}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-700 bg-white px-4 py-2 font-bold text-cyan-800"
              >
                <Printer className="h-4 w-4" /> Print summary
              </button>
            </div>
          </section>
        )}
        <section
          ref={guidanceRef}
          className="order-1 mt-6 scroll-mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          aria-label="FastMed conversation"
        >
          <div
            className={`${messages.length ? "min-h-[20rem]" : ""} space-y-4 p-4 sm:p-6`}
            aria-live="polite"
          >
            {!messages.length && (
              <div className="mx-auto flex max-w-xl items-center gap-3 py-3 text-left">
                <Sparkles
                  className="h-6 w-6 shrink-0 text-cyan-600"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-wide text-cyan-700">
                    Start here
                  </p>
                  <h2 className="font-extrabold">Tell us what is going on</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Describe how you feel, when it started, or ask a question.
                    FastMed will then request any particulars needed for safer
                    guidance in this same conversation.
                  </p>
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-3xl whitespace-pre-wrap rounded-2xl rounded-br-sm bg-cyan-700 p-4 text-white"
                    : "mr-auto max-w-3xl rounded-2xl rounded-bl-sm bg-slate-100 p-4 leading-7 text-slate-800"
                }
              >
                {message.role === "assistant"
                  ? message.content
                      .split("\n")
                      .filter(Boolean)
                      .map((line, lineIndex) => {
                        const heading =
                          /^(CLINICAL CONTEXT|STG 2026 INFORMATION|URGENT HELP|IMPORTANT|NEXT STEP|MUKTADHA WA KITABIBU|TAARIFA ZA STG 2026|HUDUMA YA HARAKA|MUHIMU|HATUA INAYOFUATA):/i.test(
                            line.trim(),
                          );
                        const urgent = /^(URGENT HELP|HUDUMA YA HARAKA):/i.test(
                          line.trim(),
                        );
                        return (
                          <p
                            key={lineIndex}
                            className={
                              heading
                                ? `mt-3 first:mt-0 font-extrabold ${urgent ? "text-red-800" : "text-cyan-900"}`
                                : "mt-2 first:mt-0"
                            }
                          >
                            {line}
                          </p>
                        );
                      })
                  : message.content}
              </div>
            ))}
            {messages.length > 0 && !particularsSubmitted && !loading && (
              <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-5 sm:p-6">
                <p className="text-sm font-extrabold uppercase tracking-wide text-cyan-800">
                  A few details for safer guidance
                </p>
                <h2 className="mt-1 text-xl font-extrabold">
                  Tell FastMed about the patient
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Your first message started this conversation. Add these
                  particulars and FastMed will use both together. Your name
                  stays on this device and is not sent to the AI service.
                </p>
                <form
                  onSubmit={submitParticulars}
                  className="mt-5 grid gap-4 sm:grid-cols-2"
                >
                  <label className="font-bold">
                    Patient name{" "}
                    <span className="font-normal text-slate-500">
                      (optional)
                    </span>
                    <input
                      value={patientName}
                      onChange={(event) => setPatientName(event.target.value)}
                      className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4"
                    />
                  </label>
                  <label className="font-bold">
                    Age
                    <input
                      required
                      type="number"
                      min="0"
                      max="130"
                      value={patientAge}
                      onChange={(event) => setPatientAge(event.target.value)}
                      className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4"
                    />
                  </label>
                  <label className="font-bold sm:col-span-2">
                    Location{" "}
                    <span className="font-normal text-slate-500">
                      (optional)
                    </span>
                    <input
                      value={patientLocation}
                      onChange={(event) =>
                        setPatientLocation(event.target.value)
                      }
                      placeholder="Region, district, or ward"
                      className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4"
                    />
                  </label>
                  <label className="font-bold sm:col-span-2">
                    Symptoms or health concern
                    <textarea
                      required
                      rows={3}
                      value={patientSymptoms}
                      onChange={(event) =>
                        setPatientSymptoms(event.target.value)
                      }
                      placeholder="Add details not included in your first message"
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-4"
                    />
                  </label>
                  <label className="font-bold sm:col-span-2">
                    When did it begin, and has it changed?
                    <textarea
                      required
                      rows={2}
                      value={symptomDuration}
                      onChange={(event) =>
                        setSymptomDuration(event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-4"
                    />
                  </label>
                  <label className="font-bold sm:col-span-2">
                    Questions or worries{" "}
                    <span className="font-normal text-slate-500">
                      (optional)
                    </span>
                    <textarea
                      rows={2}
                      value={patientConcerns}
                      onChange={(event) =>
                        setPatientConcerns(event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-4"
                    />
                  </label>
                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    <button
                      disabled={loading}
                      className="min-h-12 rounded-xl bg-cyan-700 px-5 py-3 font-extrabold text-white disabled:opacity-50"
                    >
                      Get guidance using these details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setParticularsSubmitted(true);
                        void requestReply(messages);
                      }}
                      className="min-h-12 rounded-xl border border-cyan-700 bg-white px-5 py-3 font-bold text-cyan-800"
                    >
                      Skip optional particulars
                    </button>
                  </div>
                </form>
              </div>
            )}
            {loading && (
              <div className="mr-auto rounded-2xl bg-slate-100 p-4 text-slate-600">
                FastMed is thinking…
              </div>
            )}
            {healthContext && messages.at(-1)?.role === "assistant" && (
              <div className="max-w-3xl space-y-4">
                <AITransparencyNotice />
                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                  <p className="font-extrabold text-cyan-950">
                    What would you like to do next?
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        document
                          .getElementById("practitioners")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="min-h-11 rounded-xl bg-cyan-700 px-4 py-2 font-bold text-white"
                    >
                      Find a practitioner
                    </button>
                    <button
                      type="button"
                      onClick={downloadVisitSummary}
                      className="min-h-11 rounded-xl border border-cyan-700 bg-white px-4 py-2 font-bold text-cyan-800"
                    >
                      Save guidance to share
                    </button>
                    <button
                      type="button"
                      onClick={printVisitSummary}
                      className="min-h-11 rounded-xl border border-cyan-700 bg-white px-4 py-2 font-bold text-cyan-800"
                    >
                      Print for a doctor
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <form
            onSubmit={send}
            className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5"
          >
            <label htmlFor="fastmed-message" className="sr-only">
              Message FastMed
            </label>
            {messages.length > 0 && (
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-cyan-900">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />{" "}
                Continue chatting—reply naturally or add more information.
              </div>
            )}
            <div className="flex items-end gap-3">
              <textarea
                id="fastmed-message"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={2}
                maxLength={3000}
                placeholder={
                  language === "sw" ? "Andika ujumbe wako…" : "Message FastMed…"
                }
                className="min-h-14 flex-1 resize-none rounded-2xl border border-slate-300 bg-white p-4 text-base focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              />
              <button
                disabled={!draft.trim() || loading}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-700 text-white disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-900">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <p>
                FastMed is not an emergency service. For severe breathing
                difficulty, chest pain, unconsciousness, stroke signs, severe
                bleeding, or immediate danger, seek emergency care now and do
                not wait for a reply.
              </p>
            </div>
            {error && (
              <p className="mt-3 font-semibold text-red-700">{error}</p>
            )}
            <label className="mt-3 flex items-start gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={saveOnDevice}
                onChange={(event) => setSaveOnDevice(event.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span>
                Save this conversation on this device only. It is not shared
                with a practitioner.
              </span>
            </label>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                FastMed can make mistakes. Check important information.
              </p>
              <div className="flex gap-4">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => saveConversation(messages)}
                    className="inline-flex items-center gap-1 text-sm font-bold text-cyan-800"
                  >
                    <Save className="h-4 w-4" /> Save now
                  </button>
                )}
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    className="text-sm font-bold text-cyan-800"
                  >
                    Start new conversation
                  </button>
                )}
              </div>
            </div>
          </form>
        </section>
        {savedConversations.length > 0 && (
          <section className="order-5 mt-6 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold">Saved on this device</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Only this browser can see these conversations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.localStorage.removeItem("fastmed-conversations");
                  setSavedConversations([]);
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-700"
              >
                <Trash2 className="h-4 w-4" /> Clear saved data
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {savedConversations.map((conversation, index) => (
                <details key={index} className="rounded-xl bg-slate-50 p-4">
                  <summary className="cursor-pointer font-bold">
                    Saved conversation {index + 1}
                  </summary>
                  <div className="mt-3 space-y-2">
                    {conversation.map((message, messageIndex) => (
                      <p
                        key={messageIndex}
                        className="whitespace-pre-wrap text-sm text-slate-700"
                      >
                        <strong>
                          {message.role === "user" ? "You" : "FastMed"}:
                        </strong>{" "}
                        {message.content}
                      </p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
        {healthContext && (
          <section className="order-5 mt-6 rounded-3xl border border-cyan-200 bg-white p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <Stethoscope
                className="mt-1 h-6 w-6 text-cyan-700"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-xl font-extrabold">
                  Prepare for professional care
                </h2>
                <p className="mt-1 text-slate-600">
                  Create a draft from the health details you shared. Review and
                  edit it before you choose to share it.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowVisitSummary((value) => !value)}
              className="mt-4 min-h-11 rounded-xl border border-cyan-700 px-4 py-2 font-bold text-cyan-800"
            >
              {showVisitSummary
                ? "Hide draft summary"
                : "Prepare visit summary"}
            </button>
            {showVisitSummary && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-extrabold uppercase tracking-wide text-cyan-800">
                  AI-prepared visit summary
                </p>
                <p className="mt-3 font-semibold text-slate-900">
                  Information shared by the user:
                </p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
                  {userHealthMessages.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-slate-600">
                  This draft only includes your words. FastMed has not sent it
                  to anyone.
                </p>
              </div>
            )}
          </section>
        )}
        <div className="order-5 mt-6">
          <PrivacyNotice />
        </div>
        <div className="order-5 mt-8">
          <PractitionerDirectory />
        </div>
        <section className="order-5 mt-8 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <BookOpen
              className="mt-1 h-6 w-6 text-cyan-700"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-cyan-700">
                Trusted resources
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">
                Health Library / Maktaba ya Afya
              </h2>
              <p className="mt-2 text-slate-600">
                Reliable information to help you prepare for care. These
                resources do not replace assessment by a qualified practitioner.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {healthLibrary.map((resource) => (
              <a
                key={resource.href}
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-slate-200 p-5 transition hover:border-cyan-500 hover:bg-cyan-50"
              >
                <h3 className="font-extrabold text-cyan-900">
                  {resource.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {resource.description}
                </p>
                <p className="mt-4 text-sm font-bold text-cyan-700">
                  Open resource →
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
