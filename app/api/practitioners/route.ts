import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const { data, error } = await getSupabaseServerClient().from("practitioners").select("name,role,phone,image_url,languages,consultation_hours,is_available").order("created_at");
    if (error) throw error;
    return NextResponse.json({ practitioners: data || [] });
  } catch {
    return NextResponse.json({ practitioners: [] });
  }
}
