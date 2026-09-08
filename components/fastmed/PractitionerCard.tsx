import { MapPin, Phone } from "lucide-react";
import type { Practitioner } from "@/lib/fastmed-types";
import { PractitionerAvatar } from "./PractitionerAvatar";
import { VerificationBadge } from "./VerificationBadge";

export function PractitionerCard({
  practitioner,
  directoryCheckedAt,
}: {
  practitioner: Practitioner;
  directoryCheckedAt: string;
}) {
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "Africa/Dar_es_Salaam",
  }).format(new Date());
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const schedule = practitioner.consultation_hours || "";
  const normalizedSchedule = schedule.toLowerCase();
  const range = normalizedSchedule.match(
    /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*[–-]\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/,
  );
  const scheduledToday =
    normalizedSchedule.includes("daily") ||
    normalizedSchedule.includes(today.toLowerCase()) ||
    (range
      ? days.indexOf(today) >=
          days.findIndex((day) => day.toLowerCase() === range[1]) &&
        days.indexOf(today) <=
          days.findIndex((day) => day.toLowerCase() === range[2])
      : false);
  const availableToday =
    practitioner.availability === "available" && scheduledToday;
  const contactable =
    availableToday && practitioner.show_public_phone && practitioner.phone;
  const statusTime = practitioner.updated_at
    ? new Intl.DateTimeFormat("en-TZ", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Africa/Dar_es_Salaam",
      }).format(new Date(practitioner.updated_at))
    : "time not provided";
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <PractitionerAvatar
          name={practitioner.name}
          imageUrl={practitioner.image_url}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-extrabold text-slate-950">
              {practitioner.name}
            </h3>
            {practitioner.verification_status === "verified" && (
              <VerificationBadge />
            )}
          </div>
          <p className="mt-1 font-semibold text-cyan-800">
            {practitioner.professional_category}
          </p>
          {practitioner.specialty && (
            <p className="text-sm text-slate-600">{practitioner.specialty}</p>
          )}
          {practitioner.verification_status === "verified" && (
            <p className="mt-2 text-xs leading-5 text-slate-600">
              FastMed checked the professional registration details and
              public-listing consent. This does not guarantee care quality or
              live availability.
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-500" aria-hidden="true" />{" "}
          {practitioner.region}
          {practitioner.district ? ` · ${practitioner.district}` : ""}
        </p>
        {practitioner.registration_authority && (
          <p>
            <strong>Registered ·</strong> {practitioner.registration_authority}
            {practitioner.masked_registration_number
              ? ` ${practitioner.masked_registration_number}`
              : ""}
          </p>
        )}
        <p>
          <strong>Working hours:</strong> {schedule || "Not provided"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={availableToday ? "text-emerald-700" : "text-slate-600"}
          >
            {availableToday
              ? "Available today"
              : practitioner.availability === "busy"
                ? "Busy today"
                : "Not available today"}
          </span>{" "}
          <span className="text-xs text-slate-500">
            ·{" "}
            {practitioner.updated_at
              ? `Last updated ${statusTime} EAT.`
              : `Directory checked ${directoryCheckedAt} EAT; status update time not supplied.`}
          </span>
        </p>
        <p className="text-xs text-slate-500">
          Confirm by phone before travel.
        </p>
        {practitioner.show_public_phone && practitioner.phone && (
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <a
              href={`tel:${practitioner.phone}`}
              className="font-semibold text-cyan-800 hover:underline"
            >
              {practitioner.phone}
            </a>
          </p>
        )}
      </div>
      {contactable ? (
        <a
          href={`tel:${practitioner.phone}`}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-700 px-4 py-2 font-bold text-white hover:bg-cyan-800"
        >
          Contact practitioner
        </a>
      ) : (
        <p className="mt-5 rounded-xl bg-slate-100 p-3 text-center text-sm font-semibold text-slate-600">
          Contact is not currently available
        </p>
      )}
    </article>
  );
}
