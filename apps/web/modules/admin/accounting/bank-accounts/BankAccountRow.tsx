"use client";

import { Pencil, Trash2, Hash } from "lucide-react";
import type { BankAccount } from "./types";
import { BankAccountDefaultToggle } from "./BankAccountDefaultToggle";

interface BankAccountRowProps {
  account: BankAccount;
  toggleLoadingId: string | null;
  onEdit: (account: BankAccount) => void;
  onDelete: (account: BankAccount) => void;
  onToggleDefault: (id: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BankAccountRow({
  account,
  toggleLoadingId,
  onEdit,
  onDelete,
  onToggleDefault,
}: BankAccountRowProps) {
  return (
    <div
      className={[
        "grid grid-cols-[1fr_160px_140px_90px_80px] gap-4 items-center px-5 py-3.5",
        "border-b border-stone-100 last:border-0 transition-colors",
        account.is_default
          ? "bg-emerald-50/60 hover:bg-emerald-50"
          : "hover:bg-stone-50",
      ].join(" ")}
      role="row"
    >
      {/* Account name + bank name + default badge */}
      <div className="flex flex-col gap-0.5 min-w-0" role="cell">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#1a1a1a] font-[family-name:var(--font-dm-sans)] truncate">
            {account.account_name}
          </span>
          {account.is_default && (
            <span className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-wider text-[#2f4e40] bg-[#2f4e40]/10 border border-[#2f4e40]/20 px-2 py-0.5 rounded-full">
              Default
            </span>
          )}
        </div>
        <span className="text-[0.78rem] text-stone-400 font-[family-name:var(--font-dm-sans)] truncate">
          {account.bank_name}
        </span>
      </div>

      {/* Account number */}
      <div role="cell">
        {account.account_number ? (
          <div className="flex items-center gap-1.5">
            <Hash size={11} className="text-stone-300 shrink-0" />
            <span className="text-[0.8125rem] text-stone-500 font-[family-name:var(--font-dm-sans)] font-mono tracking-wide truncate">
              {account.account_number}
            </span>
          </div>
        ) : (
          <span className="text-[0.8125rem] text-stone-300 font-[family-name:var(--font-dm-sans)] italic">
            —
          </span>
        )}
      </div>

      {/* Created date */}
      <div role="cell">
        <span className="text-[0.8125rem] text-stone-400 font-[family-name:var(--font-dm-sans)]">
          {formatDate(account.created_at)}
        </span>
      </div>

      {/* Default toggle */}
      <div role="cell">
        <BankAccountDefaultToggle
          accountId={account.id}
          isDefault={account.is_default}
          loading={toggleLoadingId === account.id}
          onToggle={onToggleDefault}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5" role="cell">
        <button
          onClick={() => onEdit(account)}
          aria-label={`Edit ${account.account_name}`}
          className="w-8 h-8 rounded-md border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-700 hover:border-stone-300 transition-colors cursor-pointer"
        >
          <Pencil size={13} strokeWidth={2} />
        </button>
        <button
          onClick={() => onDelete(account)}
          aria-label={`Delete ${account.account_name}`}
          className="w-8 h-8 rounded-md border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
        >
          <Trash2 size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
