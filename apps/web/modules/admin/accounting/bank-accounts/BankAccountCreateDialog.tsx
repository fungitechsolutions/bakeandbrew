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
import { BanksData } from "@/lib/api/banks";
import {
  CreateBankAccountInput,
  createBankAccountInputSchema,
} from "@repo/types";
import { useForm } from "@tanstack/react-form-nextjs";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/axios";
import { mapFieldErrors } from "@/utils/api";
import { toast } from "sonner";

interface BankAccountCreateDialogProps {
  open: boolean;
  loading: boolean;
  bankOptions: BanksData["banks"];
  loadingOptions: boolean;
  onClose: () => void;
  onCreate: (
    payload: CreateBankAccountInput & { bankID: string },
  ) => Promise<void>;
}

function CreateForm({
  loading,
  bankOptions,
  loadingOptions,
  onClose,
  onCreate,
}: Omit<BankAccountCreateDialogProps, "open" | "onClose"> & {
  onClose: () => void;
}) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateBankAccountInput, string>>
  >({});
  const [bankID, setBankID] = useState<string>("");

  const form = useForm({
    defaultValues: {
      accountName: "",
      accountNumber: "",
    } as CreateBankAccountInput,
    validators: {
      onSubmit: createBankAccountInputSchema,
    },
    onSubmit: async ({ value }) => {
      if (!bankID) {
        toast.error("Please select a bank");
        return;
      }
      try {
        await onCreate({ bankID, ...value });
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
        id="create-account-dialog-title"
        title="Add Bank Account"
        onClose={onClose}
      />
      <div className="px-6 py-5 flex flex-col gap-4">
        <BankSelectField
          id="create-bank-select"
          label="Bank"
          value={bankID}
          onChange={setBankID}
          options={bankOptions}
          disabled={loading}
          loadingOptions={loadingOptions}
        />
        <form.Field name="accountName">
          {(field) => {
            const fieldError = field.state.meta.errors[0]?.message;
            const mergedError = fieldError ?? errors.accountName;
            return (
              <DialogField
                id="create-account-name"
                label="Account Name"
                value={field.state.value}
                onChange={field.handleChange}
                placeholder="e.g. Main Operating Account"
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
                id="create-account-number"
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
