"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { BankAccountRow } from "./BankAccountRow";
import { BankAccount, PaginationMeta } from "@repo/types";

interface BankAccountsTableProps {
  accounts: BankAccount[];
  meta: PaginationMeta;
  togglingId: string | null;
  onEdit: (account: BankAccount) => void;
  onDelete: (account: BankAccount) => void;
  onToggleDefault: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function BankAccountsTable({
  accounts,
  meta,
  togglingId,
  onEdit,
  onDelete,
  onToggleDefault,
  onPageChange,
}: BankAccountsTableProps) {
  const { page, totalPages, total, limit } = meta;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
      {/* Scrollable table area */}
      <div className="overflow-x-auto">
        <div className="min-w-[820px] w-full">
          {/* Header */}
          <div
            className="grid grid-cols-[minmax(200px,1fr)_220px_140px_90px_80px] gap-4 px-5 py-3 bg-stone-50 border-b border-stone-200  w-full"
            role="row"
          >
            {[
              { label: "Account", align: "" },
              { label: "Account No.", align: "" },
              { label: "Created", align: "" },
              { label: "Default", align: "" },
              { label: "", align: "text-right" },
            ].map(({ label, align }, i) => (
              <span
                key={i}
                className={`text-[0.7rem] font-semibold uppercase tracking-widest text-stone-400 font-[family-name:var(--font-dm-sans)] ${align}`}
                role="columnheader"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div role="rowgroup">
            {accounts.map((account) => (
              <BankAccountRow
                key={account.id}
                account={account}
                togglingId={togglingId}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleDefault={onToggleDefault}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pagination footer — outside scroll, always full width */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 border-t border-stone-100 bg-stone-50">
        <span className="text-xs text-stone-400 font-[family-name:var(--font-dm-sans)]">
          {totalPages > 1
            ? `${startItem}–${endItem} of ${total} accounts`
            : `${total} ${total === 1 ? "account" : "accounts"} total`}
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
