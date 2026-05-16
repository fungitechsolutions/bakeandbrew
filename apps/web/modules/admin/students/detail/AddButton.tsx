import { Plus } from "lucide-react";

export function AddBtn({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg bg-[#2d4a3e] px-3 py-1.5 text-[0.78rem] font-semibold text-white transition-all hover:opacity-90"
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      <Plus className="h-3 w-3" strokeWidth={2.5} />
      {label}
    </button>
  );
}
