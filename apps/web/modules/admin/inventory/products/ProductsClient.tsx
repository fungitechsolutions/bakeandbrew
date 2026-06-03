"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { useDebounce } from "@/modules/admin/analytics/hooks/useDebounce";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { Label } from "@/components/ui/label";
import { inputCls } from "../../students/detail/shared/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { InventoryPageHeader } from "../shared/InventoryPageHeader";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { Pagination } from "../shared/Pagination";
import { ProductsTable } from "./ProductsTable";
import { ProductDialog } from "./ProductDialog";

import { EmptyState } from "../shared/EmptyState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateProductInput,
  CreateProductResponse,
  DeleteProductResponse,
  GetProductResponse,
  UpdateProductResponse,
} from "@repo/types";
import ProductsLoading from "./ProductsLoading";
import { ProductsError } from "./ProductsError";
import api from "@/lib/axios";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BSToAD } from "bikram-sambat-js";

type Product = Extract<GetProductResponse, { success: true }>["data"][number];

export function ProductsClient() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);

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

  const { data, isPending, isError, refetch, error } = useQuery({
    queryKey: [
      "admin-inventory-products",
      page,
      debouncedSearch.trim(),
      dateFrom,
      dateTo,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      const trimmedSearch = debouncedSearch.trim();
      if (trimmedSearch) params.set("name", trimmedSearch);
      if (dateFrom) params.set("from", BSToAD(dateFrom));
      if (dateTo) params.set("to", BSToAD(dateTo));
      const res = await api.get<GetProductResponse>(
        `/admin/inventory/products?${params.toString()}`,
      );
      return res.data;
    },
    staleTime: 10 * 1000 * 60,
    gcTime: 20 * 60 * 1000,
  });
  const createProduct = useMutation({
    mutationFn: async (data: CreateProductInput) => {
      try {
        const res = await api.post<CreateProductResponse>(
          "/admin/inventory/products",
          data,
        );
        if (!res.data.success) throw res.data;
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) throw err.response?.data;
        throw err;
      }
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: ["admin-inventory-products", page],
      });
      const previousProducts = queryClient.getQueryData<GetProductResponse>([
        "admin-inventory-products",
        page,
      ]);
      const optimisticProduct = {
        id: crypto.randomUUID(),
        name: data.name,
        unit: data.unit,
        createdAt: new Date(),
      };

      queryClient.setQueryData<GetProductResponse>(
        ["admin-inventory-products", page],
        (old) => {
          if (!old || !old.success) return old;
          return {
            ...old,
            data: [...old.data, optimisticProduct],
          };
        },
      );

      return { previousProducts, optimisticProduct };
    },
    onSuccess: (result, _, context) => {
      toast.success(result.message);
      queryClient.setQueryData<GetProductResponse>(
        ["admin-inventory-products", page],
        (old) => {
          if (!old || !old.success) return old;
          return {
            ...old,
            data: old.data.map((p) =>
              p.id === context.optimisticProduct.id ? { ...result.data } : p,
            ),
          };
        },
      );
    },
    onError: (error, _, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(
          ["admin-inventory-products", page],
          context.previousProducts,
        );
      }
      toast.error(error.message ?? "Something went wrong");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inventory-products"] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: CreateProductInput & { id: string }) => {
      try {
        const res = await api.put<UpdateProductResponse>(
          `/admin/inventory/products/${id}`,
          data,
        );
        if (!res.data.success) throw res.data;
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) throw err.response?.data;
        throw err;
      }
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: ["admin-inventory-products", page],
      });
      const previousProducts = queryClient.getQueryData<GetProductResponse>([
        "admin-inventory-products",
        page,
      ]);
      const optimisticProduct = {
        id: data.id,
        name: data.name,
        unit: data.unit,
        createdAt: editingProduct?.createdAt ?? new Date(),
      };

      queryClient.setQueryData<GetProductResponse>(
        ["admin-inventory-products", page],
        (old) => {
          if (!old || !old.success) return old;
          return {
            ...old,
            data: old.data.map((p) =>
              p.id === optimisticProduct.id ? { ...optimisticProduct } : p,
            ),
          };
        },
      );

      return { previousProducts };
    },
    onSuccess: (result) => {
      toast.success(result.message);
    },
    onError: (error, _, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(
          ["admin-inventory-products", page],
          context.previousProducts,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inventory-products"] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<DeleteProductResponse>(
        `/admin/inventory/products/${id}`,
      );
      if (!res.data.success) throw res.data;
      return res.data;
    },
    onMutate: async (id: string) => {
      setDeletingProduct(null);
      await queryClient.cancelQueries({
        queryKey: ["admin-inventory-products", page],
      });
      const previousProducts = queryClient.getQueryData([
        "admin-inventory-products",
      ]);

      queryClient.setQueryData<GetProductResponse>(
        ["admin-inventory-products", page],
        (old) => {
          if (!old || !old.success) return old;
          return {
            ...old,
            data: old.data.filter((p) => p.id !== id),
          };
        },
      );
      return { previousProducts };
    },
    onSuccess: (result) => {
      toast.success(result.message);
      setIsDeleting(false);
    },
    onError: (__, _, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(
          ["admin-inventory-products", page],
          context.previousProducts,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inventory-products"] });
    },
  });

  const handleCreate = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleSubmit = async (values: CreateProductInput) => {
    if (editingProduct) {
      await updateProduct.mutateAsync({ ...values, id: editingProduct.id });
    } else {
      await createProduct.mutateAsync(values);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    await deleteProduct.mutate(deletingProduct.id);
  };

  const handleSearchChange = (value: string) => {
    if (value.startsWith(" ")) return;
    setSearch(value);
    setPage(1);
  };

  const handleApplyDates = () => {
    setDateFrom(pendingFrom);
    setDateTo(pendingTo);
    updateParams({ from: pendingFrom, to: pendingTo });
  };

  const handleClear = () => {
    setSearch("");
    setPendingFrom("");
    setPendingTo("");
    setDateFrom("");
    setDateTo("");
    router.push(pathname);
  };

  const hasActiveFilters = !!search || !!dateFrom || !!dateTo;
  const hasPendingDateChange = pendingFrom !== dateFrom || pendingTo !== dateTo;
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-8xl mx-auto space-y-4">
      <InventoryPageHeader
        title="Products"
        description="Manage your product catalogue — add, edit, or remove products."
        action={
          <Button
            onClick={handleCreate}
            className="bg-(--brand-green) hover:bg-(--brand-green-2) text-white gap-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            <Plus className="h-4 w-4" />
            Add Product
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
                {data.meta.total} of {data.meta.total} product
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
          {/* Name search */}
          <div className="flex min-w-0 flex-col gap-1 md:col-span-6">
            <Label className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Name
            </Label>
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by product name…"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-9 w-full pl-9"
              />
            </div>
          </div>

          {/* Date range */}
          <div className="flex min-w-0 flex-col gap-1 md:col-span-6">
            <Label className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Created date range
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
      {isPending ? (
        <ProductsLoading />
      ) : isError || !data ? (
        <ProductsError error={error} reset={refetch} />
      ) : !data.success ? (
        <ProductsError error={data} reset={refetch} />
      ) : data.data.length === 0 && !hasActiveFilters ? (
        <EmptyState message="No products yet. Create your first product to get started." />
      ) : data.data.length === 0 && hasActiveFilters ? (
        <EmptyState message="No products match your current filters." />
      ) : (
        <>
          <ProductsTable
            products={data.data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination
            page={page}
            meta={{
              total: data.meta.total,
              totalPages: data.meta.totalPages,
              limit: data.meta.limit,
            }}
            onPageChange={setPage}
          />
        </>
      )}

      <ProductDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
      />

      <ConfirmDialog
        open={!!deletingProduct}
        itemName={deletingProduct?.name ?? ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingProduct(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
