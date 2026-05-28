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
import {
  BankAccount,
  UpdateBankAccountInput,
  updateBankAccountInputSchema,
} from "@repo/types";
import { useForm } from "@tanstack/react-form-nextjs";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/axios";
import { mapFieldErrors } from "@/utils/api";

interface BankAccountEditDialogProps {
  account: BankAccount | null;
  loading: boolean;
  onClose: () => void;
  onSave: (
    payload: UpdateBankAccountInput & { accountID: string },
  ) => Promise<void>;
}

interface EditFormProps {
  account: BankAccount;
  loading: boolean;
  onClose: () => void;
  onSave: BankAccountEditDialogProps["onSave"];
}

function EditForm({ account, loading, onClose, onSave }: EditFormProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateBankAccountInput, string>>
  >({});

  const form = useForm({
    defaultValues: {
      accountName: account.accountName,
      accountNumber: account.accountNumber,
    } as UpdateBankAccountInput,
    validators: {
      onSubmit: updateBankAccountInputSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await onSave({ accountID: account.id, ...value });
        onClose();
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        const data = error.response?.data;
        if (data?.errors?.length) {
          setErrors(mapFieldErrors(data));
        }
      }
    },
  });

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
            {account.bankName}
          </span>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-4">
        <form.Field name="accountName">
          {(field) => {
            const fieldError = field.state.meta.errors[0]?.message;
            const mergedError = fieldError ?? errors.accountName;
            return (
              <DialogField
                id="edit-account-name"
                label="Account Name"
                value={field.state.value}
                onChange={field.handleChange}
                disabled={loading}
                error={mergedError}
                autoFocus
              />
            );
          }}
        </form.Field>

        <form.Field name="accountNumber">
          {(field) => {
            const fieldError = field.state.meta.errors[0]?.message;
            const mergedError = fieldError ?? errors.accountNumber;
            return (
              <DialogField
                id="edit-account-number"
                label="Account Number (optional)"
                value={field.state.value ?? ""}
                onChange={field.handleChange}
                placeholder="e.g. 0012345678901"
                disabled={loading}
                error={mergedError}
              />
            );
          }}
        </form.Field>
      </div>

      <DialogFooter>
        <GhostButton onClick={onClose} disabled={loading}>
          Cancel
        </GhostButton>
        <PrimaryButton onClick={form.handleSubmit} disabled={loading}>
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
