"use client";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  HeartPulse,
  MessageCircle,
  Save,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import type { ChatMessage, Intake } from "@/lib/fastmed-types";
import {
  detectRedFlags,
  highestTriage,
  ruleById,
  type RedFlagRule,
  type TriageLevel,
} from "@/lib/fastmed-safety";
import { intakeAge, intakeSafety, intakeToMessage } from "@/lib/fastmed-intake";
import { AITransparencyNotice } from "@/components/fastmed/AITransparencyNotice";
import { DangerSigns } from "@/components/fastmed/DangerSigns";
import { EmergencyBanner } from "@/components/fastmed/EmergencyBanner";
import { GuidedCheckIn } from "@/components/fastmed/GuidedCheckIn";
import { PractitionerDirectory } from "@/components/fastmed/PractitionerDirectory";
import { PrivacyNotice } from "@/components/fastmed/PrivacyNotice";
import { TriageCard } from "@/components/fastmed/TriageCard";
import { VisitSummary } from "@/components/fastmed/VisitSummary";

const healthLibrary = [
  {
    title: "Tanzania Ministry of Health Guidelines",
    description: "Official Ministry publications, strategies, and health resources for Tanzania.",
    href: "https://www.moh.go.tz/",
    external: true,
  },
  {
    title: "Patient Safety",
    description: "WHO information about safer care, clear communication, and questions patients can ask.",
    href: "https://www.who.int/news-room/fact-sheets/detail/patient-safety",
    external: true,
  },
  {
    title: "Emergency Warning Signs",
    description:
      "When breathing problems, chest pain, fainting, bleeding, sudden weakness, or danger signs in children and pregnancy need urgent care.",
    href: "#danger-signs",
    external: false,
  },
];

const HEADINGS =
  /^(CLINICAL CONTEXT|STG 2026 INFORMATION|URGENT HELP|IMPORTANT|NEXT STEP|MUKTADHA WA KITABIBU|TAARIFA ZA STG 2026|HUDUMA YA HARAKA|MUHIMU|HATUA INAYOFUATA):/i;
const URGENT_HEADING = /^(URGENT HELP|HUDUMA YA HARAKA):/i;

