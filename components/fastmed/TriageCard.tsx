import { AlertOctagon, Clock, CalendarCheck, Home } from "lucide-react";
import { TRIAGE_COPY, type Language, type RedFlagRule, type TriageLevel } from "@/lib/fastmed-safety";

const STYLE: Record<TriageLevel, { box: string; badge: string; Icon: typeof Home }> = {
  emergency: { box: "border-red-300 bg-red-50 text-red-950", badge: "bg-red-600", Icon: AlertOctagon },
  urgent: { box: "border-orange-300 bg-orange-50 text-orange-950", badge: "bg-orange-600", Icon: Clock },
  soon: { box: "border-amber-300 bg-amber-50 text-amber-950", badge: "bg-amber-600", Icon: CalendarCheck },
  self_care: { box: "border-emerald-300 bg-emerald-50 text-emerald-950", badge: "bg-emerald-600", Icon: Home },
};

export function TriageCard({
  level,
  flags,
  language,
}: {
  level: TriageLevel;
  flags: RedFlagRule[];
  language: Language;
}) {
  const style = STYLE[level];
  const copy = TRIAGE_COPY[level][language];
  const sw = language === "sw";
  return (
    <section
      aria-label={sw ? "Kiwango cha huduma kinachopendekezwa" : "Recommended level of care"}
      className={`rounded-3xl border-2 p-5 sm:p-6 ${style.box}`}
    >
      <p className="text-xs font-extrabold uppercase tracking-[.16em] opacity-80">
        {sw ? "Kiwango cha huduma kinachopendekezwa" : "Recommended level of care"}
      </p>
      <div className="mt-3 flex items-start gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white ${style.badge}`}>
          <style.Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold sm:text-2xl">{copy.title}</h2>
          <p className="mt-1 font-semibold leading-7">{copy.action}</p>
          {flags.length > 0 && (
            <p className="mt-2 text-sm">
              <strong>{sw ? "Kwa sababu ya:" : "Because of:"}</strong>{" "}
              {flags.map((flag) => flag.label[language]).join("; ")}
            </p>
          )}
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold opacity-80">
        {sw
          ? "Huu ni mwongozo wa jumla, si utambuzi wa ugonjwa. Ukiwa na wasiwasi, tafuta huduma mapema zaidi."
          : "This is general guidance, not a diagnosis. If you are worried, seek care sooner."}
      </p>
    </section>
  );
}
