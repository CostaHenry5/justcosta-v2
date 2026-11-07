"use client";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import type { Language } from "@/lib/fastmed-safety";

const COPY: Record<Language, { title: string; intro: string; points: string[]; agree: string; button: string }> = {
  en: {
    title: "Before you start",
    intro: "FastMED gives AI-generated health information. Please read how it works and how your information is handled.",
    points: [
      "FastMED is not a doctor and does not diagnose or prescribe. In an emergency, go to the nearest hospital or call 112 now.",
      "To answer you, your messages are processed by our AI provider on servers outside Tanzania. Before they are sent, FastMED removes phone numbers, email addresses and ID or account numbers. Please do not type your full name.",
      "FastMED does not keep your conversations on its servers. You can choose to save a conversation on this device only.",
      "FastMED keeps anonymous counts (for example, how many conversations are about emergencies) to improve safety. These never include your messages or anything that identifies you.",
      "If you are under 18, please use FastMED with a parent or guardian.",
    ],
    agree: "I have read this and I agree to FastMED processing my messages as described.",
    button: "Continue",
  },
  sw: {
    title: "Kabla hujaanza",
    intro: "FastMED inatoa taarifa za afya zinazotengenezwa na AI. Tafadhali soma jinsi inavyofanya kazi na jinsi taarifa zako zinavyoshughulikiwa.",
    points: [
      "FastMED si daktari na haitambui ugonjwa wala kuandika dawa. Katika dharura, nenda hospitali iliyo karibu au piga 112 sasa.",
      "Ili kukujibu, ujumbe wako unachakatwa na mtoa huduma wetu wa AI kwenye seva zilizo nje ya Tanzania. Kabla ya kutumwa, FastMED huondoa namba za simu, barua pepe na namba za vitambulisho au akaunti. Tafadhali usiandike jina lako kamili.",
      "FastMED haihifadhi mazungumzo yako kwenye seva zake. Unaweza kuchagua kuhifadhi mazungumzo kwenye kifaa hiki pekee.",
      "FastMED huhifadhi idadi zisizomtambulisha mtu (kwa mfano, mazungumzo mangapi yanahusu dharura) ili kuboresha usalama. Hazijumuishi kamwe ujumbe wako au chochote kinachokutambulisha.",
      "Kama una umri chini ya miaka 18, tafadhali tumia FastMED pamoja na mzazi au mlezi.",
    ],
    agree: "Nimesoma haya na nakubali FastMED ichakate ujumbe wangu kama ilivyoelezwa.",
    button: "Endelea",
  },
};

export function ConsentCard({ language, onAccept }: { language: Language; onAccept: () => void }) {
  const [agreed, setAgreed] = useState(false);
  const copy = COPY[language];
  return (
    <section className="rounded-3xl border border-cyan-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="fastmed-consent-title">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-cyan-700" aria-hidden="true" />
        <div>
          <h2 id="fastmed-consent-title" className="text-2xl font-extrabold">
            {copy.title}
          </h2>
          <p className="mt-2 text-slate-600">{copy.intro}</p>
        </div>
      </div>
      <ul className="mt-5 space-y-3">
        {copy.points.map((point) => (
          <li key={point} className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-800">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-600" aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
      <label className="mt-5 flex items-start gap-3 font-semibold text-slate-900">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-1 h-5 w-5"
        />
        <span>{copy.agree}</span>
      </label>
      <button
        type="button"
        disabled={!agreed}
        onClick={onAccept}
        className="mt-5 min-h-12 w-full rounded-2xl bg-cyan-700 px-6 font-extrabold text-white disabled:opacity-50 sm:w-auto"
      >
        {copy.button}
      </button>
    </section>
  );
}
