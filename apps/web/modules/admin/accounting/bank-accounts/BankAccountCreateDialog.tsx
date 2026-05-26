"use client";

import { useState } from "react";
import {
  DialogWrapper,
  DialogHeader,
  DialogFooter,
  DialogField,
  BankSelectField,
  GhostButton,
  PrimaryButton,
} from "./DialogPrimitives";
import type { BankOption } from "./types";

interface BankAccountCreateDialogProps {
  open: boolean;
  loading: boolean;
  bankOptions: BankOption[];
  loadingOptions: boolean;
  onClose: () => void;
  onCreate: (payload: {
    bank_id: string;
    account_name: string;
    account_number: string | null;
  }) => Promise<void>;
}

interface FormState {
  bank_id: string;
  account_name: string;
  account_number: string;
}

interface FormErrors {
  bank_id?: string;
  account_name?: string;
}

// Inner form — remounted via key={openCount} so state is always fresh
function CreateForm({
  loading,
  bankOptions,
  loadingOptions,
  onClose,
  onCreate,
}: Omit<BankAccountCreateDialogProps, "open" | "onClose"> & {
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    bank_id: "",
    account_name: "",
    account_number: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError(null);
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.bank_id) next.bank_id = "Please select a bank.";
    if (!form.account_name.trim())
      next.account_name = "Account name is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitError(null);
    try {
      await onCreate({
        bank_id: form.bank_id,
        account_name: form.account_name.trim(),
        account_number: form.account_number.trim() || null,
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  };

  const canSubmit = !!form.bank_id && !!form.account_name.trim() && !loading;

  return (
    <>
      <DialogHeader
        id="create-account-dialog-title"
        title="Add Bank Account"
        onClose={onClose}
      />
      <div className="px-6 py-5 flex flex-col gap-4">
        <BankSelectField
          id="create-bank-select"
          label="Bank"
          value={form.bank_id}
          onChange={set("bank_id")}
          options={bankOptions}
          disabled={loading}
          error={errors.bank_id}
          loadingOptions={loadingOptions}
        />
        <DialogField
          id="create-account-name"
          label="Account Name"
          value={form.account_name}
          onChange={set("account_name")}
          placeholder="e.g. Main Operating Account"
          disabled={loading}
          error={errors.account_name}
          autoFocus
        />
        <DialogField
          id="create-account-number"
          label="Account Number (optional)"
          value={form.account_number}
          onChange={set("account_number")}
          placeholder="e.g. 0012345678901"
          disabled={loading}
        />
        {submitError && (
          <p className="text-xs text-red-500 font-[family-name:var(--font-dm-sans)]">
            {submitError}
          </p>
        )}
      </div>
      <DialogFooter>
        <GhostButton onClick={onClose} disabled={loading}>
          Cancel
        </GhostButton>
        <PrimaryButton onClick={handleSubmit} disabled={!canSubmit}>
          {loading ? "Adding…" : "Add Account"}
        </PrimaryButton>
      </DialogFooter>
    </>
  );
}

export function BankAccountCreateDialog({
  open,
  loading,
  bankOptions,
  loadingOptions,
  onClose,
  onCreate,
}: BankAccountCreateDialogProps) {
  const [openCount, setOpenCount] = useState(0);

  return (
    <DialogWrapper
      open={open}
      onClose={onClose}
      ariaLabelledBy="create-account-dialog-title"
      onAfterOpen={() => setOpenCount((c) => c + 1)}
    >
      <CreateForm
        key={openCount}
        loading={loading}
        bankOptions={bankOptions}
        loadingOptions={loadingOptions}
        onClose={onClose}
        onCreate={onCreate}
      />
    </DialogWrapper>
  );
}
