"use client";

import { useCallback, useRef, useMemo, Suspense, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FilterState, LedgerFilters } from "./LedgerFilters";
import { LedgerPageHeader } from "./LedgerPageHeader";
import { LedgerSummaryCards } from "./LedgerSummaryCard";
import { LedgerTable } from "./LedgerTable";
import { CreateLedgerEntryForm } from "./CreateLedgerEntryForm";
import { Toaster } from "sonner";
import { getBankLedger } from "@/lib/api/bank_ledger";
import { BankLedgerData, CreateBankLedgerEntryInput } from "@repo/types";
import { useBankLedgerSummary } from "@/hooks/queries/admin/banks/bank_ledger/useBankLedgerSummary";
import { useBankAccountsDropdown } from "@/hooks/queries/admin/banks/bank_ledger/useBankAccountsDropdown";
import { useCreateBankLedgerEntry } from "@/hooks/mutations/admin/bank_ledger/useCreateBankLedgerEntry";
import { queryKeys } from "@/lib/query-keys";

const PARAM_BANK = "bankId";
const PARAM_ACCOUNT = "accountId";

function LedgerPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const bankId = searchParams.get(PARAM_BANK) ?? "all";
  const accountId = searchParams.get(PARAM_ACCOUNT) ?? "all";

  const filters: FilterState = { bankId, accountId };

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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

  const accountsQuery = useBankAccountsDropdown();

  const summaryQuery = useBankLedgerSummary({
    accountID: accountId,
    bankID: bankId,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isEntriesLoading,
    isError,
    refetch,
  } = useInfiniteQuery<BankLedgerData>({
    queryKey: queryKeys.bankLedger.list(bankId, accountId),
    queryFn: ({ pageParam }) =>
      getBankLedger({
        bankID: bankId,
        accountID: accountId,
        page: (pageParam as number) ?? 0,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const entries = useMemo(
    () => data?.pages.flatMap((p) => p.bankLedger) ?? [],
    [data],
  );
  const totalCount = data?.pages[0]?.meta.total ?? 0;
  const hasReachedEnd = !hasNextPage && !isEntriesLoading;

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

  const createBankLedgerEntry = useCreateBankLedgerEntry();

  const handleCreateBankLedger = async (
    data: CreateBankLedgerEntryInput & { accountID: string },
  ) => {
    await createBankLedgerEntry.mutateAsync(data);
  };

  const accounts = accountsQuery.data ?? [];
  const summary = summaryQuery.data ?? null;
  const summaryLoading = summaryQuery.isPending;

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
          isError={isError}
          refetch={refetch}
        />
      </div>

      <CreateLedgerEntryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        accounts={accounts}
        createLedgerEntry={(data) => handleCreateBankLedger(data)}
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
