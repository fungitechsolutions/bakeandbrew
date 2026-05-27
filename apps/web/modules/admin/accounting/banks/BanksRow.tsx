"use client";

import { Pencil, Trash2 } from "lucide-react";
import { BankDefaultToggle } from "./BankDefaultToggle";
import { Bank } from "@repo/types";

interface BankRowProps {
  bank: Bank;
  toggleLoadingId: string | null;
  onEdit: (bank: Bank) => void;
  onDelete: (bank: Bank) => void;
  onToggleDefault: (id: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BankRow({
  bank,
  toggleLoadingId,
  onEdit,
  onDelete,
  onToggleDefault,
}: BankRowProps) {
  return (
    <div
      className={[
        "grid grid-cols-[1fr_90px_160px_80px] gap-4 items-center px-5 py-3.5",
        "border-b border-stone-100 last:border-0 transition-colors",
        bank.isDefault
          ? "bg-emerald-50/60 hover:bg-emerald-50"
          : "hover:bg-stone-50",
      ].join(" ")}
      role="row"
    >
      {/* Name + badge */}
      <div className="flex items-center gap-2.5 min-w-0" role="cell">
        <span className="text-sm font-medium text-[#1a1a1a] font-[family-name:var(--font-dm-sans)] truncate">
          {bank.name}
        </span>
        {bank.isDefault && (
          <span className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-wider text-[#2f4e40] bg-[#2f4e40]/10 border border-[#2f4e40]/20 px-2 py-0.5 rounded-full">
            Default
          </span>
        )}
      </div>

      {/* Toggle */}
      <div role="cell">
        <BankDefaultToggle
          bankId={bank.id}
          isDefault={bank.isDefault}
          loading={toggleLoadingId === bank.id}
          onToggle={onToggleDefault}
        />
      </div>

      {/* Date */}
      <div role="cell">
        <span className="text-[0.8125rem] text-stone-400 font-[family-name:var(--font-dm-sans)]">
          {formatDate(bank.createdAt)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5" role="cell">
        <button
          onClick={() => onEdit(bank)}
          aria-label={`Edit ${bank.name}`}
          className="w-8 h-8 rounded-md border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-700 hover:border-stone-300 transition-colors cursor-pointer"
        >
          <Pencil size={13} strokeWidth={2} />
        </button>
        <button
          onClick={() => onDelete(bank)}
          aria-label={`Delete ${bank.name}`}
          className="w-8 h-8 rounded-md border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
        >
          <Trash2 size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
