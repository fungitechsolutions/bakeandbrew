"use client";

import { useCallback, useRef, useMemo, Suspense, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { CashLedgerTable } from "./CashLedgerTable";
import { CashLedgerSummaryCards } from "./CashLedgerSummaryCards";
import { CreateCashLedgerEntryForm } from "./CreateCashLedgerEntryForm";
import { LedgerPageHeader } from "../bank-ledger/LedgerPageHeader";
import { CashLedgerData, CreateCashLedgerEntryInput } from "@repo/types";
// TODO: replace with actual API + hooks
// import { getCashLedger } from "@/lib/api/cash_ledger";
// import { useCashLedgerSummary } from "@/hooks/queries/admin/cash/useCashLedgerSummary";
// import { useCreateCashLedgerEntry } from "@/hooks/mutations/admin/cash/useCreateCashLedgerEntry";
// import { queryKeys } from "@/lib/query-keys";
import { mockCashLedgerEntries, mockCashLedgerSummary } from "./mock-data";
import { CashLedgerFilters } from "./CashLedgerFilter";

// ── URL search param keys ──────────────────────────────────────────────────────
const PARAM_FROM_BS = "from_bs";
const PARAM_TO_BS = "to_bs";

function CashLedgerPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [formOpen, setFormOpen] = useState(false);

  // ── Filter state ─────────────────────────────────────────────────────────────
  // AD dates live in local state (sent to backend); BS dates live in URL (display)
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  const fromBsDate = searchParams.get(PARAM_FROM_BS);
  const toBsDate = searchParams.get(PARAM_TO_BS);

  const filters: CashLedgerFilters = {
    fromDate,
    toDate,
    fromBsDate,
    toBsDate,
  };

  // ── URL sync ──────────────────────────────────────────────────────────────────
  const setSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (!value) params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const handleFilterChange = useCallback(
    (next: CashLedgerFilters) => {
      setFromDate(next.fromDate);
      setToDate(next.toDate);
      setSearchParams({
        [PARAM_FROM_BS]: next.fromBsDate,
        [PARAM_TO_BS]: next.toBsDate,
      });
    },
    [setSearchParams],
  );

  // ── Scroll / infinite query ───────────────────────────────────────────────────
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // TODO: replace mock with real infinite query ↓
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
  //   useInfiniteQuery<CashLedgerData>({
  //     queryKey: queryKeys.cashLedger.list(fromDate, toDate),
  //     queryFn: ({ pageParam = 1 }) =>
  //       getCashLedger({ page: pageParam as number, fromDate, toDate }),
  //     initialPageParam: 1,
  //     getNextPageParam: (lastPage) => {
  //       const { page, totalPages } = lastPage.meta;
  //       return page < totalPages ? page + 1 : undefined;
  //     },
  //   });
  // const entries    = useMemo(() => data?.pages.flatMap((p) => p.cashLedger) ?? [], [data]);
  // const totalCount = data?.pages[0]?.meta.total ?? 0;
  // const hasReachedEnd = !hasNextPage && !isLoading;

  // ── MOCK (replace with real query above) ─────────────────────────────────────
  const entries = mockCashLedgerEntries;
  const totalCount = mockCashLedgerEntries.length;
  const isLoading = false;
  const isError = false;
  const hasReachedEnd = true;
  const isFetchingNextPage = false;
  const refetch = () => {};
  // ─────────────────────────────────────────────────────────────────────────────

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    // TODO: uncomment when using real infinite query
    // if (!hasNextPage || isFetchingNextPage) return;
    // const el = e.currentTarget;
    // if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) {
    //   void fetchNextPage();
    // }
  }, []);

  // TODO: replace with real mutation ↓
  // const createCashLedgerEntry = useCreateCashLedgerEntry();
  const handleCreateEntry = async (data: CreateCashLedgerEntryInput) => {
    // await createCashLedgerEntry.mutateAsync(data);
    console.log("Create cash ledger entry:", data);
  };

  // TODO: replace with real summary query ↓
  // const summaryQuery = useCashLedgerSummary({ fromDate, toDate });
  // const summary = summaryQuery.data ?? null;
  // const summaryLoading = summaryQuery.isPending;
  const summary = mockCashLedgerSummary;
  const summaryLoading = false;

  return (
    <div
      className="min-h-screen px-4 py-8 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--brand-cream)" }}
    >
      <div className="mx-auto max-w-8xl space-y-6">
        <LedgerPageHeader
          title="Cash Ledger"
          subtitle="All cash transactions recorded across the academy"
          onCreateEntry={() => setFormOpen(true)}
        />

        <CashLedgerSummaryCards
          summary={summaryLoading ? null : summary}
          loading={summaryLoading}
        />

        <CashLedgerFilters filters={filters} onChange={handleFilterChange} />

        <CashLedgerTable
          entries={entries}
          initialLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasReachedEnd={hasReachedEnd}
          totalCount={totalCount}
          scrollContainerRef={scrollContainerRef}
          onScroll={handleScroll}
          onCreateEntry={() => setFormOpen(true)}
          isError={isError}
          refetch={refetch}
        />
      </div>

      <CreateCashLedgerEntryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        createLedgerEntry={handleCreateEntry}
      />

      <Toaster />
    </div>
  );
}

export default function CashLedgerPage() {
  return (
    <Suspense>
      <CashLedgerPageInner />
    </Suspense>
  );
}
