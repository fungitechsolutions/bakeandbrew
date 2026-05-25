"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";

import {
  fetchBanks,
  createBank,
  updateBankName,
  toggleDefault,
  deleteBank,
} from "./mock-api";

import type { Bank, BanksResponse } from "./types";
import { BankSkeleton } from "./BanksSekeleton";
import { BanksError } from "./BanksError";
import { BanksEmpty } from "./BanksEmpty";
import { BanksTable } from "./BanksTable";
import { BankCreateDialog } from "./BankCreateDialog";
import { BankEditDialog } from "./BankEditDialog";
import { BankDeleteDialog } from "./BankDeleteDialog";

type LoadState = "loading" | "idle" | "error";

export function BanksClient() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [response, setResponse] = useState<BanksResponse | null>(null);
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editBank, setEditBank] = useState<Bank | null>(null);
  const [deleteBank_, setDeleteBank] = useState<Bank | null>(null);

  const [createLoading, setCreateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);

  const load = useCallback(async (targetPage = 1) => {
    setLoadState("loading");
    setErrorMsg(null);
    try {
      const data = await fetchBanks(targetPage);
      setResponse(data);
      setPage(data.meta.page);
      setLoadState("idle");
    } catch {
      setErrorMsg("Could not reach the server. Please try again.");
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      load(1);
    }, 0);
  }, [load]);

  const handleCreate = async (name: string) => {
    setCreateLoading(true);
    try {
      await createBank(name);
      setCreateOpen(false);
      await load(1);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEdit = async (id: string, name: string) => {
    setEditLoading(true);
    try {
      await updateBankName(id, name);
      setEditBank(null);
      await load(page);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    try {
      await deleteBank(id);
      setDeleteBank(null);
      const newPage = response?.data.length === 1 && page > 1 ? page - 1 : page;
      await load(newPage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleDefault = async (id: string) => {
    setToggleLoadingId(id);
    try {
      await toggleDefault(id);
      await load(page);
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
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#2f4e40] text-[#fbfaf7] text-sm font-medium font-[family-name:var(--font-dm-sans)] hover:bg-[#3a5a49] hover:shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Bank
        </button>
      </div>

      {/* Content */}
      <div className="min-h-80">
        {loadState === "loading" && <BankSkeleton />}
        {loadState === "error" && (
          <BanksError message={errorMsg ?? undefined} onRetry={() => load(1)} />
        )}
        {loadState === "idle" && response?.meta.total === 0 && (
          <BanksEmpty onAdd={() => setCreateOpen(true)} />
        )}
        {loadState === "idle" && response && response.meta.total > 0 && (
          <BanksTable
            banks={response.data}
            meta={response.meta}
            toggleLoadingId={toggleLoadingId}
            onEdit={setEditBank}
            onDelete={setDeleteBank}
            onToggleDefault={handleToggleDefault}
            onPageChange={load}
          />
        )}
      </div>

      {/* Dialogs */}
      <BankCreateDialog
        open={createOpen}
        loading={createLoading}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
      <BankEditDialog
        bank={editBank}
        loading={editLoading}
        onClose={() => setEditBank(null)}
        onSave={handleEdit}
      />
      <BankDeleteDialog
        bank={deleteBank_}
        loading={deleteLoading}
        onClose={() => setDeleteBank(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
