import { Building2, Plus } from "lucide-react";

interface SuppliersEmptyProps {
  onAdd: () => void;
}

export function SuppliersEmpty({ onAdd }: SuppliersEmptyProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white px-6 py-16 flex flex-col items-center gap-4 text-center shadow-sm">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: "#f5f3ef", border: "1.5px solid #e5e0d6" }}
      >
        <Building2 size={24} style={{ color: "#9ca3af" }} />
      </div>
      <div>
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--brand-ink)" }}
        >
          No suppliers yet
        </p>
        <p className="mt-1 text-xs text-stone-400">
          Add your first supplier to start tracking purchases and payments.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#2f4e40] text-[#fbfaf7] text-sm font-medium hover:bg-[#3a5a49] hover:shadow-md transition-all cursor-pointer"
      >
        <Plus size={15} strokeWidth={2.5} />
        Add Supplier
      </button>
    </div>
  );
}
