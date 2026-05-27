"use client";

import { useCallback, useRef, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BankAccount, LedgerSummary } from "./ledger";
import { FilterState, LedgerFilters } from "./LedgerFilters";
import {
  fetchBankAccounts,
  fetchLedgerPage,
  fetchLedgerSummary,
  type LedgerPage,
} from "./mock-data";
import { LedgerPageHeader } from "./LedgerPageHeader";
import { LedgerSummaryCards } from "./LedgerSummaryCard";
import { LedgerTable } from "./LedgerTable";
import { CreateLedgerEntryForm } from "./CreateLedgerEntryForm";
import { Toaster } from "sonner";

// ─── Search param keys ────────────────────────────────────────────────────────

const PARAM_BANK = "bankId";
const PARAM_ACCOUNT = "accountId";
const PARAM_FORM = "create";

// ─── Inner component (needs useSearchParams) ──────────────────────────────────

function LedgerPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const bankId = searchParams.get(PARAM_BANK) ?? "all";
  const accountId = searchParams.get(PARAM_ACCOUNT) ?? "all";
  const formOpen = searchParams.get(PARAM_FORM) === "1";

  const filters: FilterState = { bankId, accountId };

  // Ref for the scrollable table container — used for scroll-based infinite load
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // ── Helper: update search params ─────────────────────────────────────────

  const setSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "all" || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const handleFilterChange = useCallback(
    (next: FilterState) => {
      setSearchParams({
        [PARAM_BANK]: next.bankId,
        [PARAM_ACCOUNT]: next.accountId,
      });
    },
    [setSearchParams],
  );

  const setFormOpen = useCallback(
    (open: boolean) => {
      setSearchParams({ [PARAM_FORM]: open ? "1" : null });
    },
    [setSearchParams],
  );

  // ── Queries ──────────────────────────────────────────────────────────────

  const accountsQuery = useQuery<BankAccount[]>({
    queryKey: ["bankAccounts"],
    queryFn: fetchBankAccounts,
    staleTime: 5 * 60 * 1000,
  });

  const summaryQuery = useQuery<LedgerSummary>({
    queryKey: ["ledgerSummary", bankId, accountId],
    queryFn: () => fetchLedgerSummary({ bankId, accountId }),
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isEntriesLoading,
    isError,
    refetch,
  } = useInfiniteQuery<LedgerPage>({
    queryKey: ["ledgerEntries", bankId, accountId],
    queryFn: ({ pageParam }) =>
      fetchLedgerPage({
        bankId,
        accountId,
        page: (pageParam as number) ?? 0,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  const entries = useMemo(
    () => data?.pages.flatMap((p) => p.entries) ?? [],
    [data],
  );
  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const hasReachedEnd = !hasNextPage && !isEntriesLoading;

  // ── Scroll-based infinite load ───────────────────────────────────────────
  // Attach to the scroll container's onScroll. When the user is within
  // 200px of the bottom, fetch the next page.
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!hasNextPage || isFetchingNextPage) return;
      const el = e.currentTarget;
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      if (distanceFromBottom < 200) {
        void fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  // ── Derived state ─────────────────────────────────────────────────────────

  const accounts = accountsQuery.data ?? [];
  const summary = summaryQuery.data ?? null;
  const summaryLoading = summaryQuery.isLoading;

  // ── Error state ───────────────────────────────────────────────────────────

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle size={32} style={{ color: "#dc2626" }} />
        <p
          className="text-sm font-medium"
          style={{ color: "var(--brand-ink)" }}
        >
          Failed to load ledger data. Please try again.
        </p>
        <Button
          variant="outline"
          onClick={() => void refetch()}
          className="gap-2"
        >
          <RefreshCw size={14} />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-8 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--brand-cream)" }}
    >
      <div className="mx-auto max-w-8xl space-y-6">
        <LedgerPageHeader
          title="Bank Ledger"
          subtitle="All financial transactions across every bank account"
          onCreateEntry={() => setFormOpen(true)}
        />

        <LedgerSummaryCards
          summary={summaryLoading ? null : summary}
          loading={summaryLoading}
        />

        <LedgerFilters
          accounts={accounts}
          filters={filters}
          onChange={handleFilterChange}
        />

        <LedgerTable
          entries={entries}
          initialLoading={isEntriesLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasReachedEnd={hasReachedEnd}
          totalCount={totalCount}
          scrollContainerRef={scrollContainerRef}
          onScroll={handleScroll}
          onCreateEntry={() => setFormOpen(true)}
          showBankColumns={true}
        />
      </div>

      <CreateLedgerEntryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        accounts={accounts}
        onSuccess={() => void refetch()}
      />

      <Toaster />
    </div>
  );
}

export default function UnifiedLedgerPage() {
  return (
    <Suspense>
      <LedgerPageInner />
    </Suspense>
  );
}
