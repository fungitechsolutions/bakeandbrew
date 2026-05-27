"use client";

import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LedgerEntryRow } from "./LedgerEntryRow";
import { EmptyLedgerState } from "./EmptyLedgerState";
import type { LedgerEntryWithAccount } from "./ledger";

interface LedgerTableProps {
  entries: LedgerEntryWithAccount[];
  /** True only on the very first load (no data yet) */
  initialLoading: boolean;
  /** True when fetching the next page */
  isFetchingNextPage: boolean;
  /** No more pages to fetch */
  hasReachedEnd: boolean;
  /** Total count from server */
  totalCount: number;
  /** Ref to attach to the sentinel div at the bottom of the scroll area */
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  onCreateEntry: () => void;
  showBankColumns?: boolean;
}

export function LedgerTable({
  entries,
  initialLoading,
  isFetchingNextPage,
  hasReachedEnd,
  totalCount,
  sentinelRef,
  onCreateEntry,
  showBankColumns = true,
}: LedgerTableProps) {
  const colSpan = showBankColumns ? 8 : 6;

  const totalDebit = entries
    .filter((e) => e.entryType === "dr")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalCredit = entries
    .filter((e) => e.entryType === "cr")
    .reduce((sum, e) => sum + e.amount, 0);

  const fmt = (n: number) =>
    "Rs. " +
    (n / 100).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div
      className="rounded-xl border flex flex-col"
      style={{
        borderColor: "#e5e0d6",
        // Fill remaining viewport height; adjust the offset to match your page chrome
        height: "calc(100vh - 360px)",
        minHeight: "320px",
      }}
    >
      {/* Single scrollable region — thead is sticky inside it */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr
              className="text-xs font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: "var(--brand-green)",
                color: "var(--brand-cream)",
                // Stick to the top of the scroll container
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <th className="px-4 py-3 w-12 text-center">S.No</th>
              <th className="px-4 py-3 whitespace-nowrap">Date (BS)</th>
              {showBankColumns && (
                <>
                  <th className="px-4 py-3">Bank</th>
                  <th className="px-4 py-3">Account</th>
                </>
              )}
              <th className="px-4 py-3 w-10 text-center">D/C</th>
              <th className="px-4 py-3 text-right whitespace-nowrap w-36">
                Debit (Rs.)
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap w-36">
                Credit (Rs.)
              </th>
              <th className="px-4 py-3">Narration</th>
            </tr>
          </thead>

          <tbody>
            {initialLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b"
                  style={{
                    borderColor: "#f0ede7",
                    backgroundColor: i % 2 === 0 ? "#fff" : "#faf9f6",
                  }}
                >
                  {Array.from({ length: colSpan }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={colSpan}>
                  <EmptyLedgerState onCreateEntry={onCreateEntry} />
                </td>
              </tr>
            ) : (
              entries.map((entry, idx) => (
                <LedgerEntryRow
                  key={entry.id}
                  entry={entry}
                  serialNo={idx + 1}
                  showBankColumns={showBankColumns}
                  striped={idx % 2 !== 0}
                />
              ))
            )}
          </tbody>
        </table>

        {/* Infinite scroll sentinel */}
        <div
          ref={sentinelRef}
          className="flex items-center justify-center py-3"
        >
          {isFetchingNextPage && (
            <span
              className="flex items-center gap-2 text-xs"
              style={{ color: "#9ca3af" }}
            >
              <Loader2 size={14} className="animate-spin" />
              Loading more entries...
            </span>
          )}
          {hasReachedEnd && entries.length > 0 && (
            <span className="text-xs" style={{ color: "#9ca3af" }}>
              All {totalCount} entries loaded
            </span>
          )}
        </div>
      </div>

      {/* ── Footer totals — outside scroll area so it stays pinned ── */}
      {!initialLoading && entries.length > 0 && (
        <div
          className="flex-shrink-0 border-t overflow-auto"
          style={{ borderColor: "#e5e0d6" }}
        >
          <table className="w-full text-left text-sm border-collapse">
            <tfoot>
              <tr
                className="text-xs font-semibold"
                style={{
                  backgroundColor: "#f5f3ef",
                  color: "var(--brand-ink)",
                }}
              >
                <td
                  colSpan={showBankColumns ? 5 : 3}
                  className="px-4 py-2 text-right uppercase tracking-wide"
                  style={{ color: "#6b7280" }}
                >
                  Loaded Total ({entries.length} of {totalCount})
                </td>
                <td
                  className="px-4 py-2 text-right font-mono w-36"
                  style={{ color: "#dc2626" }}
                >
                  {fmt(totalDebit)}
                </td>
                <td
                  className="px-4 py-2 text-right font-mono w-36"
                  style={{ color: "#16a34a" }}
                >
                  {fmt(totalCredit)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
