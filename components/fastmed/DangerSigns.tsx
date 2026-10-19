import { AlertTriangle } from "lucide-react";
import type { Language } from "@/lib/fastmed-safety";

const GROUPS: Record<Language, { title: string; intro: string; groups: Array<{ heading: string; items: string[] }> }> = {
  en: {
    title: "Emergency warning signs",
    intro: "Go to the nearest hospital emergency department straight away if you notice any of these.",
    groups: [
      {
        heading: "Anyone",
        items: [
          "Difficulty breathing or very fast breathing",
          "Chest pain or pressure",
          "Fainting, not waking up, or sudden severe confusion",
          "Seizure or convulsions",
          "Face drooping, weakness on one side, or slurred speech",
          "Heavy bleeding, or vomiting or coughing blood",
          "Swelling of the throat, tongue or lips",
          "Stiff neck with fever",
          "Poisoning, overdose, head injury or a bad burn",
          "Thoughts of suicide or self-harm",
        ],
      },
      {
        heading: "Children under 5",
        items: [
          "Unable to drink or breastfeed",
          "Vomits everything",
          "Very sleepy, floppy or hard to wake",
          "Convulsions",
        ],
      },
      {
        heading: "Pregnancy",
        items: [
          "Any vaginal bleeding",
          "Severe headache or blurred vision",
          "Severe abdominal pain",
          "Fever, waters breaking, or baby moving less than usual",
        ],
      },
    ],
  },
  sw: {
    title: "Dalili za hatari za dharura",
    intro: "Nenda kitengo cha dharura cha hospitali iliyo karibu mara moja ukiona dalili yoyote kati ya hizi.",
    groups: [
      {
        heading: "Mtu yeyote",
        items: [
          "Shida ya kupumua au kupumua haraka sana",
          "Maumivu au kubanwa kifua",
          "Kuzimia, kutoamka, au kuchanganyikiwa ghafla",
          "Degedege au kifafa",
          "Uso kulegea, udhaifu upande mmoja, au kuongea kwa shida",
          "Kutokwa na damu nyingi, au kutapika au kukohoa damu",
          "Kuvimba koo, ulimi au midomo",
          "Shingo kukaza pamoja na homa",
          "Sumu, kumeza dawa nyingi, jeraha la kichwa au kuungua vibaya",
          "Mawazo ya kujiua au kujidhuru",
        ],
      },
      {
        heading: "Watoto chini ya miaka 5",
        items: [
          "Hawezi kunywa au kunyonya",
          "Anatapika kila kitu",
          "Ana usingizi mzito, amelegea au haamki kwa urahisi",
          "Degedege",
        ],
      },
      {
        heading: "Ujauzito",
        items: [
          "Kutokwa na damu ukeni",
          "Maumivu makali ya kichwa au kuona ukungu",
          "Maumivu makali ya tumbo",
          "Homa, chupa kupasuka, au mtoto kucheza kidogo kuliko kawaida",
        ],
      },
    ],
  },
};

export function DangerSigns({ language }: { language: Language }) {
  const t = GROUPS[language];
  return (
    <section
      id="danger-signs"
      className="scroll-mt-6 rounded-3xl border border-red-200 bg-white p-5 sm:p-7"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-red-700" aria-hidden="true" />
        <div>
          <h2 className="text-2xl font-extrabold">{t.title}</h2>
          <p className="mt-1 text-slate-600">{t.intro}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {t.groups.map((group) => (
          <div key={group.heading} className="rounded-2xl bg-red-50/60 p-4">
            <h3 className="font-extrabold text-red-900">{group.heading}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-600">
        {language === "sw"
          ? "Namba ya dharura Tanzania: 112."
          : "Tanzania emergency number: 112."}
      </p>
    </section>
  );
}
