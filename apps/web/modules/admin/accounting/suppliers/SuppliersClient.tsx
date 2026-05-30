"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { SuppliersSkeleton } from "./SuppliersSkeleton";
import { SuppliersError } from "./SuppliersError";
import { SuppliersEmpty } from "./SuppliersEmpty";
import { SuppliersTable } from "./SuppliersTable";
import { SupplierEditDialog } from "./SupplierEditDialog";
import { SupplierDeleteDialog } from "./SupplierDeleteDialog";
import { SupplierCreateDialog } from "./SupplierCreateDialog";

import { useSuppliers } from "@/hooks/queries/admin/suppliers/useSuppliers";
import {
  CreateSupplierInput,
  Supplier,
  UpdateSupplierInput,
} from "@repo/types";
import { useCreateSupplier } from "@/hooks/mutations/admin/suppliers/useCreateSupplier";
import { useUpdateSupplier } from "@/hooks/mutations/admin/suppliers/useUpdateSupplier";
import { useDeleteSupplier } from "@/hooks/mutations/admin/suppliers/useDeleteSupplier";

export function SuppliersClient() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [deleteSupplier, setDeleteSupplier] = useState<Supplier | null>(null);

  const { data, isPending, isError, error, refetch } = useSuppliers(page);

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

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplierMutation = useDeleteSupplier();

  // TODO: replace with real mutations
  const handleCreate = async (data: CreateSupplierInput) => {
    await createSupplier.mutateAsync(data);
  };

  const handleEdit = async (id: string, data: UpdateSupplierInput) => {
    await updateSupplier.mutateAsync({
      supplierID: id,
      ...data,
      companyName: data.companyName!,
    });
    setEditSupplier(null);
  };

  const handleDelete = async (id: string) => {
    await deleteSupplierMutation.mutateAsync({ supplierID: id });
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
            onPageChange={(page) => setPage(page)}
          />
        )}
      </div>

      {/* Dialogs */}
      <SupplierCreateDialog
        open={createOpen}
        loading={createSupplier.isPending}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
      <SupplierEditDialog
        supplier={editSupplier}
        loading={updateSupplier.isPending}
        onClose={() => setEditSupplier(null)}
        onSave={(id, data) => handleEdit(id, data)}
      />
      <SupplierDeleteDialog
        supplier={deleteSupplier}
        loading={deleteSupplierMutation.isPending}
        onClose={() => setDeleteSupplier(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
