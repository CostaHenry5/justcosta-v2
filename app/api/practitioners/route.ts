import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const now = new Date().toISOString();
    const { data, error } = await getSupabaseServerClient()
      .from("practitioners")
      .select("id,name,professional_category,specialty,registration_authority,masked_registration_number,verification_status,verified_at,verification_expires_at,region,district,availability,image_url,phone,show_public_phone,languages,consultation_hours")
      .eq("verification_status", "verified")
      .eq("public_listing_consent", true)
      .eq("is_active", true)
      .or(`verification_expires_at.is.null,verification_expires_at.gt.${now}`)
      .order("name");
    if (error) throw error;
    return NextResponse.json({ practitioners: data || [] });
  } catch (error) {
    console.error("Practitioner directory unavailable", error);
    return NextResponse.json({ practitioners: [] });
  }
}
