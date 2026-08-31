import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) throw new Error("Supabase is not configured.");
  return createClient(url, secret, { auth: { persistSession: false } });
}

export async function isApprovedAdmin(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return false;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser(token);
  return !error && !!data.user && data.user.email === process.env.ADMIN_EMAIL;
}
