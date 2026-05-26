"use client";

import { useState } from "react";
import {
  DialogWrapper,
  DialogHeader,
  DialogFooter,
  DialogField,
  GhostButton,
  PrimaryButton,
} from "./DialogPrimitives";
import type { BankAccount } from "./types";

interface BankAccountEditDialogProps {
  account: BankAccount | null;
  loading: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    payload: { account_name: string; account_number: string | null },
  ) => Promise<void>;
}

interface EditFormProps {
  account: BankAccount;
  loading: boolean;
  onClose: () => void;
  onSave: BankAccountEditDialogProps["onSave"];
}

function EditForm({ account, loading, onClose, onSave }: EditFormProps) {
  const [accountName, setAccountName] = useState(account.account_name);
  const [accountNumber, setAccountNumber] = useState(
    account.account_number ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmedName = accountName.trim();
    if (!trimmedName) {
      setError("Account name is required.");
      return;
    }
    setError(null);
    try {
      await onSave(account.id, {
        account_name: trimmedName,
        account_number: accountNumber.trim() || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const unchanged =
    accountName.trim() === account.account_name &&
    (accountNumber.trim() || null) === account.account_number;

  return (
    <>
      <DialogHeader
        id="edit-account-dialog-title"
        title="Edit Account"
        onClose={onClose}
      />

      {/* Bank context — read-only pill */}
      <div className="px-6 pt-4">
        <p className="text-[0.8125rem] font-medium text-stone-600 font-[family-name:var(--font-dm-sans)] mb-1.5">
          Bank
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200">
          <span className="text-sm text-stone-600 font-[family-name:var(--font-dm-sans)]">
            {account.bank_name}
          </span>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-4">
        <DialogField
          id="edit-account-name"
          label="Account Name"
          value={accountName}
          onChange={(v) => {
            setAccountName(v);
            setError(null);
          }}
          disabled={loading}
          error={error}
          autoFocus
        />
        <DialogField
          id="edit-account-number"
          label="Account Number (optional)"
          value={accountNumber}
          onChange={setAccountNumber}
          placeholder="e.g. 0012345678901"
          disabled={loading}
        />
      </div>

      <DialogFooter>
        <GhostButton onClick={onClose} disabled={loading}>
          Cancel
        </GhostButton>
        <PrimaryButton
          onClick={handleSubmit}
          disabled={loading || !accountName.trim() || unchanged}
        >
          {loading ? "Saving…" : "Save Changes"}
        </PrimaryButton>
      </DialogFooter>
    </>
  );
}

export function BankAccountEditDialog({
  account,
  loading,
  onClose,
  onSave,
}: BankAccountEditDialogProps) {
  return (
    <DialogWrapper
      open={!!account}
      onClose={onClose}
      ariaLabelledBy="edit-account-dialog-title"
    >
      {account && (
        <EditForm
          key={account.id}
          account={account}
          loading={loading}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </DialogWrapper>
  );
}
