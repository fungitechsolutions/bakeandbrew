"use client";

import { Pencil, Trash2, Hash, Phone } from "lucide-react";
import { Supplier } from "./types";

interface SupplierRowProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function SupplierRow({ supplier, onEdit, onDelete }: SupplierRowProps) {
  return (
    <div
      className="grid grid-cols-[minmax(200px,1fr)_160px_140px_160px_80px] gap-4 items-center px-5 py-3.5 border-b border-stone-100 last:border-0 transition-colors hover:bg-stone-50 min-w-[740px] w-full"
      role="row"
    >
      {/* Company name */}
      <div className="flex flex-col gap-0.5" role="cell">
        <span className="text-sm font-medium text-[#1a1a1a] font-[family-name:var(--font-dm-sans)]">
          {supplier.companyName}
        </span>
      </div>

      {/* VAT No */}
      <div role="cell">
        {supplier.vatNo ? (
          <div className="flex items-center gap-1.5">
            <Hash size={11} className="text-stone-300 shrink-0" />
            <span className="text-[0.8125rem] text-stone-500 font-[family-name:var(--font-dm-sans)] font-mono tracking-wide">
              {supplier.vatNo}
            </span>
          </div>
        ) : (
          <span className="text-[0.8125rem] text-stone-300 font-[family-name:var(--font-dm-sans)] italic">
            —
          </span>
        )}
      </div>

      {/* Phone */}
      <div role="cell">
        {supplier.phone ? (
          <div className="flex items-center gap-1.5">
            <Phone size={11} className="text-stone-300 shrink-0" />
            <span className="text-[0.8125rem] text-stone-500 font-[family-name:var(--font-dm-sans)]">
              {supplier.phone}
            </span>
          </div>
        ) : (
          <span className="text-[0.8125rem] text-stone-300 font-[family-name:var(--font-dm-sans)] italic">
            —
          </span>
        )}
      </div>

      {/* Created */}
      <div role="cell">
        <span className="text-[0.8125rem] text-stone-400 font-[family-name:var(--font-dm-sans)]">
          {formatDate(supplier.createdAt)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5" role="cell">
        <button
          onClick={() => onEdit(supplier)}
          aria-label={`Edit ${supplier.companyName}`}
          className="w-8 h-8 rounded-md border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-700 hover:border-stone-300 transition-colors cursor-pointer"
        >
          <Pencil size={13} strokeWidth={2} />
        </button>
        <button
          onClick={() => onDelete(supplier)}
          aria-label={`Delete ${supplier.companyName}`}
          className="w-8 h-8 rounded-md border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
        >
          <Trash2 size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
