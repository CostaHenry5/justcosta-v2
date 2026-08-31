import { NextResponse } from "next/server";
import { getSupabaseServerClient, isApprovedAdmin } from "@/lib/supabase-server";

const editable = ["name", "role", "phone", "image_url", "languages", "consultation_hours", "is_available"] as const;

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
  if (!body.name || !body.role || !body.phone) return NextResponse.json({ error: "Name, role and phone are required." }, { status: 400 });
  const record = Object.fromEntries(editable.map((field) => [field, body[field] ?? (field === "is_available" ? true : "")]));
  const { data, error } = await getSupabaseServerClient().from("practitioners").insert(record).select().single();
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ practitioner: data });
}

export async function PATCH(request: Request) {
  const denied = await authorized(request);
  if (denied) return denied;
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "Missing practitioner." }, { status: 400 });
  const record = Object.fromEntries(editable.filter((field) => field in body).map((field) => [field, body[field]]));
  const { data, error } = await getSupabaseServerClient().from("practitioners").update(record).eq("id", body.id).select().single();
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ practitioner: data });
}
