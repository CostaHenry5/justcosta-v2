"use client";
import { useState, type ReactNode } from "react";
import {
  bodyMassIndex,
  estimatePaediatricWeight,
  glasgowComaScale,
  maintenanceFluids,
  meanArterialPressure,
  parklandFluids,
  weightBasedDose,
} from "@/lib/fastmed-calculators";

const num = (value: string) => (value.trim() === "" ? NaN : Number(value));
const fmt = (value: number) => value.toLocaleString("en-GB", { maximumFractionDigits: 2 });

function Card({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="font-extrabold text-indigo-950">{title}</h3>
      {note && <p className="mt-0.5 text-xs text-slate-500">{note}</p>}
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  unit,
  step = "any",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  step?: string;
}) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <span className="mt-1 flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          min={0}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base font-normal focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        {unit && <span className="shrink-0 text-xs font-semibold text-slate-500">{unit}</span>}
      </span>
    </label>
  );
}

function Result({ children, tone = "indigo" }: { children: ReactNode; tone?: "indigo" | "amber" }) {
  return (
    <div
      aria-live="polite"
      className={`rounded-xl p-3 text-sm leading-6 ${tone === "amber" ? "bg-amber-50 text-amber-950" : "bg-indigo-50 text-indigo-950"}`}
    >
      {children}
    </div>
  );
}

function Empty() {
  return <p className="text-sm text-slate-400">Enter values to calculate.</p>;
}

function WeightDoseCard() {
  const [weight, setWeight] = useState("");
  const [dose, setDose] = useState("");
  const [perDay, setPerDay] = useState("");
  const [max, setMax] = useState("");
  const [conc, setConc] = useState("");
  const result = weightBasedDose({
    weightKg: num(weight),
    doseMgPerKg: num(dose),
    dosesPerDay: num(perDay),
    maxSingleDoseMg: max ? num(max) : null,
    concentrationMgPerMl: conc ? num(conc) : null,
  });
  return (
    <Card title="Weight-based dose" note="Enter the mg/kg dose from the STG/NEMLIT or the prescription. No doses are built in.">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Weight" unit="kg" value={weight} onChange={setWeight} />
        <Field label="Dose" unit="mg/kg/dose" value={dose} onChange={setDose} />
        <Field label="Doses per day" unit="×/24h" step="1" value={perDay} onChange={setPerDay} />
        <Field label="Max single dose (optional)" unit="mg" value={max} onChange={setMax} />
        <Field label="Concentration (optional)" unit="mg/mL" value={conc} onChange={setConc} />
      </div>
      {result ? (
        <Result tone={result.cappedAtMax ? "amber" : "indigo"}>
          <p>
            <strong>Single dose: {fmt(result.singleDoseMg)} mg</strong>
            {result.volumeMl !== null && <> = <strong>{fmt(result.volumeMl)} mL</strong></>}
          </p>
          <p>Total daily dose: {fmt(result.dailyDoseMg)} mg/24h</p>
          {result.cappedAtMax && (
            <p className="mt-1 font-semibold">
              Calculated {fmt(result.calculatedSingleDoseMg)} mg exceeded the maximum — capped at {fmt(result.singleDoseMg)} mg.
            </p>
          )}
        </Result>
      ) : (
        <Empty />
      )}
    </Card>
  );
}

function PaedWeightCard() {
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const result = estimatePaediatricWeight(num(years || "0"), num(months || "0"));
  const touched = years !== "" || months !== "";
  return (
    <Card title="Estimated child weight (APLS)" note="For ages 1 month to 12 years when the child cannot be weighed. Always prefer a measured weight.">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Age" unit="years" step="1" value={years} onChange={setYears} />
        <Field label="+ months" unit="months" step="1" value={months} onChange={setMonths} />
      </div>
      {touched && result ? (
        <Result>
          <p>
            <strong>Estimated weight: {fmt(result.weightKg)} kg</strong>
          </p>
          <p className="text-xs">Formula: {result.formula}</p>
        </Result>
      ) : touched ? (
        <Result tone="amber">Valid for 1 month to 12 years 11 months.</Result>
      ) : (
        <Empty />
      )}
    </Card>
  );
}

function FluidsCard() {
  const [weight, setWeight] = useState("");
  const result = maintenanceFluids(num(weight));
  return (
    <Card title="Maintenance fluids (4-2-1 rule)" note="Holliday–Segar. Adjust for dehydration, ongoing losses, renal or cardiac disease, and local protocol.">
      <Field label="Weight" unit="kg" value={weight} onChange={setWeight} />
      {result ? (
        <Result>
          <p>
            <strong>{fmt(result.mlPerHour)} mL/hour</strong> ({fmt(result.mlPerDay)} mL/24h)
          </p>
        </Result>
      ) : (
        <Empty />
      )}
    </Card>
  );
}

