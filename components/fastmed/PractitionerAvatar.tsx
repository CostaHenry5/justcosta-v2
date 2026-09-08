type Props = { name: string; imageUrl?: string | null };

export function PractitionerAvatar({ name, imageUrl }: Props) {
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  if (imageUrl) return <img src={imageUrl} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-slate-200" />;
  return <div aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-lg font-extrabold text-cyan-800">{initials}</div>;
}
