import { getSupabaseServerClient } from "@/lib/supabase-server";
import type { TriageLevel } from "@/lib/fastmed-safety";

/**
 * Anonymous usage counting. Records ONLY counts and categories:
 * no message text, no names, no phone numbers, no IP address, no device id.
 * Used to see how FastMED is used and to check safety (e.g. how often
 * emergencies are detected), never to identify anyone.
 */
export type UsageEvent = {
  language: "en" | "sw";
  isHealthRelated: boolean;
  triage: TriageLevel | null;
  redFlags: string[];
  usedCheckIn: boolean;
  redactions: number;
  firstMessage: boolean;
};

export async function recordUsage(event: UsageEvent) {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("fastmed_usage_events").insert({
      channel: "web",
      language: event.language,
      is_health_related: event.isHealthRelated,
      triage: event.triage,
      red_flags: event.redFlags,
      used_check_in: event.usedCheckIn,
      redactions: Math.min(event.redactions, 50),
      first_message: event.firstMessage,
    });
    if (error) console.warn("FastMED usage not recorded", error.message);
  } catch (error) {
    // Counting must never break a patient's conversation.
    console.warn("FastMED usage not recorded", error);
  }
}
