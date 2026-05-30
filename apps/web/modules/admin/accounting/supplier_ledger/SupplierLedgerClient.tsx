"use client";

import { useCallback, useRef, useMemo, Suspense, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Toaster } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/axios";

import { SupplierLedgerFiltersBar } from "./SupplierLedgerFilterBar";
import { SupplierLedgerTable } from "./SupplierLedgerTable";
import { SupplierLedgerSummaryCards } from "./SupplierLedgerSummaryCard";
import { SupplierLedgerSkeleton } from "./SupplierLedgerSkeleton";
import { SupplierLedgerError } from "./SupplierLedgerError";
import { SupplierLedgerEmpty } from "./SupplierLedgerEmpty";
import { SupplierLedgerFilters, CreateSupplierLedgerEntryInput } from "./types";

// TODO: replace with real API + hooks
// import { getSupplierLedger }         from "@/lib/api/supplier_ledger";
// import { useSupplierLedgerSummary }  from "@/hooks/queries/admin/suppliers/useSupplierLedgerSummary";
// import { useSuppliersDropdown }      from "@/hooks/queries/admin/suppliers/useSuppliersDropdown";
// import { useCreateSupplierLedgerEntry } from "@/hooks/mutations/admin/suppliers/useCreateSupplierLedgerEntry";
// import { queryKeys } from "@/lib/query-keys";

import {
  mockSupplierLedgerEntries,
  mockSupplierLedgerSummary,
  mockSuppliersDropdown,
} from "./mock-data";
import { CreateSupplierLedgerEntryForm } from "./CreateSupplierLedgerEntryForm";

const PARAM_SUPPLIER_NAME = "supplier_name";
const PARAM_FROM_BS = "from_bs";
const PARAM_TO_BS = "to_bs";

function SupplierLedgerInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);

  // ── Filter state ──────────────────────────────────────────────────────────────
  const [supplierId, setSupplierId] = useState("all");
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  const supplierName = searchParams.get(PARAM_SUPPLIER_NAME) ?? "all";
  const fromBsDate = searchParams.get(PARAM_FROM_BS);
  const toBsDate = searchParams.get(PARAM_TO_BS);

  const filters: SupplierLedgerFilters = {
    supplierId,
    supplierName,
    fromDate,
    toDate,
    fromBsDate,
    toBsDate,
  };
  const showSupplierColumn = supplierId === "all";

  const setSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === "all") params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const handleFilterChange = useCallback(
    (next: SupplierLedgerFilters) => {
      setSupplierId(next.supplierId);
      setFromDate(next.fromDate);
      setToDate(next.toDate);
      setSearchParams({
        [PARAM_SUPPLIER_NAME]: next.supplierName,
        [PARAM_FROM_BS]: next.fromBsDate,
        [PARAM_TO_BS]: next.toBsDate,
      });
    },
    [setSearchParams],
  );

  // ── Infinite query ────────────────────────────────────────────────────────────
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // TODO: swap mock for real ↓
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error, refetch } =
  //   useInfiniteQuery<SupplierLedgerData, AxiosError<ApiError>>({
  //     queryKey: queryKeys.supplierLedger.list(supplierId, fromDate, toDate),
  //     queryFn: ({ pageParam = 1 }) =>
  //       getSupplierLedger({ page: pageParam as number,
  //         supplierID: supplierId !== "all" ? supplierId : undefined,
  //         fromDate: fromDate ?? undefined, toDate: toDate ?? undefined }),
  //     initialPageParam: 1,
  //     getNextPageParam: (last) => last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
  //   });
  // const entries    = useMemo(() => data?.pages.flatMap((p) => p.supplierLedger) ?? [], [data]);
  // const totalCount = data?.pages[0]?.meta.total ?? 0;
  // const hasReachedEnd = !hasNextPage && !isLoading;

  // ── MOCK ─────────────────────────────────────────────────────────────────────
  const allEntries = mockSupplierLedgerEntries;
  const entries =
    supplierId === "all"
      ? allEntries
      : allEntries.filter((e) => e.supplierId === supplierId);
  const totalCount = entries.length;
  const isLoading = false;
  const isError = false;
  const error = null as AxiosError<ApiError> | null;
  const hasReachedEnd = true;
  const isFetchingNextPage = false;
  const refetch = () => {};
  const suppliers = mockSuppliersDropdown;
  const summary = mockSupplierLedgerSummary;
  const summaryLoading = false;
  // ─────────────────────────────────────────────────────────────────────────────

  const handleScroll = useCallback((_e: React.UIEvent<HTMLDivElement>) => {
    // TODO: uncomment for real infinite scroll
    // if (!hasNextPage || isFetchingNextPage) return;
    // const el = _e.currentTarget;
    // if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) void fetchNextPage();
  }, []);

  const handleCreate = async (data: CreateSupplierLedgerEntryInput) => {
    console.log("Create supplier ledger entry:", data);
    // await createSupplierLedgerEntry.mutateAsync(data);
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-[family-name:var(--font-lora)] text-2xl font-bold text-[#1a1a1a] leading-tight mb-1">
            Supplier Ledger
          </h1>
          <p className="text-sm text-stone-500 font-[family-name:var(--font-dm-sans)]">
            Track purchases and payments across all suppliers.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#2f4e40] text-[#fbfaf7] text-sm font-medium font-[family-name:var(--font-dm-sans)] hover:bg-[#3a5a49] hover:shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
          New Entry
        </button>
      </div>

      {/* Summary cards — always show (skeleton while loading) */}
      <SupplierLedgerSummaryCards
        summary={summaryLoading ? null : summary}
        loading={summaryLoading}
      />

      {/* Filters */}
      <SupplierLedgerFiltersBar
        suppliers={suppliers}
        filters={filters}
        onChange={handleFilterChange}
      />

      {/* Content */}
      <div className="min-h-80">
        {isLoading && <SupplierLedgerSkeleton />}

        {isError && (
          <SupplierLedgerError
            message={
              (error as AxiosError<ApiError>)?.response?.data.message ??
              "Something went wrong"
            }
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && entries.length === 0 && (
          <SupplierLedgerEmpty onCreateEntry={() => setCreateOpen(true)} />
        )}

        {!isLoading && !isError && entries.length > 0 && (
          <SupplierLedgerTable
            entries={entries}
            isFetchingNextPage={isFetchingNextPage}
            hasReachedEnd={hasReachedEnd}
            totalCount={totalCount}
            scrollContainerRef={scrollContainerRef}
            onScroll={handleScroll}
            showSupplierColumn={showSupplierColumn}
          />
        )}
      </div>

      <CreateSupplierLedgerEntryForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        loading={false} // TODO: createSupplierLedgerEntry.isPending
        suppliers={suppliers}
        defaultSupplierId={supplierId !== "all" ? supplierId : undefined}
        createLedgerEntry={handleCreate}
      />

      <Toaster />
    </div>
  );
}

export default function SupplierLedgerClient() {
  return (
    <Suspense>
      <SupplierLedgerInner />
    </Suspense>
  );
}