function ParklandCard() {
  const [weight, setWeight] = useState("");
  const [tbsa, setTbsa] = useState("");
  const result = parklandFluids(num(weight), num(tbsa));
  return (
    <Card title="Burns fluid resuscitation (Parkland)" note="4 mL × kg × %TBSA over 24 h from the time of burn. Partial- and full-thickness burns only. Titrate to urine output.">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Weight" unit="kg" value={weight} onChange={setWeight} />
        <Field label="Burn area" unit="% TBSA" value={tbsa} onChange={setTbsa} />
      </div>
      {result ? (
        <Result>
          <p>
            <strong>Total: {fmt(result.totalMl)} mL</strong> in 24 h
          </p>
          <p>
            First 8 h: {fmt(result.first8hMl)} mL (≈{fmt(result.first8hMlPerHour)} mL/h) · Next 16 h: {fmt(result.next16hMl)} mL (≈
            {fmt(result.next16hMlPerHour)} mL/h)
          </p>
        </Result>
      ) : (
        <Empty />
      )}
    </Card>
  );
}

const EYE = ["1 – None", "2 – To pain", "3 – To voice", "4 – Spontaneous"];
const VERBAL = ["1 – None", "2 – Sounds", "3 – Words", "4 – Confused", "5 – Oriented"];
const MOTOR = ["1 – None", "2 – Extension", "3 – Abnormal flexion", "4 – Withdraws", "5 – Localises", "6 – Obeys"];

function GcsCard() {
  const [eye, setEye] = useState(0);
  const [verbal, setVerbal] = useState(0);
  const [motor, setMotor] = useState(0);
  const result = glasgowComaScale(eye, verbal, motor);
  const select = (label: string, options: string[], value: number, set: (v: number) => void) => (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <select
        value={value}
        onChange={(event) => set(Number(event.target.value))}
        className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base font-normal"
      >
        <option value={0}>Select…</option>
        {options.map((option, index) => (
          <option key={option} value={index + 1}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <Card title="Glasgow Coma Scale" note="Adults and older children. Record components separately, e.g. E3 V4 M6.">
      <div className="grid gap-3 sm:grid-cols-3">
        {select("Eye", EYE, eye, setEye)}
        {select("Verbal", VERBAL, verbal, setVerbal)}
        {select("Motor", MOTOR, motor, setMotor)}
      </div>
      {result ? (
        <Result tone={result.severity === "mild" ? "indigo" : "amber"}>
          <p>
            <strong>
              GCS {result.total}/15 (E{eye} V{verbal} M{motor})
            </strong>{" "}
            — {result.severity === "mild" ? "mild (13–15)" : result.severity === "moderate" ? "moderate (9–12)" : "severe (≤8): protect the airway"}
          </p>
        </Result>
      ) : (
        <Empty />
      )}
    </Card>
  );
}

function BmiMapCard() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const bmi = bodyMassIndex(num(weight), num(height));
  const map = meanArterialPressure(num(sys), num(dia));
  return (
    <Card title="BMI and mean arterial pressure" note="BMI categories are for adults (WHO).">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Weight" unit="kg" value={weight} onChange={setWeight} />
        <Field label="Height" unit="cm" value={height} onChange={setHeight} />
      </div>
      {bmi ? (
        <Result>
          <strong>BMI {fmt(bmi.bmi)} kg/m²</strong> — {bmi.category}
        </Result>
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Systolic" unit="mmHg" value={sys} onChange={setSys} />
        <Field label="Diastolic" unit="mmHg" value={dia} onChange={setDia} />
      </div>
      {map ? (
        <Result tone={map.map < 65 ? "amber" : "indigo"}>
          <strong>MAP {map.map} mmHg</strong>
          {map.map < 65 && " — below 65 mmHg"}
        </Result>
      ) : null}
      {!bmi && !map && <Empty />}
    </Card>
  );
}

export function Calculators() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <WeightDoseCard />
        <PaedWeightCard />
        <FluidsCard />
        <ParklandCard />
        <GcsCard />
        <BmiMapCard />
      </div>
      <p className="text-xs leading-5 text-slate-500">
        Calculators run on this device and use standard published formulae. Double-check every result, especially doses
        and fluids for children, before acting.
      </p>
    </div>
  );
}
