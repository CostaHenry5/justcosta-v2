/**
 * FastMED Pro clinical calculators.
 *
 * Pure, deterministic functions — no AI involved. Each returns null for
 * invalid input instead of a misleading number. No drug doses are built in:
 * the clinician enters the mg/kg dose from the STG/NEMLIT or a prescriber.
 */

const isPositive = (value: number) => Number.isFinite(value) && value > 0;
const round = (value: number, places = 1) => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

// ---------------------------------------------------------------------------
// Weight-based dose
// ---------------------------------------------------------------------------
export type WeightDoseInput = {
  weightKg: number;
  doseMgPerKg: number;
  /** Doses per 24 hours (e.g. 3 for 8-hourly). */
  dosesPerDay: number;
  /** Optional maximum single dose in mg. */
  maxSingleDoseMg?: number | null;
  /** Optional concentration of the preparation, mg per mL. */
  concentrationMgPerMl?: number | null;
};

export type WeightDoseResult = {
  calculatedSingleDoseMg: number;
  singleDoseMg: number;
  cappedAtMax: boolean;
  dailyDoseMg: number;
  volumeMl: number | null;
};

export function weightBasedDose(input: WeightDoseInput): WeightDoseResult | null {
  const { weightKg, doseMgPerKg, dosesPerDay } = input;
  if (!isPositive(weightKg) || weightKg > 250) return null;
  if (!isPositive(doseMgPerKg) || !isPositive(dosesPerDay) || dosesPerDay > 24) return null;
  const calculated = weightKg * doseMgPerKg;
  const max = input.maxSingleDoseMg && isPositive(input.maxSingleDoseMg) ? input.maxSingleDoseMg : null;
  const single = max !== null ? Math.min(calculated, max) : calculated;
  const concentration =
    input.concentrationMgPerMl && isPositive(input.concentrationMgPerMl) ? input.concentrationMgPerMl : null;
  return {
    calculatedSingleDoseMg: round(calculated, 2),
    singleDoseMg: round(single, 2),
    cappedAtMax: max !== null && calculated > max,
    dailyDoseMg: round(single * dosesPerDay, 2),
    volumeMl: concentration ? round(single / concentration, 2) : null,
  };
}

// ---------------------------------------------------------------------------
// Paediatric weight estimate (APLS formulae) — use measured weight when possible
// ---------------------------------------------------------------------------
export function estimatePaediatricWeight(ageYears: number, ageMonths = 0): { weightKg: number; formula: string } | null {
  if (!Number.isFinite(ageYears) || !Number.isFinite(ageMonths) || ageYears < 0 || ageMonths < 0) return null;
  const totalMonths = ageYears * 12 + ageMonths;
  if (totalMonths < 1 || totalMonths > 12 * 12 + 11) return null;
  if (totalMonths <= 12) return { weightKg: round(0.5 * totalMonths + 4), formula: "(0.5 × age in months) + 4" };
  const years = Math.floor(totalMonths / 12);
  if (years <= 5) return { weightKg: round(2 * years + 8), formula: "(2 × age in years) + 8" };
  return { weightKg: round(3 * years + 7), formula: "(3 × age in years) + 7" };
}

// ---------------------------------------------------------------------------
// Maintenance fluids (Holliday–Segar 4-2-1 rule)
// ---------------------------------------------------------------------------
export function maintenanceFluids(weightKg: number): { mlPerHour: number; mlPerDay: number } | null {
  if (!isPositive(weightKg) || weightKg > 250) return null;
  const first = Math.min(weightKg, 10);
  const second = Math.min(Math.max(weightKg - 10, 0), 10);
  const rest = Math.max(weightKg - 20, 0);
  const perHour = first * 4 + second * 2 + rest * 1;
  return { mlPerHour: round(perHour), mlPerDay: round(perHour * 24, 0) };
}

// ---------------------------------------------------------------------------
// Parkland formula for burns (first 24 hours from time of burn)
// ---------------------------------------------------------------------------
export function parklandFluids(
  weightKg: number,
  tbsaPercent: number,
): { totalMl: number; first8hMl: number; next16hMl: number; first8hMlPerHour: number; next16hMlPerHour: number } | null {
  if (!isPositive(weightKg) || weightKg > 250) return null;
  if (!isPositive(tbsaPercent) || tbsaPercent > 100) return null;
  const total = 4 * weightKg * tbsaPercent;
  return {
    totalMl: round(total, 0),
    first8hMl: round(total / 2, 0),
    next16hMl: round(total / 2, 0),
    first8hMlPerHour: round(total / 2 / 8, 0),
    next16hMlPerHour: round(total / 2 / 16, 0),
  };
}

// ---------------------------------------------------------------------------
// Glasgow Coma Scale
// ---------------------------------------------------------------------------
export function glasgowComaScale(eye: number, verbal: number, motor: number) {
  const valid =
    Number.isInteger(eye) && eye >= 1 && eye <= 4 &&
    Number.isInteger(verbal) && verbal >= 1 && verbal <= 5 &&
    Number.isInteger(motor) && motor >= 1 && motor <= 6;
  if (!valid) return null;
  const total = eye + verbal + motor;
  const severity = total >= 13 ? "mild" : total >= 9 ? "moderate" : "severe";
  return { total, severity: severity as "mild" | "moderate" | "severe" };
}

// ---------------------------------------------------------------------------
// Body mass index (adults)
// ---------------------------------------------------------------------------
export function bodyMassIndex(weightKg: number, heightCm: number) {
  if (!isPositive(weightKg) || weightKg > 400 || !isPositive(heightCm) || heightCm < 50 || heightCm > 260) return null;
  const metres = heightCm / 100;
  const bmi = round(weightKg / (metres * metres));
  const category =
    bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese";
  return { bmi, category };
}

// ---------------------------------------------------------------------------
// Mean arterial pressure
// ---------------------------------------------------------------------------
export function meanArterialPressure(systolic: number, diastolic: number) {
  if (!isPositive(systolic) || !isPositive(diastolic) || systolic > 300 || diastolic >= systolic) return null;
  return { map: round((systolic + 2 * diastolic) / 3, 0) };
}
