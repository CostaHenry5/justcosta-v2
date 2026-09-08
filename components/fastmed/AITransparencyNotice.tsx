import { ShieldCheck } from "lucide-react";

export function AITransparencyNotice() {
  return (
    <aside
      className="flex gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-950"
      role="note"
    >
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p>
        <strong>STG/NEMLIT 2026–grounded medical guidance.</strong> FastMed AI
        prepares this explanation from available Tanzania Ministry of Health
        STG/NEMLIT, 7th Edition (2026) information. It is not a diagnosis or
        prescription; confirm medical decisions with a qualified healthcare
        professional.
      </p>
    </aside>
  );
}
