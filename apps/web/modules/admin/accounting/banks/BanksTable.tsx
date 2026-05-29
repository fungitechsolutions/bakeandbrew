"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { BankRow } from "./BanksRow";
import { Bank, PaginationMeta } from "@repo/types";

interface BanksTableProps {
  banks: Bank[];
  meta: PaginationMeta;
  toggleLoadingId: string | null;
  onEdit: (bank: Bank) => void;
  onDelete: (bank: Bank) => void;
  onToggleDefault: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function BanksTable({
  banks,
  meta,
  toggleLoadingId,
  onEdit,
  onDelete,
  onToggleDefault,
  onPageChange,
}: BanksTableProps) {
  const { page, totalPages, total, limit } = meta;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-sm">
      {/* Scrollable table area */}
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          {/* Table header */}
          <div
            className="grid grid-cols-[1fr_90px_160px_80px] gap-4 px-5 py-3 bg-stone-50 border-b border-stone-200"
            role="row"
          >
            {(["Bank Name", "Default", "Created", ""] as const).map((h, i) => (
              <span
                key={i}
                className={[
                  "text-[0.7rem] font-semibold uppercase tracking-widest text-stone-400 font-[family-name:var(--font-dm-sans)]",
                  i === 3 ? "text-right" : "",
                ].join(" ")}
                role="columnheader"
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div role="rowgroup">
            {banks.map((bank) => (
              <BankRow
                key={bank.id}
                bank={bank}
                toggleLoadingId={toggleLoadingId}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleDefault={onToggleDefault}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pagination — outside scroll, always full width */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 border-t border-stone-100 bg-stone-50">
        <span className="text-xs text-stone-400 font-[family-name:var(--font-dm-sans)]">
          {totalPages > 1
            ? `${startItem}–${endItem} of ${total} banks`
            : `${total} ${total === 1 ? "bank" : "banks"} total`}
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <PageBtn
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </PageBtn>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PageBtn
                key={p}
                onClick={() => onPageChange(p)}
                active={p === page}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </PageBtn>
            ))}

            <PageBtn
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </PageBtn>
          </div>
        )}
      </div>
    </div>
  );
}

interface PageBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

function PageBtn({ active, children, ...props }: PageBtnProps) {
  return (
    <button
      {...props}
      className={[
        "min-w-[30px] h-[30px] px-1.5 rounded-md border text-xs font-[family-name:var(--font-dm-sans)] flex items-center justify-center transition-colors cursor-pointer",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        active
          ? "bg-[#2f4e40] border-[#2f4e40] text-white font-semibold"
          : "bg-white border-stone-200 text-stone-500 hover:bg-stone-100 hover:border-stone-300",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
