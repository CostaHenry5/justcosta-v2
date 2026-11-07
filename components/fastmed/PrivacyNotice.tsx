import { LockKeyhole } from "lucide-react";
import type { Language } from "@/lib/fastmed-safety";

const COPY: Record<Language, { title: string; items: Array<[string, string]> }> = {
  en: {
    title: "Privacy and sharing",
    items: [
      [
        "What is sent",
        "Your messages and check-in answers (age, pregnancy, danger signs) are sent to our AI provider, OpenAI, on servers outside Tanzania, to produce a reply. Your name and location from the check-in are never sent.",
      ],
      [
        "What is removed first",
        "Phone numbers, email addresses, ID or account numbers and a name you type after \"my name is\" are removed before anything is sent.",
      ],
      [
        "What is kept",
        "FastMED does not store your conversations on its servers. Saved conversations stay only in this browser until you clear them. FastMED keeps anonymous counts (language, triage level, warning signs detected) with no message text.",
      ],
      [
        "Sharing",
        "FastMED never sends your conversation to a practitioner. You decide what to copy or share.",
      ],
      [
        "Your choices",
        "You can stop at any time, clear saved conversations below, or ask questions through the Contact section on justcosta.org.",
      ],
    ],
  },
  sw: {
    title: "Faragha na kushiriki",
    items: [
      [
        "Kinachotumwa",
        "Ujumbe wako na majibu ya uchunguzi wa awali (umri, ujauzito, dalili za hatari) hutumwa kwa mtoa huduma wetu wa AI, OpenAI, kwenye seva zilizo nje ya Tanzania, ili kutoa jibu. Jina na mahali ulipo kutoka uchunguzi wa awali havitumwi kamwe.",
      ],
      [
        "Kinachoondolewa kwanza",
        "Namba za simu, barua pepe, namba za vitambulisho au akaunti, na jina unaloandika baada ya \"jina langu ni\" huondolewa kabla ya kutuma.",
      ],
      [
        "Kinachohifadhiwa",
        "FastMED haihifadhi mazungumzo yako kwenye seva zake. Mazungumzo uliyohifadhi hubaki kwenye kivinjari hiki tu hadi uyafute. FastMED huhifadhi idadi zisizomtambulisha mtu (lugha, kiwango cha dharura, dalili za hatari) bila maandishi ya ujumbe.",
      ],
      [
        "Kushiriki",
        "FastMED haitumi kamwe mazungumzo yako kwa mtaalamu. Wewe ndiye unaamua cha kunakili au kushiriki.",
      ],
      [
        "Chaguo zako",
        "Unaweza kuacha wakati wowote, kufuta mazungumzo uliyohifadhi, au kuuliza maswali kupitia sehemu ya Mawasiliano kwenye justcosta.org.",
      ],
    ],
  },
};

export function PrivacyNotice({ language = "en" }: { language?: Language }) {
  const copy = COPY[language];
  return (
    <details className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-bold text-slate-900">
        <LockKeyhole className="h-4 w-4 text-cyan-700" aria-hidden="true" /> {copy.title}
      </summary>
      <dl className="mt-3 space-y-3 leading-6">
        {copy.items.map(([term, text]) => (
          <div key={term}>
            <dt className="font-bold text-slate-900">{term}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
