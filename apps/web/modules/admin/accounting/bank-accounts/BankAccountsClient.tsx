"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { BankAccountSkeleton } from "./BankAccountSkeleton";
import { BankAccountsError } from "./BankAccountsError";
import { BankAccountsEmpty } from "./BankAccountEmpty";
import { BankAccountsTable } from "./BankAccountsTable";
import { BankAccountCreateDialog } from "./BankAccountCreateDialog";
import { BankAccountEditDialog } from "./BankAccountEditDialog";
import { BankAccountDeleteDialog } from "./BankAccountDeleteDialog";
import { useBankAccounts } from "@/hooks/queries/admin/banks/bank_accounts/useBankAccounts";
import {
  BankAccount,
  CreateBankAccountInput,
  UpdateBankAccountInput,
} from "@repo/types";
import { useBanks } from "@/hooks/queries/admin/banks/bank_accounts/useBanks";
import { useCreateBankAccount } from "@/hooks/mutations/admin/bank_accounts/useCreateBankAccount";
import { useUpdateBankAccount } from "@/hooks/mutations/admin/bank_accounts/useUpdateBankAccount";
import { useDeleteBankAccount } from "@/hooks/mutations/admin/bank_accounts/useDeleteBankAccount";
import { useSetDefaultBankAccount } from "@/hooks/mutations/admin/bank_accounts/useSetDefaultBankAccount";

export function BankAccountsClient() {
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<BankAccount | null>(null);
  const [deleteAccount, setDeleteAccount] = useState<BankAccount | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { isPending, isError, error, refetch, data } = useBankAccounts(page);
  const {
    // isPending: isFetchingBanks,
    // isError: isBanksError,
    // error: banksError,
    // refetch: refetchBanks,
    data: banksData,
  } = useBanks();

  const createBankAccount = useCreateBankAccount();
  const updateBankAccount = useUpdateBankAccount();
  const deleteBankAccount = useDeleteBankAccount();
  const setDefaultBankAccount = useSetDefaultBankAccount();

  const handleCreate = async (
    data: CreateBankAccountInput & { bankID: string },
  ) => {
    await createBankAccount.mutateAsync({ ...data });
  };

  const handleEdit = async (
    data: UpdateBankAccountInput & { accountID: string },
  ) => {
    await updateBankAccount.mutateAsync({ ...data });
    setEditAccount(null);
  };

  const handleDelete = async (accountID: string) => {
    await deleteBankAccount.mutateAsync({ accountID });
    setDeleteAccount(null);
  };

  const handleToggleDefault = async (accountID: string) => {
    setTogglingId(accountID);
    try {
      await setDefaultBankAccount.mutateAsync({ accountID });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-[family-name:var(--font-lora)] text-2xl font-bold text-[#1a1a1a] leading-tight mb-1">
            Bank Accounts
          </h1>
          <p className="text-sm text-stone-500 font-[family-name:var(--font-dm-sans)]">
            Manage accounts linked to your banks for payment processing.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#2f4e40] text-[#fbfaf7] text-sm font-medium font-[family-name:var(--font-dm-sans)] hover:bg-[#3a5a49] hover:shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Account
        </button>
      </div>

      {/* Content */}
      <div className="min-h-80">
        {isPending && <BankAccountSkeleton />}
        {(isError || error) && (
          <BankAccountsError
            message={error.message ?? "Something went wrong"}
            onRetry={refetch}
          />
        )}
        {!isPending && !isError && data.meta.total === 0 && (
          <BankAccountsEmpty onAdd={() => setCreateOpen(true)} />
        )}
        {!isPending && !isError && data && data.meta.total > 0 && (
          <BankAccountsTable
            accounts={data.bankAccounts}
            meta={data.meta}
            togglingId={togglingId}
            onEdit={setEditAccount}
            onDelete={setDeleteAccount}
            onToggleDefault={handleToggleDefault}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Dialogs */}
      <BankAccountCreateDialog
        open={createOpen}
        loading={createBankAccount.isPending}
        bankOptions={banksData ?? []}
        loadingOptions={false}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
      <BankAccountEditDialog
        account={editAccount}
        loading={updateBankAccount.isPending}
        onClose={() => setEditAccount(null)}
        onSave={handleEdit}
      />
      <BankAccountDeleteDialog
        account={deleteAccount}
        loading={deleteBankAccount.isPending}
        onClose={() => setDeleteAccount(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
