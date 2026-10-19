"use client";
import { MapPin, Phone, Siren, HeartHandshake } from "lucide-react";
import type { Language, RedFlagRule } from "@/lib/fastmed-safety";

const COPY = {
  en: {
    physicalTitle: "This could be an emergency",
    physicalBody:
      "Go to the nearest hospital emergency department now. Do not wait for FastMed's reply.",
    mentalTitle: "You don't have to face this alone",
    mentalBody:
      "If you might act on thoughts of harming yourself, go to the nearest hospital now or call 112. Stay with someone you trust and tell them how you feel.",
    detected: "Warning signs noticed:",
    call: "Call 112",
    hospital: "Find nearest hospital",
    note: "112 connects to Tanzania's emergency line. Public ambulances are limited, so if you can, ask someone to take you to hospital now.",
  },
  sw: {
    physicalTitle: "Hii inaweza kuwa dharura",
    physicalBody:
      "Nenda kitengo cha dharura cha hospitali iliyo karibu sasa hivi. Usisubiri jibu la FastMed.",
    mentalTitle: "Hauko peke yako",
    mentalBody:
      "Ikiwa unaweza kuchukua hatua ya kujidhuru, nenda hospitali iliyo karibu sasa au piga 112. Kaa na mtu unayemwamini na umweleze unavyojisikia.",
    detected: "Dalili za hatari zilizoonekana:",
    call: "Piga 112",
    hospital: "Tafuta hospitali iliyo karibu",
    note: "112 ni namba ya dharura ya Tanzania. Huduma za gari la wagonjwa za umma ni chache, hivyo ikiwezekana mwombe mtu akupeleke hospitali sasa.",
  },
};

export function EmergencyBanner({
  flags,
  mentalHealth,
  language,
}: {
  flags: RedFlagRule[];
  mentalHealth: boolean;
  language: Language;
}) {
  const t = COPY[language];
  const Icon = mentalHealth ? HeartHandshake : Siren;
  return (
    <section
      role="alert"
      aria-live="assertive"
      className="rounded-3xl border-2 border-red-300 bg-red-50 p-5 text-red-950 shadow-sm sm:p-7"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl font-extrabold">
            {mentalHealth ? t.mentalTitle : t.physicalTitle}
          </h2>
          <p className="mt-2 text-base font-semibold leading-7">
            {mentalHealth ? t.mentalBody : t.physicalBody}
          </p>
          {flags.length > 0 && (
            <div className="mt-3 text-sm">
              <p className="font-bold">{t.detected}</p>
              <ul className="mt-1 list-disc pl-5">
                {flags.map((flag) => (
                  <li key={flag.id}>{flag.label[language]}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="tel:112"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-extrabold text-white hover:bg-red-800"
            >
              <Phone className="h-5 w-5" aria-hidden="true" /> {t.call}
            </a>
            <a
              href="https://www.google.com/maps/search/hospital+near+me"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-red-700 bg-white px-5 py-3 font-extrabold text-red-800 hover:bg-red-100"
            >
              <MapPin className="h-5 w-5" aria-hidden="true" /> {t.hospital}
            </a>
          </div>
          <p className="mt-4 text-sm leading-6 text-red-900">{t.note}</p>
        </div>
      </div>
    </section>
  );
}
