"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/axios";
import {
  CreateSupplierInput,
  Supplier,
  SuppliersData,
  UpdateSupplierInput,
} from "./types";

import { SuppliersSkeleton } from "./SuppliersSkeleton";
import { SuppliersError } from "./SuppliersError";
import { SuppliersEmpty } from "./SuppliersEmpty";
import { SuppliersTable } from "./SuppliersTable";
import { SupplierEditDialog } from "./SupplierEditDialog";
import { SupplierDeleteDialog } from "./SupplierDeleteDialog";
import { SupplierCreateDialog } from "./SupplierCreateDialog";

// TODO: import real API + hooks
// import { fetchSuppliers } from "@/lib/api/suppliers";
// import { useCreateSupplier } from "@/hooks/mutations/admin/suppliers/useCreateSupplier";
// import { useUpdateSupplier } from "@/hooks/mutations/admin/suppliers/useUpdateSupplier";
// import { useDeleteSupplier } from "@/hooks/mutations/admin/suppliers/useDeleteSupplier";

// ── MOCK (remove when real API is wired) ──────────────────────────────────────
import { mockSuppliers } from "./mock-data";

const MOCK_DATA: SuppliersData = {
  suppliers: mockSuppliers,
  meta: { page: 1, totalPages: 1, total: mockSuppliers.length, limit: 20 },
};

async function fetchSuppliersMock(_page: number): Promise<SuppliersData> {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_DATA;
}
// ─────────────────────────────────────────────────────────────────────────────

export function SuppliersClient() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [deleteSupplier, setDeleteSupplier] = useState<Supplier | null>(null);

  const { data, isPending, isError, error, refetch } = useQuery<
    SuppliersData,
    AxiosError<ApiError>
  >({
    queryKey: ["admin-suppliers", page],
    // TODO: swap mock for real: queryFn: () => fetchSuppliers(page),
    queryFn: () => fetchSuppliersMock(page),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  // Keyboard shortcut — "a" to open create dialog (same as Banks)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement)?.isContentEditable
      )
        return;
      if (e.key.toLowerCase() === "a") setCreateOpen(true);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // TODO: replace with real mutations
  const handleCreate = async (data: CreateSupplierInput) => {
    console.log("Create supplier:", data);
    // await createSupplier.mutateAsync(data);
  };

  const handleEdit = async (supplier: Supplier, data: UpdateSupplierInput) => {
    console.log("Update supplier:", supplier.id, data);
    // await updateSupplier.mutateAsync({ supplierID: id, ...data });
    setEditSupplier(null);
  };

  const handleDelete = async (id: string) => {
    console.log("Delete supplier:", id);
    // await deleteSupplier.mutateAsync({ supplierID: id });
    setDeleteSupplier(null);
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-[family-name:var(--font-lora)] text-2xl font-bold text-[#1a1a1a] leading-tight mb-1">
            Suppliers
          </h1>
          <p className="text-sm text-stone-500 font-[family-name:var(--font-dm-sans)]">
            Manage your supplier accounts and contact details.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#2f4e40] text-[#fbfaf7] text-sm font-medium font-[family-name:var(--font-dm-sans)] hover:bg-[#3a5a49] hover:shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Supplier
        </button>
      </div>

      {/* Content */}
      <div className="min-h-80">
        {isPending && <SuppliersSkeleton />}

        {isError && (
          <SuppliersError
            message={error.response?.data.message ?? "Something went wrong"}
            onRetry={refetch}
          />
        )}

        {!isPending && !isError && data && data.meta.total === 0 && (
          <SuppliersEmpty onAdd={() => setCreateOpen(true)} />
        )}

        {!isPending && !isError && data && data.meta.total > 0 && (
          <SuppliersTable
            suppliers={data.suppliers}
            meta={data.meta}
            onEdit={setEditSupplier}
            onDelete={setDeleteSupplier}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Dialogs */}
      <SupplierCreateDialog
        open={createOpen}
        loading={false} // TODO: createSupplier.isPending
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
      <SupplierEditDialog
        supplier={editSupplier}
        loading={false} // TODO: updateSupplier.isPending
        onClose={() => setEditSupplier(null)}
        onSave={(id, data) => handleEdit(editSupplier!, data)}
      />
      <SupplierDeleteDialog
        supplier={deleteSupplier}
        loading={false} // TODO: deleteSupplier.isPending
        onClose={() => setDeleteSupplier(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
