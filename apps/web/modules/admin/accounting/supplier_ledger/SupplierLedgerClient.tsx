"use client";

import { useCallback, useRef, useMemo, Suspense, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Toaster } from "sonner";
import { AxiosError } from "axios";
import { APIError } from "@repo/types";

import { SupplierLedgerFiltersBar } from "./SupplierLedgerFilterBar";
import { SupplierLedgerTable } from "./SupplierLedgerTable";
import { SupplierLedgerSummaryCards } from "./SupplierLedgerSummaryCard";
import { SupplierLedgerSkeleton } from "./SupplierLedgerSkeleton";
import { SupplierLedgerError } from "./SupplierLedgerError";
import { SupplierLedgerEmpty } from "./SupplierLedgerEmpty";
import { SupplierLedgerFilters } from "./types";
import { CreateSupplierLedgerEntryInput } from "@repo/types";

import { CreateSupplierLedgerEntryForm } from "./CreateSupplierLedgerEntryForm";
import { SupplierLedgerData } from "@repo/types";
import { queryKeys } from "@/lib/query-keys";
import { getSupplierLedger } from "@/lib/api/supplier_ledger";
import { useSupplierLedgerSummary } from "@/hooks/queries/admin/suppliers/ledger/useSupplierLedgerSummary";
import { useSuppliers } from "@/hooks/queries/admin/suppliers/useSuppliers";
import { useCreateSupplierLedgerEntry } from "@/hooks/queries/admin/suppliers/ledger/useCreateSupplierLedgerEntry";

const PARAM_SUPPLIER_NAME = "supplier_name";
const PARAM_FROM_BS = "from_bs";
const PARAM_TO_BS = "to_bs";

function SupplierLedgerInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const [createOpen, setCreateOpen] = useState(false);

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

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const ledgerSummaryQuery = useSupplierLedgerSummary({
    supplierID: supplierId,
    fromDate,
    toDate,
  });

  const suppliersQuery = useSuppliers();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<SupplierLedgerData, AxiosError<APIError>>({
    queryKey: queryKeys.suppliers.ledger.list(
      supplierId,
      page,
      fromDate,
      toDate,
    ),
    queryFn: ({ pageParam = 1 }) =>
      getSupplierLedger(pageParam as number, {
        supplierID: supplierId,
        fromDate,
        toDate,
      }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
  });
  const entries = useMemo(
    () => data?.pages.flatMap((p) => p.supplierLedger) ?? [],
    [data],
  );
  const totalCount = data?.pages[0]?.meta.total ?? 0;
  const hasReachedEnd = !hasNextPage && !isLoading;

  const createSupplierLedgerEntry = useCreateSupplierLedgerEntry();
  const handleScroll = useCallback((_e: React.UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage) return;
    const el = _e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 200)
      void fetchNextPage();
  }, []);

  const handleCreate = async (
    data: CreateSupplierLedgerEntryInput & { supplierID: string },
  ) => {
    await createSupplierLedgerEntry.mutateAsync({
      ...data,
    });
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
        summary={ledgerSummaryQuery.data ?? null}
        loading={ledgerSummaryQuery.isPending}
      />

      {/* Filters */}
      <SupplierLedgerFiltersBar
        suppliers={suppliersQuery.data?.suppliers ?? []}
        filters={filters}
        onChange={handleFilterChange}
      />

      {/* Content */}
      <div className="min-h-80">
        {isLoading && <SupplierLedgerSkeleton />}

        {isError && (
          <SupplierLedgerError
            message={
              (error as AxiosError<APIError>)?.response?.data.message ??
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
        loading={createSupplierLedgerEntry.isPending}
        suppliers={suppliersQuery.data?.suppliers ?? []}
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
