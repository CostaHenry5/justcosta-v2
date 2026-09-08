import { MapPin, Phone } from "lucide-react";
import type { Practitioner } from "@/lib/fastmed-types";
import { PractitionerAvatar } from "./PractitionerAvatar";
import { VerificationBadge } from "./VerificationBadge";

export function PractitionerCard({ practitioner }: { practitioner: Practitioner }) {
  const contactable = practitioner.availability !== "offline" && practitioner.show_public_phone && practitioner.phone;
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <PractitionerAvatar name={practitioner.name} imageUrl={practitioner.image_url} />
        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-extrabold text-slate-950">{practitioner.name}</h3>{practitioner.verification_status === "verified" && <VerificationBadge />}</div><p className="mt-1 font-semibold text-cyan-800">{practitioner.professional_category}</p>{practitioner.specialty && <p className="text-sm text-slate-600">{practitioner.specialty}</p>}</div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500" aria-hidden="true" /> {practitioner.region}{practitioner.district ? ` · ${practitioner.district}` : ""}</p>
        {practitioner.registration_authority && <p><strong>Registered ·</strong> {practitioner.registration_authority}{practitioner.masked_registration_number ? ` ${practitioner.masked_registration_number}` : ""}</p>}
        <p><strong>Status:</strong> <span className={practitioner.availability === "available" ? "text-emerald-700" : "text-slate-600"}>{practitioner.availability === "available" ? "Available during listed hours" : practitioner.availability === "busy" ? "Busy" : "Offline"}</span></p>
        {practitioner.show_public_phone && practitioner.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-500" aria-hidden="true" /><a href={`tel:${practitioner.phone}`} className="font-semibold text-cyan-800 hover:underline">{practitioner.phone}</a></p>}
      </div>
      {contactable ? <a href={`tel:${practitioner.phone}`} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-700 px-4 py-2 font-bold text-white hover:bg-cyan-800">Contact practitioner</a> : <p className="mt-5 rounded-xl bg-slate-100 p-3 text-center text-sm font-semibold text-slate-600">Contact is not currently available</p>}
    </article>
  );
}
