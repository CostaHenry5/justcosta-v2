import { NextResponse } from "next/server";
import { getSupabaseServerClient, isApprovedAdmin } from "@/lib/supabase-server";

const editable = [
  "name", "professional_category", "specialty", "registration_authority",
  "registration_number", "masked_registration_number", "verification_status",
  "verified_at", "verification_expires_at", "public_listing_consent",
  "consented_at", "consent_version", "region", "district", "availability",
  "image_url", "phone", "show_public_phone", "languages", "consultation_hours", "is_active",
] as const;

async function authorized(request: Request) {
  return await isApprovedAdmin(request) ? null : NextResponse.json({ error: "This account is not authorised to manage practitioners." }, { status: 403 });
}

export async function GET(request: Request) {
  const denied = await authorized(request);
  if (denied) return denied;
  const { data, error } = await getSupabaseServerClient().from("practitioners").select("*").order("created_at");
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ practitioners: data || [] });
}

export async function POST(request: Request) {
  const denied = await authorized(request);
  if (denied) return denied;
  const body = await request.json();
  const professionalCategory = body.professional_category || body.role;
  if (!body.name || !professionalCategory) return NextResponse.json({ error: "Name and professional category are required." }, { status: 400 });
  const record = Object.fromEntries(editable.filter((field) => field in body).map((field) => [field, body[field]]));
  Object.assign(record, { professional_category: professionalCategory, verification_status: "pending", public_listing_consent: false, is_active: false, availability: "offline", show_public_phone: false });
  const { data, error } = await getSupabaseServerClient().from("practitioners").insert(record).select().single();
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ practitioner: data });
}

export async function PATCH(request: Request) {
  const denied = await authorized(request);
  if (denied) return denied;
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "Missing practitioner." }, { status: 400 });
  if (body.public_listing_consent === true && !body.consented_at) return NextResponse.json({ error: "A consent timestamp is required before public listing can be enabled." }, { status: 400 });
  if (body.verification_status === "verified" && !body.verified_at) return NextResponse.json({ error: "A verification timestamp is required before verified status can be saved." }, { status: 400 });
  const record = Object.fromEntries(editable.filter((field) => field in body).map((field) => [field, body[field]]));
  const { data, error } = await getSupabaseServerClient().from("practitioners").update(record).eq("id", body.id).select().single();
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ practitioner: data });
}
