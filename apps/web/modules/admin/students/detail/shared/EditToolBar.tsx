import { Check, X } from "lucide-react";

export function EditToolbar({
  onSave,
  onCancel,
  saving,
}: {
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onCancel}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2d4a3e]/12 text-[#2d4a3e]/40 transition-all hover:bg-[#f4f1ec] hover:text-[#2d4a3e]"
        aria-label="Cancel"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="flex h-7 items-center gap-1.5 rounded-lg bg-[#2d4a3e] px-3 text-[0.75rem] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
        style={{ fontFamily: "var(--font-dm-sans)" }}
        aria-label="Save"
      >
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
