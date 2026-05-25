"use client";

import { Building2, Plus } from "lucide-react";

interface BanksEmptyProps {
  onAdd: () => void;
}

export function BanksEmpty({ onAdd }: BanksEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center gap-4">
      <div className="w-16 h-16 rounded-full border border-dashed border-[#c28a4f] flex items-center justify-center text-[#c28a4f] opacity-70">
        <Building2 size={28} strokeWidth={1.5} />
      </div>
      <h3 className="font-[family-name:var(--font-lora)] text-lg font-semibold text-[#1a1a1a]">
        No banks yet
      </h3>
      <p className="font-[family-name:var(--font-dm-sans)] text-sm text-stone-500 max-w-xs leading-relaxed">
        Add your first bank account to start tracking payment channels.
      </p>
      <button
        onClick={onAdd}
        className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2f4e40] text-[#fbfaf7] text-sm font-medium font-[family-name:var(--font-dm-sans)] hover:bg-[#3a5a49] transition-colors cursor-pointer"
      >
        <Plus size={15} strokeWidth={2.5} />
        Add Bank
      </button>
    </div>
  );
}
