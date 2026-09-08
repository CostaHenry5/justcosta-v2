"use client";
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Practitioner } from "@/lib/fastmed-types";
import { PractitionerCard } from "./PractitionerCard";

const defaults: Practitioner[] = [
  {
    id: "emil-mgwami",
    name: "Dr Emil Mgwami",
    professional_category: "Medical Doctor (MD)",
    phone: "+255623555127",
    image_url: null,
  },
  {
    id: "richard-kinyaha",
    name: "Richard Kinyaha",
    professional_category: "Dentist",
    phone: "+255620607399",
    image_url: "/practitioners/richard-kinyaha.jpg",
  },
  {
    id: "moses-masika",
    name: "Moses Masika",
    professional_category: "Medical Laboratory Professional",
    phone: "+255734717630",
    image_url: "/practitioners/moses-masika.jpg",
  },
  {
    id: "mussa-kihayile",
    name: "Mussa Kihayile",
    professional_category: "Registered Nurse (RN)",
    phone: "+255778652916",
    image_url: null,
  },
  {
    id: "sudi-zaidi",
    name: "Sudi Zaidi",
    professional_category: "Dentist (DDS)",
    phone: "+255679279037",
    image_url: "/practitioners/sudi-zaidi.png",
  },
  {
    id: "rashid",
    name: "Rashid",
    professional_category: "Medical Doctor (MD)",
    phone: "+255622269916",
    image_url: "/practitioners/rashid.jpg",
  },
  {
    id: "julieth-tibesyiga",
    name: "Julieth Tibesyiga",
    professional_category: "Medical Doctor (MD)",
    phone: "+255621109021",
    image_url: "/practitioners/julieth-tibesyiga.jpg",
  },
].map((item) => ({
  ...item,
  specialty: null,
  registration_authority: null,
  masked_registration_number: null,
  verification_status: "pending",
  verified_at: null,
  verification_expires_at: null,
  region: "Tanzania",
  district: null,
  availability: "available",
  show_public_phone: true,
  languages: "Kiswahili and English",
  consultation_hours: "Monday–Saturday, 08:00–17:00",
}));

export function PractitionerDirectory() {
  const [items, setItems] = useState<Practitioner[]>(defaults);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [availability, setAvailability] = useState("");
  const [directoryCheckedAt, setDirectoryCheckedAt] = useState("Checking now");

  useEffect(() => {
    fetch("/api/practitioners")
      .then((response) => response.json())
      .then((data) => {
        const saved: Practitioner[] = Array.isArray(data.practitioners)
          ? data.practitioners
          : [];
        const savedNames = new Set(
          saved.map((item) => item.name.toLowerCase()),
        );
        setItems([
          ...saved,
          ...defaults.filter(
            (item) => !savedNames.has(item.name.toLowerCase()),
          ),
        ]);
      })
      .finally(() => {
        setDirectoryCheckedAt(
          new Intl.DateTimeFormat("en-TZ", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Africa/Dar_es_Salaam",
          }).format(new Date()),
        );
        setLoading(false);
      });
  }, []);
  const categories = [
    ...new Set(items.map((item) => item.professional_category)),
  ].sort();
  const regions = [...new Set(items.map((item) => item.region))].sort();
  const filtered = items.filter((item) => {
    const haystack =
      `${item.name} ${item.professional_category} ${item.specialty || ""}`.toLowerCase();
    return (
      (!query || haystack.includes(query.toLowerCase())) &&
      (!category || item.professional_category === category) &&
      (!region || item.region === region) &&
      (!availability || item.availability === availability)
    );
  });
  const control =
    "min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-100";

  return (
    <section
      id="practitioners"
      className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-7"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-cyan-700">
            Professional support
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
            Healthcare practitioners
          </h2>
          <p className="mt-2 text-slate-600">
            Find a practitioner, view their professional details, and contact
            them directly.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            <strong>Verified means</strong> FastMed checked the
            practitioner&apos;s professional registration details and consent to
            be publicly listed. It does not guarantee care quality or live
            availability.
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Every availability card shows the practitioner&apos;s last update
            time when supplied; otherwise it shows when FastMed checked the
            directory and tells you the status-update time is unavailable.
          </p>
        </div>
        <SlidersHorizontal
          className="hidden h-6 w-6 text-cyan-700 sm:block"
          aria-hidden="true"
        />
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-4">
        <label className="relative lg:col-span-1">
          <span className="sr-only">Search practitioners</span>
          <Search
            className="absolute left-3 top-3.5 h-4 w-4 text-slate-400"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name or specialty"
            className={`${control} w-full pl-9`}
          />
        </label>
        <select
          aria-label="Professional category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={control}
        >
          <option value="">All categories</option>
          {categories.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          aria-label="Region"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          className={control}
        >
          <option value="">All regions</option>
          {regions.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          aria-label="Availability"
          value={availability}
          onChange={(event) => setAvailability(event.target.value)}
          className={control}
        >
          <option value="">Any availability</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>
      </div>
      {loading ? (
        <p className="mt-6 text-slate-600">Loading practitioners…</p>
      ) : filtered.length ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map((item) => (
            <PractitionerCard
              key={item.id}
              practitioner={item}
              directoryCheckedAt={directoryCheckedAt}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <p className="font-bold text-slate-900">
            No practitioners match these filters.
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Try changing the search or contact a nearby health facility if you
            need care.
          </p>
        </div>
      )}
      <p className="mt-5 text-sm font-semibold text-red-800">
        For urgent or life-threatening symptoms, go to the nearest emergency
        department or contact local emergency services. FastMed is not an
        emergency service.
      </p>
    </section>
  );
}
