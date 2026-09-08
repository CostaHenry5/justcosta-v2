import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = getSupabaseServerClient();
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
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
    console.warn("Phase 2 practitioner fields are not available yet; using the legacy public directory.", error);
    const { data, error: legacyError } = await supabase.from("practitioners").select("id,name,role,phone,image_url,languages,consultation_hours,is_available").order("created_at");
    if (legacyError) return NextResponse.json({ practitioners: [] });
    const localPhotos: Record<string, string> = { "julieth tibesyiga": "/practitioners/julieth-tibesyiga.jpg", "richard kinyaha": "/practitioners/richard-kinyaha.jpg", "moses masika": "/practitioners/moses-masika.jpg", "sudi zaidi": "/practitioners/sudi-zaidi.png", rashid: "/practitioners/rashid.jpg" };
    return NextResponse.json({ practitioners: (data || []).map((item) => ({ id: item.id, name: item.name, professional_category: item.role, specialty: null, registration_authority: null, masked_registration_number: null, verification_status: "pending", verified_at: null, verification_expires_at: null, region: "Tanzania", district: null, availability: item.is_available ? "available" : "offline", image_url: localPhotos[String(item.name).toLowerCase()] || item.image_url || null, phone: item.phone, show_public_phone: true, languages: item.languages, consultation_hours: item.consultation_hours, updated_at: null })) });
  }
}
