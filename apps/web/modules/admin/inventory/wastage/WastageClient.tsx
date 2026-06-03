"use client";

import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/modules/admin/analytics/hooks/useDebounce";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { InventoryPageHeader } from "../shared/InventoryPageHeader";
import { WastageTable } from "./WastageTable";
import { WastageDialog } from "./WastageDialog";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  CreateWastageInput,
  CreateWastageResponse,
  DeleteWastageResponse,
  EditWastageResponse,
  GetProductResponse,
  ListWastageResponse,
} from "@repo/types/inventory";
import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import WastageLoading from "./WastageLoading";
import WastageError from "./WastageError";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { cn } from "@/lib/utils";
import { inputCls } from "../../students/detail/shared/utils";

type Wastage = Extract<ListWastageResponse, { success: true }>["data"][number];
type WastageFormData = Omit<
  Wastage,
  "id" | "createdAt" | "productName" | "productUnit" | "updatedAt" | "qty"
> & {
  quantity: number;
};

export function WastageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Wastage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Wastage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );
  const debouncedSearch = useDebounce(searchInput, 400);
  const [dateFrom, setDateFrom] = useState(searchParams.get("from") ?? "");
  const [dateTo, setDateTo] = useState(searchParams.get("to") ?? "");
  const [pendingFrom, setPendingFrom] = useState(
    searchParams.get("from") ?? "",
  );
  const [pendingTo, setPendingTo] = useState(searchParams.get("to") ?? "");
  // const [createdSort, setCreatedSort] = useState<"asc" | "desc" | "">(
  //   (searchParams.get("sort") as "asc" | "desc") ?? "",
  // );
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | "">(
    (searchParams.get("sort_by_rate") as "asc" | "desc") ?? "",
  );

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

  const handleSearchInputChange = (value: string) => {
    if (value !== " " && !value.startsWith(" ")) {
      setSearchInput(value);
      setCurrentPage(1);
    }
  };

  const handleApplyDates = () => {
    setDateFrom(pendingFrom);
    setDateTo(pendingTo);
    updateParams({ from: pendingFrom, to: pendingTo });
    setCurrentPage(1);
  };

  const handlePriceSort = (value: "asc" | "desc" | "") => {
    setPriceSort(value);
    updateParams({ priceSort: value });
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchInput("");
    setPendingFrom("");
    setPendingTo("");
    setDateFrom("");
    setDateTo("");
    setPriceSort("");
    // setCreatedSort("");
    setCurrentPage(1);
    router.push(pathname);
  };

  const hasActiveFilters =
    !!debouncedSearch || !!dateFrom || !!dateTo || !!priceSort;
  const hasPendingDateChange = pendingFrom !== dateFrom || pendingTo !== dateTo;

  const { data, isPending, isError, refetch, error } = useQuery({
    queryKey: [
      "admin-inventory-wastage",
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
      if (trimmedSearch) params.set("product_name", trimmedSearch);
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
      if (priceSort) params.set("sort_by_rate", priceSort);
      const res = await api.get<ListWastageResponse>(
        `/admin/inventory/wastages?${params.toString()}`,
      );
      return res.data;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const { data: productsData, isPending: productsPending } = useQuery({
    queryKey: ["admin-inventory-products"],
    queryFn: async () => {
      const res = await api.get<GetProductResponse>(
        `/admin/inventory/products`,
      );
      return res.data;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const createWastage = useMutation({
    mutationFn: async (data: CreateWastageInput) => {
      try {
        const res = await api.post<CreateWastageResponse>(
          `/admin/inventory/wastages`,
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
        queryKey: ["admin-inventory-wastage", currentPage],
      });
    },
  });
  const updateWastage = useMutation({
    mutationFn: async ({ id, ...data }: WastageFormData & { id: string }) => {
      try {
        const res = await api.put<EditWastageResponse>(
          `/admin/inventory/wastages/${id}`,
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
        queryKey: ["admin-inventory-wastage", currentPage],
      });
    },
  });
  const deleteWastage = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<DeleteWastageResponse>(
        `/admin/inventory/wastages/${id}`,
      );
      if (!res.data.success) throw res.data;
      return res.data;
    },
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({
        queryKey: ["admin-inventory-wastage", currentPage],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (
    data: Omit<
      Wastage,
      "id" | "createdAt" | "productName" | "productUnit" | "updatedAt" | "qty"
    > & { quantity: number },
  ) => {
    if (editTarget) {
      await updateWastage.mutateAsync({ id: editTarget.id, ...data });
      setEditTarget(null);
    } else {
      await createWastage.mutateAsync(data);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteWastage.mutate(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4 min-h-screen bg-(--brand-cream) px-4 py-8 sm:px-6 lg:px-8 mx-auto">
      <InventoryPageHeader
        title="Wastage"
        description="Track damaged, expired, or lost inventory."
        action={
          <Button
            onClick={() => {
              setEditTarget(null);
              setDialogOpen(true);
            }}
            className="bg-[var(--brand-green)] hover:bg-[var(--brand-green-2)] text-white font-[var(--font-dm-sans)] gap-2"
          >
            <Plus size={16} /> Log Wastage
          </Button>
        }
      />

      {/* ── Filters ── */}
      {data?.success && (
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
              {hasActiveFilters && (
                <p className="text-sm text-stone-500">
                  {data?.meta.total ?? 0} of {data?.meta.total ?? 0} record
                  {(data?.data.length ?? 0) !== 1 ? "s" : ""}
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
            <div className="flex min-w-0 flex-col gap-1 md:col-span-4">
              <Label className="text-xs font-medium uppercase tracking-wide text-stone-400">
                Search
              </Label>
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Product name…"
                  value={searchInput}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className="h-9 w-full pl-9"
                />
              </div>
            </div>

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
      )}

      {/* ── Table area: loading / error / data ── */}
      {isPending || productsPending ? (
        <WastageLoading />
      ) : isError ? (
        <WastageError error={error} reset={refetch} />
      ) : !data.success || !productsData?.success ? (
        <WastageError
          error={{ ...data, message: "Failed to process request" }}
          reset={refetch}
        />
      ) : (
        <WastageTable
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

      <WastageDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleSubmit}
        initialData={editTarget}
        products={productsData?.success ? productsData.data : []}
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
