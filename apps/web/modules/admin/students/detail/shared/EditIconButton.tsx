import { Pencil } from "lucide-react";

export function EditIconBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#2d4a3e]/30 transition-all hover:bg-[#2d4a3e]/06 hover:text-[#2d4a3e]"
      aria-label="Edit"
    >
      <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  );
}
