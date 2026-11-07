import { NextResponse } from "next/server";
import { getSupabaseServerClient, isApprovedAdmin } from "@/lib/supabase-server";

type Row = {
  created_at: string;
  language: string;
  is_health_related: boolean;
  triage: string | null;
  red_flags: string[] | null;
  used_check_in: boolean;
  redactions: number;
  first_message: boolean;
};

/** Anonymous usage summary for the last 30 days (admin only). */
export async function GET(request: Request) {
  if (!(await isApprovedAdmin(request)))
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("fastmed_usage_events")
    .select("created_at,language,is_health_related,triage,red_flags,used_check_in,redactions,first_message")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(20000);
  if (error) return NextResponse.json({ error: "Usage data is not available yet." }, { status: 500 });

  const rows = (data || []) as Row[];
  const count = (test: (row: Row) => boolean) => rows.filter(test).length;
  const flagCounts = new Map<string, number>();
  for (const row of rows)
    for (const flag of row.red_flags || []) flagCounts.set(flag, (flagCounts.get(flag) || 0) + 1);

  return NextResponse.json({
    days: 30,
    messages: rows.length,
    conversations: count((row) => row.first_message),
    healthRelated: count((row) => row.is_health_related),
    swahili: count((row) => row.language === "sw"),
    usedCheckIn: count((row) => row.first_message && row.used_check_in),
    messagesWithRedactions: count((row) => row.redactions > 0),
    triage: {
      emergency: count((row) => row.triage === "emergency"),
      urgent: count((row) => row.triage === "urgent"),
      soon: count((row) => row.triage === "soon"),
      self_care: count((row) => row.triage === "self_care"),
    },
    topRedFlags: [...flagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id, total]) => ({ id, total })),
  });
}
