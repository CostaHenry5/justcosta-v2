import { BadgeCheck } from "lucide-react";

export function VerificationBadge() {
  return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800"><BadgeCheck className="h-4 w-4" aria-hidden="true" /> Verified</span>;
}
