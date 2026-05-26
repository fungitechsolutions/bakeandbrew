"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";

import {
  fetchBankAccounts,
  fetchBankOptions,
  createBankAccount,
  updateBankAccount,
  toggleAccountDefault,
  deleteBankAccount,
  type CreateBankAccountPayload,
  type UpdateBankAccountPayload,
} from "./mock-api";

import type { BankAccount, BankAccountsResponse, BankOption } from "./types";
import { BankAccountSkeleton } from "./BankAccountSkeleton";
import { BankAccountsError } from "./BankAccountsError";
import { BankAccountsEmpty } from "./BankAccountEmpty";
import { BankAccountsTable } from "./BankAccountsTable";
import { BankAccountCreateDialog } from "./BankAccountCreateDialog";
import { BankAccountEditDialog } from "./BankAccountEditDialog";
import { BankAccountDeleteDialog } from "./BankAccountDeleteDialog";
import { MOCK_BANK_OPTIONS } from "./mock-data";

type LoadState = "loading" | "idle" | "error";

export function BankAccountsClient() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [response, setResponse] = useState<BankAccountsResponse | null>(null);
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<BankAccount | null>(null);
  const [deleteAccount, setDeleteAccount] = useState<BankAccount | null>(null);

  const [createLoading, setCreateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);

  const load = useCallback(async (targetPage = 1) => {
    setLoadState("loading");
    setErrorMsg(null);
    try {
      const data = await fetchBankAccounts(targetPage);
      setResponse(data);
      setPage(data.meta.page);
      setLoadState("idle");
    } catch {
      setErrorMsg("Could not reach the server. Please try again.");
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      setLoadState("loading");
      setErrorMsg(null);

      try {
        const data = await fetchBankAccounts(1);

        setResponse(data);
        setPage(data.meta.page);
        setLoadState("idle");
      } catch {
        setErrorMsg("Could not reach the server. Please try again.");
        setLoadState("error");
      }
    };

    void run();
  }, []);

  const handleCreate = async (payload: CreateBankAccountPayload) => {
    setCreateLoading(true);
    try {
      await createBankAccount(payload);
      setCreateOpen(false);
      await load(1);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEdit = async (id: string, payload: UpdateBankAccountPayload) => {
    setEditLoading(true);
    try {
      await updateBankAccount(id, payload);
      setEditAccount(null);
      await load(page);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    try {
      await deleteBankAccount(id);
      setDeleteAccount(null);
      const newPage = response?.data.length === 1 && page > 1 ? page - 1 : page;
      await load(newPage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleDefault = async (id: string) => {
    setToggleLoadingId(id);
    try {
      await toggleAccountDefault(id);
      await load(page);
    } finally {
      setToggleLoadingId(null);
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
        {loadState === "loading" && <BankAccountSkeleton />}
        {loadState === "error" && (
          <BankAccountsError
            message={errorMsg ?? undefined}
            onRetry={() => load(1)}
          />
        )}
        {loadState === "idle" && response?.meta.total === 0 && (
          <BankAccountsEmpty onAdd={() => setCreateOpen(true)} />
        )}
        {loadState === "idle" && response && response.meta.total > 0 && (
          <BankAccountsTable
            accounts={response.data}
            meta={response.meta}
            toggleLoadingId={toggleLoadingId}
            onEdit={setEditAccount}
            onDelete={setDeleteAccount}
            onToggleDefault={handleToggleDefault}
            onPageChange={load}
          />
        )}
      </div>

      {/* Dialogs */}
      <BankAccountCreateDialog
        open={createOpen}
        loading={createLoading}
        bankOptions={MOCK_BANK_OPTIONS}
        loadingOptions={false}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
      <BankAccountEditDialog
        account={editAccount}
        loading={editLoading}
        onClose={() => setEditAccount(null)}
        onSave={handleEdit}
      />
      <BankAccountDeleteDialog
        account={deleteAccount}
        loading={deleteLoading}
        onClose={() => setDeleteAccount(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
