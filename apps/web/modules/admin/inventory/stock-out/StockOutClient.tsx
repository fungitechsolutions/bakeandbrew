"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { InventoryPageHeader } from "../shared/InventoryPageHeader";
import { StockOutTable } from "./StockOutTable";
import { StockOutDialog } from "./StockOutDialog";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { useDebounce } from "@/modules/admin/analytics/hooks/useDebounce";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { Label } from "@/components/ui/label";
import { inputCls } from "../../students/detail/shared/utils";
import { cn } from "@/lib/utils";
import {
  CreateStockOutResponse,
  DeleteStockOutResponse,
  EditStockOutResponse,
  GetProductResponse,
  ListStockOutResponse,
} from "@repo/types";
import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StockOutLoading from "./StockOutLoading";
import StockOutError from "./StockOutError";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StockOut = Extract<
  ListStockOutResponse,
  { success: true }
>["data"][number];
type StockOutFormData = Omit<
  StockOut,
  "id" | "createdAt" | "productName" | "productUnit" | "updatedAt" | "qty"
> & {
  quantity: number;
};

export function StockOutClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [dateFrom, setDateFrom] = useState(searchParams.get("from") ?? "");
  const [dateTo, setDateTo] = useState(searchParams.get("to") ?? "");
  const [pendingFrom, setPendingFrom] = useState(
    searchParams.get("from") ?? "",
  );
  const [pendingTo, setPendingTo] = useState(searchParams.get("to") ?? "");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | "">(
    (searchParams.get("sort") as "asc" | "desc") ?? "",
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<StockOut | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StockOut | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(search, 400);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  useEffect(() => {
    updateParams({ search: debouncedSearch.trim() });
  }, [debouncedSearch]);

  const handleSearchChange = (value: string) => {
    if (value.startsWith(" ")) return;
    setSearch(value);
    setCurrentPage(1);
  };

  const handleApplyDates = () => {
    setDateFrom(pendingFrom);
    setDateTo(pendingTo);
    updateParams({ from: pendingFrom, to: pendingTo });
    setCurrentPage(1);
  };

  const handlePriceSort = (value: "asc" | "desc" | "") => {
    setPriceSort(value);
    updateParams({ sort: value });
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearch("");
    setPendingFrom("");
    setPendingTo("");
    setDateFrom("");
    setDateTo("");
    setPriceSort("");
    setCurrentPage(1);
    router.push(pathname);
  };

  const hasActiveFilters = !!search || !!dateFrom || !!dateTo || !!priceSort;
  const hasPendingDateChange = pendingFrom !== dateFrom || pendingTo !== dateTo;

  const { data, isPending, isError, refetch, error } = useQuery({
    queryKey: [
      "admin-inventory-stock-out",
      currentPage,
      debouncedSearch.trim(),
      dateFrom,
      dateTo,
      priceSort,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      const trimmedSearch = debouncedSearch.trim();
      if (trimmedSearch) params.set("search", trimmedSearch);
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
      if (priceSort) params.set("sort_by_rate", priceSort);
      const res = await api.get<ListStockOutResponse>(
        `/admin/inventory/stock/out?${params.toString()}`,
      );
      return res.data;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const { data: productsData, isPending: productsPending } = useQuery({
    queryKey: ["admin-inventory-stock-out-products"],
    queryFn: async () => {
      const res = await api.get<GetProductResponse>(
        `/admin/inventory/products`,
      );
      return res.data;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const createStockOut = useMutation({
    mutationFn: async (data: StockOutFormData) => {
      try {
        const res = await api.post<CreateStockOutResponse>(
          `/admin/inventory/stock/out`,
          data,
        );
        if (!res.data.success) throw res.data;
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) throw err.response?.data;
        throw err;
      }
    },
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({
        queryKey: ["admin-inventory-stock-out", currentPage],
      });
    },
  });

  const updateStockOut = useMutation({
    mutationFn: async ({ id, ...data }: StockOutFormData & { id: string }) => {
      try {
        const res = await api.put<EditStockOutResponse>(
          `/admin/inventory/stock/out/${id}`,
          data,
        );
        if (!res.data.success) throw res.data;
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) throw err.response?.data;
        throw err;
      }
    },
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({
        queryKey: ["admin-inventory-stock-out", currentPage],
      });
    },
  });

  const deleteStockOut = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<DeleteStockOutResponse>(
        `/admin/inventory/stock/out/${id}`,
      );
      if (!res.data.success) throw res.data;
      return res.data;
    },
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({
        queryKey: ["admin-inventory-stock-out", currentPage],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (data: StockOutFormData) => {
    if (editTarget) {
      await updateStockOut.mutateAsync({ id: editTarget.id, ...data });
      setEditTarget(null);
    } else {
      await createStockOut.mutateAsync(data);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteStockOut.mutate(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setTimeout(() => setEditTarget(null), 200);
  };

  return (
    <div className="space-y-4 min-h-screen bg-(--brand-cream) px-4 py-8 sm:px-6 lg:px-8 mx-auto max-w-8xl">
      <InventoryPageHeader
        title="Stock Out"
        description="Record outgoing inventory and sales."
        action={
          <Button
            onClick={() => {
              setEditTarget(null);
              setDialogOpen(true);
            }}
            className="bg-[var(--brand-green)] hover:bg-[var(--brand-green-2)] text-white font-[var(--font-dm-sans)] gap-2"
          >
            <Plus size={16} /> Add Stock Out
          </Button>
        }
      />

      {/* ── Filters ── */}
      <div
        className="rounded-lg border border-stone-200 bg-white px-4 py-4 sm:px-5"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
            <SlidersHorizontal size={13} />
            Filters
          </span>
          <div className="flex items-center gap-3">
            {data?.success && hasActiveFilters && (
              <p className="text-sm text-stone-500">
                {data.meta.total} of {data.meta.total} record
                {data.meta.total !== 1 ? "s" : ""}
              </p>
            )}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7 gap-1 px-2 text-xs text-stone-500 hover:text-stone-800"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-12">
          {/* Search */}
          <div className="flex min-w-0 flex-col gap-1 md:col-span-4">
            <Label className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Search
            </Label>
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Product name or bill no…"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-9 w-full pl-9"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex min-w-0 flex-col gap-1 md:col-span-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Sort
            </Label>
            <Select
              value={priceSort}
              onValueChange={(v) => handlePriceSort(v as "asc" | "desc" | "")}
            >
              <SelectTrigger className="h-9 w-full rounded-none py-4">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Default</SelectItem>
                <SelectItem value="asc">Rate: Low → High</SelectItem>
                <SelectItem value="desc">Rate: High → Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date range */}
          <div className="flex min-w-0 flex-col gap-1 md:col-span-6">
            <Label className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Date range (BS)
            </Label>
            <div className="flex w-full flex-wrap items-center gap-2">
              <div className="relative min-w-[7.5rem] flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#2d4a3e]/40">
                  <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <NepaliDatePicker
                  inputClassName={cn(
                    inputCls,
                    "h-9 w-full pl-9 rounded-none shadow-none",
                  )}
                  value={pendingFrom}
                  onChange={(v: string) => setPendingFrom(v)}
                  options={{ calenderLocale: "en", valueLocale: "en" }}
                />
              </div>

              <span className="shrink-0 text-sm text-stone-500">to</span>

              <div className="relative min-w-[7.5rem] flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#2d4a3e]/40">
                  <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <NepaliDatePicker
                  inputClassName={cn(
                    inputCls,
                    "h-9 w-full pl-9 rounded-none shadow-none",
                  )}
                  value={pendingTo}
                  onChange={(v: string) => setPendingTo(v)}
                  options={{ calenderLocale: "en", valueLocale: "en" }}
                />
              </div>

              {hasPendingDateChange && (
                <Button
                  size="sm"
                  onClick={handleApplyDates}
                  className="shrink-0 bg-(--brand-green) text-white hover:bg-(--brand-green-2)"
                >
                  Apply dates
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Table area ── */}
      {isPending || productsPending ? (
        <StockOutLoading />
      ) : isError || !data || !productsData ? (
        <StockOutError
          error={{ message: error?.message ?? "Failed to load data" }}
          reset={refetch}
        />
      ) : !data.success || !productsData.success ? (
        <StockOutError
          error={{
            message: !data.success
              ? data.message
              : !productsData.success
                ? productsData.message
                : "Failed to process request",
          }}
          reset={refetch}
        />
      ) : (
        <StockOutTable
          data={data.data}
          limit={data.meta.limit}
          total={data.meta.total}
          currentPage={currentPage}
          totalPages={data.meta.totalPages}
          onPageChange={setCurrentPage}
          onEdit={(item) => {
            setEditTarget(item);
            setDialogOpen(true);
          }}
          onDelete={setDeleteTarget}
        />
      )}

      <StockOutDialog
        open={dialogOpen}
        products={productsData?.success ? productsData.data : []}
        stockOut={data?.success ? data.data : []}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={editTarget}
      />

      {deleteTarget && (
        <ConfirmDialog
          open
          itemName={`${deleteTarget.productName} on ${deleteTarget.date}`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
