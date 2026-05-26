"use client";

import { AlertTriangle } from "lucide-react";
import {
  DialogWrapper,
  DialogHeader,
  DialogFooter,
  GhostButton,
} from "./DialogPrimitives";
import type { BankAccount } from "./types";

interface BankAccountDeleteDialogProps {
  account: BankAccount | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function BankAccountDeleteDialog({
  account,
  loading,
  onClose,
  onConfirm,
}: BankAccountDeleteDialogProps) {
  return (
    <DialogWrapper
      open={!!account}
      onClose={onClose}
      ariaLabelledBy="delete-account-dialog-title"
      role="alertdialog"
    >
      <DialogHeader
        id="delete-account-dialog-title"
        title="Delete Account"
        onClose={onClose}
      />

      <div className="px-6 py-5 flex gap-3.5">
        <div className="shrink-0 w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
          <AlertTriangle size={17} strokeWidth={2} />
        </div>
        <div className="flex flex-col gap-1 pt-0.5">
          <p className="text-sm text-stone-500 leading-relaxed font-[family-name:var(--font-dm-sans)]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#1a1a1a]">
              {account?.account_name}
            </span>{" "}
            from{" "}
            <span className="font-semibold text-[#1a1a1a]">
              {account?.bank_name}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
      </div>

      <DialogFooter>
        <GhostButton onClick={onClose} disabled={loading}>
          Cancel
        </GhostButton>
        <button
          onClick={() => account && onConfirm(account.id)}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium font-[family-name:var(--font-dm-sans)] hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Deleting…" : "Delete"}
        </button>
      </DialogFooter>
    </DialogWrapper>
  );
}