export default function ClinicalAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [healthContext, setHealthContext] = useState(false);
  const [intake, setIntake] = useState<Intake | null>(null);
  const [intakeMessage, setIntakeMessage] = useState<string | null>(null);
  const [liveSigns, setLiveSigns] = useState<string[]>([]);
  const [serverTriage, setServerTriage] = useState<TriageLevel | null>(null);
  const [serverFlagIds, setServerFlagIds] = useState<string[]>([]);
  const [saveOnDevice, setSaveOnDevice] = useState(false);
  const [savedConversations, setSavedConversations] = useState<ChatMessage[][]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const bannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("fastmed-conversations") || "[]");
      if (Array.isArray(saved)) queueMicrotask(() => setSavedConversations(saved.slice(0, 5)));
    } catch {
      /* Ignore invalid device-only data. */
    }
  }, []);

  const userText = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join("\n");

  // Instant, on-device red-flag check (runs before the AI replies).
  const safety = useMemo(
    () =>
      detectRedFlags(userText, {
        age: intake ? intakeAge(intake) : null,
        pregnant: intake ? intakeSafety(intake).pregnant : false,
        checkedSigns: intake ? intake.dangerSigns : liveSigns,
      }),
    [userText, intake, liveSigns],
  );

  const flags: RedFlagRule[] = useMemo(() => {
    const byId = new Map(safety.flags.map((flag) => [flag.id, flag]));
    for (const id of serverFlagIds) {
      const rule = ruleById(id);
      if (rule && !byId.has(id)) byId.set(id, rule);
    }
    return [...byId.values()];
  }, [safety.flags, serverFlagIds]);

  const ruleLevel = flags.reduce<TriageLevel | null>((level, flag) => highestTriage(level, flag.level), null);
  const showEmergency = ruleLevel === "emergency" || flags.some((flag) => flag.category === "mental_health");
  const mentalHealth = flags.some((flag) => flag.category === "mental_health");
  const triage = healthContext ? highestTriage(serverTriage, ruleLevel) : null;

  // Bring the emergency banner into view the moment it appears.
  const wasEmergency = useRef(false);
  useEffect(() => {
    if (showEmergency && !wasEmergency.current) {
      bannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    wasEmergency.current = showEmergency;
  }, [showEmergency]);

  function saveConversation(conversation: ChatMessage[]) {
    if (!conversation.length) return;
    const next = [conversation, ...savedConversations].slice(0, 5);
    setSavedConversations(next);
    try {
      window.localStorage.setItem("fastmed-conversations", JSON.stringify(next));
    } catch {
      /* Storage unavailable; keep in memory only. */
    }
  }

  async function sendContent(content: string, intakeForRequest: Intake | null = intake) {
    if (!content || loading) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setDraft("");
    setLoading(true);
    setError("");
    abortRef.current = new AbortController();
    try {
      const response = await fetch("/api/clinical-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          language,
          intake: intakeForRequest ? intakeSafety(intakeForRequest) : liveSigns.length ? { age: null, pregnant: false, dangerSigns: liveSigns } : null,
        }),
        signal: abortRef.current.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "FastMed could not respond right now.");
      const completed: ChatMessage[] = [...nextMessages, { role: "assistant", content: data.reply }];
      setMessages(completed);
      if (saveOnDevice) saveConversation(completed);
      setHealthContext((current) => current || Boolean(data.isHealthRelated));
      if (data.triage) setServerTriage((current) => highestTriage(current, data.triage));
      if (Array.isArray(data.redFlags))
        setServerFlagIds((current) => [...new Set([...current, ...data.redFlags])]);
    } catch (caught) {
      if ((caught as Error).name !== "AbortError")
        setError(caught instanceof Error ? caught.message : "FastMed could not respond right now.");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;
    await sendContent(content);
  }

  async function submitIntake(answers: Intake) {
    const message = intakeToMessage(answers, language);
    setIntake(answers);
    setIntakeMessage(message);
    setLiveSigns(answers.dangerSigns);
    await sendContent(message, answers);
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setDraft("");
    setError("");
    setHealthContext(false);
    setIntake(null);
    setIntakeMessage(null);
    setLiveSigns([]);
    setServerTriage(null);
    setServerFlagIds([]);
  }

  const sw = language === "sw";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ecfeff_0,#f8fafc_34rem)] px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Link
          href="/"
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-2 font-bold text-cyan-800 hover:bg-cyan-50"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Back to JustCosta
        </Link>

        <header className="rounded-3xl border border-cyan-100 bg-white/90 p-5 shadow-sm sm:p-8">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
              <HeartPulse className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[.16em] text-cyan-700">
                {sw ? "Msaada wa afya wa FastMed" : "FastMed health support"}
              </p>
              <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
                {sw ? "Unajisikiaje leo?" : "How are you feeling today?"}
              </h1>
              <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
                {sw
                  ? "Ieleze FastMed unachopitia. Tunaweza kukusaidia kuelewa dalili zako, kujiandaa kwenda kliniki, kutambua dalili za hatari, na kukuunganisha na mtaalamu wa afya."
                  : "Tell FastMed what you are experiencing. We can help you understand your symptoms, prepare for a healthcare visit, identify warning signs, and connect you with a healthcare practitioner."}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                {sw
                  ? "FastMed inatoa taarifa za afya zilizotengenezwa na AI na haichukui nafasi ya uchunguzi wa mtaalamu wa afya."
                  : "FastMed provides AI-generated health information and does not replace assessment by a qualified healthcare professional."}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-700">{sw ? "Jibu kwa" : "Reply in"}</span>
            {(["en", "sw"] as const).map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={language === code}
                onClick={() => setLanguage(code)}
                className={
                  language === code
                    ? "rounded-full bg-cyan-700 px-4 py-2 text-sm font-bold text-white"
                    : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold"
                }
              >
                {code === "en" ? "English" : "Kiswahili"}
              </button>
            ))}
          </div>
        </header>

        <div ref={bannerRef} className="scroll-mt-4 empty:hidden">
          {showEmergency && (
            <EmergencyBanner
              flags={flags.filter((flag) => flag.level === "emergency")}
              mentalHealth={mentalHealth}
              language={language}
            />
          )}
        </div>

        {!intake ? (
          <GuidedCheckIn
            language={language}
            loading={loading}
            onSubmit={submitIntake}
            onDangerSignsChange={setLiveSigns}
          />
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-5 py-4 font-bold text-cyan-950">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-700" aria-hidden="true" />
            {sw
              ? "Uchunguzi wa awali umekamilika. Endelea kuzungumza na FastMed hapa chini."
              : "Check-in complete. Keep chatting with FastMed below."}
          </div>
        )}

        {triage && <TriageCard level={triage} flags={flags} language={language} />}

        <section
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          aria-label="FastMed conversation"
        >
          <div className={`${messages.length ? "min-h-[16rem]" : ""} space-y-4 p-4 sm:p-6`} aria-live="polite">
            {!messages.length && (
              <div className="mx-auto flex max-w-xl items-center gap-3 py-3 text-left">
                <Sparkles className="h-6 w-6 shrink-0 text-cyan-600" aria-hidden="true" />
                <div>
                  <h2 className="font-extrabold">{sw ? "Au andika moja kwa moja" : "Or just type"}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {sw
                      ? "Eleza unavyojisikia, ilianza lini, au uliza swali lolote."
                      : "Describe how you feel, when it started, or ask any general question."}
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
                        const heading = HEADINGS.test(line.trim());
                        const urgent = URGENT_HEADING.test(line.trim());
                        return (
                          <p
                            key={lineIndex}
                            className={
                              heading
                                ? `mt-3 font-extrabold first:mt-0 ${urgent ? "text-red-800" : "text-cyan-900"}`
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
            {loading && (
              <div className="mr-auto rounded-2xl bg-slate-100 p-4 text-slate-600">
                {sw ? "FastMed inafikiri…" : "FastMed is thinking…"}
              </div>
            )}
            {healthContext && messages.at(-1)?.role === "assistant" && (
              <div className="max-w-3xl">
                <AITransparencyNotice />
              </div>
            )}
          </div>
          <form onSubmit={send} className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5">
            <label htmlFor="fastmed-message" className="sr-only">
              Message FastMed
            </label>
            {messages.length > 0 && (
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-cyan-900">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />{" "}
                {sw
                  ? "Endelea kuzungumza—jibu kwa kawaida au ongeza maelezo."
                  : "Continue chatting—reply naturally or add more information."}
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
                placeholder={sw ? "Andika ujumbe wako…" : "Message FastMed…"}
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
            {error && <p className="mt-3 font-semibold text-red-700">{error}</p>}
            <label className="mt-3 flex items-start gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={saveOnDevice}
                onChange={(event) => setSaveOnDevice(event.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span>
                {sw
                  ? "Hifadhi mazungumzo haya kwenye kifaa hiki tu. Hayashirikiwi na mtaalamu."
                  : "Save this conversation on this device only. It is not shared with a practitioner."}
              </span>
            </label>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                {sw ? "FastMed inaweza kukosea. Hakiki taarifa muhimu." : "FastMed can make mistakes. Check important information."}
              </p>
              {messages.length > 0 && (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => saveConversation(messages)}
                    className="inline-flex items-center gap-1 text-sm font-bold text-cyan-800"
                  >
                    <Save className="h-4 w-4" /> {sw ? "Hifadhi sasa" : "Save now"}
                  </button>
                  <button type="button" onClick={reset} className="text-sm font-bold text-cyan-800">
                    {sw ? "Anza mazungumzo mapya" : "Start new conversation"}
                  </button>
                </div>
              )}
            </div>
          </form>
        </section>

        {(healthContext || intake) && messages.length > 0 && (
          <VisitSummary
            language={language}
            intake={intake}
            intakeMessage={intakeMessage}
            messages={messages}
            triage={triage}
            flags={flags}
          />
        )}

        {savedConversations.length > 0 && (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold">{sw ? "Yaliyohifadhiwa kwenye kifaa hiki" : "Saved on this device"}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {sw ? "Kivinjari hiki pekee kinaweza kuona mazungumzo haya." : "Only this browser can see these conversations."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  try {
                    window.localStorage.removeItem("fastmed-conversations");
                  } catch {
                    /* ignore */
                  }
                  setSavedConversations([]);
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-700"
              >
                <Trash2 className="h-4 w-4" /> {sw ? "Futa yaliyohifadhiwa" : "Clear saved data"}
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {savedConversations.map((conversation, index) => (
                <details key={index} className="rounded-xl bg-slate-50 p-4">
                  <summary className="cursor-pointer font-bold">
                    {sw ? "Mazungumzo" : "Saved conversation"} {index + 1}
                  </summary>
                  <div className="mt-3 space-y-2">
                    {conversation.map((message, messageIndex) => (
                      <p key={messageIndex} className="whitespace-pre-wrap text-sm text-slate-700">
                        <strong>{message.role === "user" ? (sw ? "Wewe" : "You") : "FastMed"}:</strong>{" "}
                        {message.content}
                      </p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        <PrivacyNotice />
        <PractitionerDirectory />
        <DangerSigns language={language} />

        <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-1 h-6 w-6 text-cyan-700" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-cyan-700">Trusted resources</p>
              <h2 className="mt-1 text-2xl font-extrabold">Health Library / Maktaba ya Afya</h2>
              <p className="mt-2 text-slate-600">
                Reliable information to help you prepare for care. These resources do not replace assessment by a
                qualified practitioner.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {healthLibrary.map((resource) => (
              <a
                key={resource.href}
                href={resource.href}
                {...(resource.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="rounded-2xl border border-slate-200 p-5 transition hover:border-cyan-500 hover:bg-cyan-50"
              >
                <h3 className="font-extrabold text-cyan-900">{resource.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{resource.description}</p>
                <p className="mt-4 text-sm font-bold text-cyan-700">
                  {resource.external ? "Open resource →" : "View warning signs ↓"}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
