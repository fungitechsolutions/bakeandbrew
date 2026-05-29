"use client";

import { useEffect } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CashLedgerEntryRow } from "./CashLedgerEntryRow";
import { EmptyCashLedgerState } from "./EmptyCashLedgerState";
import { CashLedger } from "@repo/types";

const COL_SPAN = 6;

interface CashLedgerTableProps {
  entries: CashLedger[];
  initialLoading: boolean;
  isFetchingNextPage: boolean;
  hasReachedEnd: boolean;
  totalCount: number;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onCreateEntry: () => void;
  isError: boolean;
  refetch: () => void;
}

export function CashLedgerTable({
  entries,
  initialLoading,
  isFetchingNextPage,
  hasReachedEnd,
  totalCount,
  scrollContainerRef,
  onScroll,
  onCreateEntry,
  isError,
  refetch,
}: CashLedgerTableProps) {
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
      {/* Scrollable region — thead + tfoot sticky inside it */}
      <div
        ref={scrollContainerRef}
        onScroll={onScroll}
        className="flex-1 overflow-auto"
      >
        <table
          className="w-full text-left text-sm border-collapse"
          style={{ minWidth: "600px" }}
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
              <th className="px-4 py-3 w-10 text-center">D/C</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                Debit (Rs.)
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">
                Credit (Rs.)
              </th>
              <th className="px-4 py-3">Narration</th>
            </tr>
          </thead>

          <tbody>
            {initialLoading ? (
              Array.from({ length: 40 }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b"
                  style={{
                    borderColor: "#f0ede7",
                    backgroundColor: i % 2 === 0 ? "#fff" : "#faf9f6",
                  }}
                >
                  {Array.from({ length: COL_SPAN }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : !isError && entries.length === 0 ? (
              <tr>
                <td colSpan={COL_SPAN}>
                  <EmptyCashLedgerState onCreateEntry={onCreateEntry} />
                </td>
              </tr>
            ) : (
              entries.map((entry, idx) => (
                <CashLedgerEntryRow
                  key={entry.id}
                  entry={entry}
                  serialNo={idx + 1}
                  striped={idx % 2 !== 0}
                />
              ))
            )}
          </tbody>

          {isError ? (
            <tbody>
              <tr className="h-full">
                <td colSpan={COL_SPAN} className="h-full">
                  <div
                    style={{ height: "calc(100vh - 460px)" }}
                    className="flex flex-col items-center justify-center gap-4"
                  >
                    <AlertCircle size={32} style={{ color: "#dc2626" }} />
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--brand-ink)" }}
                    >
                      Failed to load ledger data. Please try again.
                    </p>
                    <Button
                      variant="outline"
                      onClick={refetch}
                      className="gap-2"
                    >
                      <RefreshCw size={14} />
                      Retry
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            !initialLoading &&
            entries.length > 0 && (
              <tfoot style={{ position: "sticky", bottom: 0, zIndex: 1 }}>
                {isFetchingNextPage && (
                  <tr style={{ backgroundColor: "#faf9f6" }}>
                    <td colSpan={COL_SPAN} className="px-4 py-2 text-center">
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
                  style={{
                    backgroundColor: "#f5f3ef",
                    borderColor: "#e5e0d6",
                  }}
                >
                  <td
                    colSpan={3}
                    className="px-4 py-2 text-right uppercase tracking-wide"
                    style={{ color: "#6b7280" }}
                  >
                    Loaded Total ({entries.length} of {totalCount})
                  </td>
                  <td
                    className="px-4 py-2 text-right font-mono"
                    style={{ color: "#dc2626" }}
                  >
                    {fmt(totalDebit)}
                  </td>
                  <td
                    className="px-4 py-2 text-right font-mono"
                    style={{ color: "#16a34a" }}
                  >
                    {fmt(totalCredit)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )
          )}
        </table>
      </div>
    </div>
  );
}
