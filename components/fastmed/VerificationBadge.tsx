import { BadgeCheck } from "lucide-react";

export function VerificationBadge() {
  return <span title="FastMed checked the practitioner's professional registration details and public-listing consent. Verification is not a guarantee of care quality or current availability." className="inline-flex cursor-help items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800"><BadgeCheck className="h-4 w-4" aria-hidden="true" /> Verified <span className="underline decoration-dotted">What this means</span></span>;
}
