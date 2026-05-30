import { ClipboardList, Plus } from "lucide-react";

interface SupplierLedgerEmptyProps {
  onCreateEntry: () => void;
}

export function SupplierLedgerEmpty({
  onCreateEntry,
}: SupplierLedgerEmptyProps) {
  return (
    <div
      className="rounded-xl border flex flex-col items-center justify-center gap-4 py-20 text-center"
      style={{
        borderColor: "#e5e0d6",
        backgroundColor: "#fff",
        minHeight: "320px",
      }}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: "#f5f3ef", border: "1.5px solid #e5e0d6" }}
      >
        <ClipboardList size={24} style={{ color: "#9ca3af" }} />
      </div>
      <div>
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--brand-ink)" }}
        >
          No ledger entries yet
        </p>
        <p className="mt-1 text-xs text-stone-400">
          Record a purchase or payment to get started.
        </p>
      </div>
      <button
        onClick={onCreateEntry}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#2f4e40] text-[#fbfaf7] text-sm font-medium hover:bg-[#3a5a49] hover:shadow-md transition-all cursor-pointer"
      >
        <Plus size={15} strokeWidth={2.5} />
        New Entry
      </button>
    </div>
  );
}
