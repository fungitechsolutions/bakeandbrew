"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta, Supplier } from "@repo/types";
import { SupplierRow } from "./SupplierRow";

interface SuppliersTableProps {
  suppliers: Supplier[];
  meta: PaginationMeta;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  onPageChange: (page: number) => void;
}

export function SuppliersTable({
  suppliers,
  meta,
  onEdit,
  onDelete,
  onPageChange,
}: SuppliersTableProps) {
  const { page, totalPages, total, limit } = meta;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="overflow-x-auto rounded-t-xl">
        <div className="min-w-[740px] w-full">
          {/* Header */}
          <div
            className="grid grid-cols-[minmax(200px,1fr)_160px_140px_160px_80px] gap-4 px-5 py-3 bg-stone-50 border-b border-stone-200 min-w-[740px] w-full"
            role="row"
          >
            {[
              { label: "Company Name", align: "" },
              { label: "VAT No.", align: "" },
              { label: "Phone", align: "" },
              { label: "Created", align: "" },
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
            {suppliers.map((supplier) => (
              <SupplierRow
                key={supplier.id}
                supplier={supplier}
                onEdit={() => onEdit(supplier)}
                onDelete={() => onDelete(supplier)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 border-t border-stone-100 bg-stone-50 rounded-b-xl">
        <span className="text-xs text-stone-400 font-[family-name:var(--font-dm-sans)]">
          {totalPages > 1
            ? `${startItem}–${endItem} of ${total} suppliers`
            : `${total} ${total === 1 ? "supplier" : "suppliers"} total`}
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
