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
