export type VerificationStatus = "pending" | "verified" | "rejected" | "expired";
export type Availability = "available" | "busy" | "offline";

export type Practitioner = {
  id: string;
  name: string;
  professional_category: string;
  specialty: string | null;
  registration_authority: string | null;
  masked_registration_number: string | null;
  verification_status: VerificationStatus;
  verified_at: string | null;
  verification_expires_at: string | null;
  region: string;
  district: string | null;
  availability: Availability;
  image_url: string | null;
  phone: string | null;
  show_public_phone: boolean;
  languages: string | null;
  consultation_hours: string | null;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type IntakeForWhom = "self" | "child" | "other";
export type IntakePregnancy = "yes" | "no" | "unsure" | "na";
export type IntakeOnset = "today" | "1_3_days" | "4_7_days" | "over_week" | "over_month";
export type IntakeSeverity = "mild" | "moderate" | "severe";

/** Guided check-in answers. `name` never leaves the device. */
export type Intake = {
  forWhom: IntakeForWhom;
  name: string;
  age: string;
  pregnant: IntakePregnancy;
  location: string;
  concern: string;
  onset: IntakeOnset | "";
  severity: IntakeSeverity | "";
  dangerSigns: string[];
  questions: string;
};

/** The subset of intake sent to the server for safety checks (no name, no location). */
export type IntakeSafetyContext = {
  age: number | null;
  pregnant: boolean;
  dangerSigns: string[];
};
