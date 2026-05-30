"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SupplierLedgerEntryRow } from "./SupplierLedgerEntryRow";
import { SupplierLedger } from "./types";

const COL_SPAN_WITH = 8;
const COL_SPAN_WITHOUT = 7;

interface SupplierLedgerTableProps {
  entries: SupplierLedger[];
  isFetchingNextPage: boolean;
  hasReachedEnd: boolean;
  totalCount: number;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  showSupplierColumn?: boolean;
}

export function SupplierLedgerTable({
  entries,
  isFetchingNextPage,
  hasReachedEnd,
  totalCount,
  scrollContainerRef,
  onScroll,
  showSupplierColumn = true,
}: SupplierLedgerTableProps) {
  const colSpan = showSupplierColumn ? COL_SPAN_WITH : COL_SPAN_WITHOUT;

  const totalDebit = entries
    .filter((e) => e.entryType === "dr")
    .reduce((s, e) => s + e.amount, 0);
  const totalCredit = entries
    .filter((e) => e.entryType === "cr")
    .reduce((s, e) => s + e.amount, 0);

  const fmt = (n: number) =>
    "Rs. " +
    (n / 100).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  useEffect(() => {
    if (hasReachedEnd && entries.length > 0) {
      toast.info(`All ${totalCount} entries loaded`);
    }
  }, [hasReachedEnd, entries.length, totalCount]);

  return (
    <div
      className="rounded-xl border flex flex-col overflow-hidden"
      style={{
        borderColor: "#e5e0d6",
        height: "calc(100vh - 360px)",
        minHeight: "320px",
      }}
    >
      <div
        ref={scrollContainerRef}
        onScroll={onScroll}
        className="flex-1 overflow-auto"
      >
        <table
          className="w-full text-left text-sm border-collapse"
          style={{ minWidth: showSupplierColumn ? "820px" : "680px" }}
        >
          <thead>
            <tr
              className="text-xs font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: "var(--brand-green)",
                color: "var(--brand-cream)",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <th className="px-4 py-3 w-12 text-center">S.No</th>
              <th className="px-4 py-3 whitespace-nowrap">Date (BS)</th>
              {showSupplierColumn && <th className="px-4 py-3">Supplier</th>}
              <th className="px-4 py-3 w-10 text-center">D/C</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                Debit (Rs.)
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                Credit (Rs.)
              </th>
              <th className="px-4 py-3">Narration</th>
              {/* <th className="px-4 py-3 whitespace-nowrap">Stock In Ref</th> */}
            </tr>
          </thead>

          <tbody>
            {entries.map((entry, idx) => (
              <SupplierLedgerEntryRow
                key={entry.id}
                entry={{ ...entry, amount: entry.amount / 100 }}
                serialNo={idx + 1}
                showSupplierColumn={showSupplierColumn}
                striped={idx % 2 !== 0}
              />
            ))}
          </tbody>

          <tfoot style={{ position: "sticky", bottom: 0, zIndex: 1 }}>
            {isFetchingNextPage && (
              <tr style={{ backgroundColor: "#faf9f6" }}>
                <td colSpan={colSpan} className="px-4 py-2 text-center">
                  <span
                    className="flex items-center justify-center gap-2 text-xs"
                    style={{ color: "#9ca3af" }}
                  >
                    <Loader2 size={13} className="animate-spin" />
                    Loading more entries...
                  </span>
                </td>
              </tr>
            )}
            <tr
              className="text-xs font-semibold border-t whitespace-nowrap"
              style={{ backgroundColor: "#f5f3ef", borderColor: "#e5e0d6" }}
            >
              <td
                colSpan={showSupplierColumn ? 4 : 3}
                className="px-4 py-2 text-right uppercase tracking-wide"
                style={{ color: "#6b7280" }}
              >
                Loaded Total ({entries.length} of {totalCount})
              </td>
              <td
                className="px-4 py-2 text-right font-mono"
                style={{ color: "#dc2626" }}
              >
                {fmt(totalDebit / 100)}
              </td>
              <td
                className="px-4 py-2 text-right font-mono"
                style={{ color: "#16a34a" }}
              >
                {fmt(totalCredit / 100)}
              </td>
              <td />
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
