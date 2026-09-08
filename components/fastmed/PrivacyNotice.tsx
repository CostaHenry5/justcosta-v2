import { LockKeyhole } from "lucide-react";

export function PrivacyNotice() {
  return (
    <details className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-bold text-slate-900">
        <LockKeyhole className="h-4 w-4 text-cyan-700" aria-hidden="true" /> Privacy and sharing
      </summary>
      <p className="mt-3 leading-6">Messages are sent to FastMed&apos;s AI service to generate a reply. FastMed does not automatically send your conversation or health information to a practitioner. You decide what to copy or share.</p>
    </details>
  );
}
