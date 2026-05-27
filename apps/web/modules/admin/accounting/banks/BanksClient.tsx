"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { BankSkeleton } from "./BanksSekeleton";
import { BanksError } from "./BanksError";
import { BanksEmpty } from "./BanksEmpty";
import { BanksTable } from "./BanksTable";
import { BankCreateDialog } from "./BankCreateDialog";
import { BankEditDialog } from "./BankEditDialog";
import { BankDeleteDialog } from "./BankDeleteDialog";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/axios";
import { Bank } from "@repo/types";
import { BanksData, fetchBanks } from "@/lib/api/banks";
import { useCreateBank } from "@/hooks/mutations/admin/banks/useCreateBank";
import { useQuery } from "@tanstack/react-query";
import { useUpdateBank } from "@/hooks/mutations/admin/banks/useUpdateBank";
import { useDeleteBank } from "@/hooks/mutations/admin/banks/useDeleteBank";
import { useSetDefaultBank } from "@/hooks/mutations/admin/banks/useSetDefaultBank";

export function BanksClient() {
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editBank, setEditBank] = useState<Bank | null>(null);
  const [deleteBank_, setDeleteBank] = useState<Bank | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);

  const { data, isPending, isError, error, refetch } = useQuery<
    BanksData,
    AxiosError<ApiError>
  >({
    queryKey: ["admin-banks", page],
    queryFn: () => fetchBanks(page ?? 1),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;

      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key.toLowerCase() === "a") {
        setCreateOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const createBank = useCreateBank(page);
  const updateBank = useUpdateBank();
  const deleteBank = useDeleteBank();
  const setDefaultBank = useSetDefaultBank(page);

  const handleCreate = async (name: string) => {
    await createBank.mutateAsync({ name });
  };

  const handleEdit = async (id: string, name: string) => {
    await updateBank.mutateAsync({ bankID: id, name });
  };

  const handleDelete = async (id: string) => {
    await deleteBank.mutateAsync({ bankID: id });
  };

  const handleToggleDefault = async (bankID: string) => {
    try {
      setToggleLoadingId(bankID);
      await setDefaultBank.mutateAsync({ bankID });
    } finally {
      setToggleLoadingId(null);
    }
  };
  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-[family-name:var(--font-lora)] text-2xl font-bold text-[#1a1a1a] leading-tight mb-1">
            Banks
          </h1>
          <p className="text-sm text-stone-500 font-[family-name:var(--font-dm-sans)]">
            Manage payment bank accounts for the academy.
          </p>
        </div>
        <button
          onClick={() => {
            setCreateOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#2f4e40] text-[#fbfaf7] text-sm font-medium font-[family-name:var(--font-dm-sans)] hover:bg-[#3a5a49] hover:shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Bank
        </button>
      </div>

      {/* Content */}
      <div className="min-h-80">
        {isPending && <BankSkeleton />}
        {(isError || error) && (
          <BanksError
            message={error.response?.data.message ?? "Something went wrong"}
            onRetry={refetch}
          />
        )}
        {!isPending && !error && !isError && data.meta.total === 0 && (
          <BanksEmpty onAdd={() => setCreateOpen(true)} />
        )}
        {!isPending && !isError && data && data.meta.total > 0 && (
          <BanksTable
            banks={data.banks}
            meta={data.meta}
            toggleLoadingId={toggleLoadingId}
            onEdit={setEditBank}
            onDelete={setDeleteBank}
            onToggleDefault={handleToggleDefault}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Dialogs */}
      <BankCreateDialog
        open={createOpen}
        loading={createBank.isPending}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
      <BankEditDialog
        bank={editBank}
        loading={updateBank.isPending}
        onClose={() => setEditBank(null)}
        onSave={handleEdit}
      />
      <BankDeleteDialog
        bank={deleteBank_}
        loading={deleteBank.isPending}
        onClose={() => setDeleteBank(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
