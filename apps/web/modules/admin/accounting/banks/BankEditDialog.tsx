"use client";

import { useEffect, useRef, useState } from "react";
import {
  DialogWrapper,
  DialogHeader,
  DialogFooter,
  DialogField,
  GhostButton,
  PrimaryButton,
} from "./DialogPrimitives";
import { Bank } from "@repo/types";
import {
  UpdateBankInput,
  updateBankInputSchema,
} from "@repo/types/admin/accounting/bank";
import { useForm } from "@tanstack/react-form-nextjs";
import { ApiError } from "@/lib/axios";
import { AxiosError } from "axios";
import { mapFieldErrors } from "@/utils/api";

interface BankEditDialogProps {
  bank: Bank | null;
  loading: boolean;
  onClose: () => void;
  onSave: (id: string, name: string) => Promise<void>;
}

export function BankEditDialog({
  bank,
  loading,
  onClose,
  onSave,
}: BankEditDialogProps) {
  const [error, setError] = useState<
    Partial<Record<keyof UpdateBankInput, string>>
  >({});
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      name: bank?.name ?? "",
    },
    validators: {
      onSubmit: updateBankInputSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      if (!bank) return;
      try {
        await onSave(bank.id, value.name);
        formApi.reset();
        onClose();
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        const data = error.response?.data;
        if (data?.errors?.length) {
          setError(mapFieldErrors(data));
        }
      }
    },
  });

  useEffect(() => {
    if (bank) {
      form.reset({
        name: bank.name,
      });
      setTimeout(() => {
        setError({});
      }, 0);
    }
  }, [bank]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") form.handleSubmit();
    if (e.key === "Escape") onClose();
  };

  return (
    <DialogWrapper
      open={!!bank}
      onClose={onClose}
      ariaLabelledBy="edit-dialog-title"
    >
      <DialogHeader
        id="edit-dialog-title"
        title="Edit Bank"
        onClose={onClose}
      />
      <form.Field name="name">
        {(field) => {
          const fieldError = field.state.meta.errors[0]?.message;
          const mergedError = fieldError ?? error.name;
          const unchanged = field.state.value.trim() === bank?.name;
          return (
            <>
              <div className="px-6 py-5">
                <DialogField
                  id="edit-bank-name"
                  label="Bank Name"
                  value={field.state.value}
                  onChange={(v) => {
                    field.handleChange(v);
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  error={mergedError}
                  inputRef={inputRef}
                />
              </div>
              <DialogFooter>
                <GhostButton onClick={onClose} disabled={loading}>
                  Cancel
                </GhostButton>
                <PrimaryButton
                  onClick={form.handleSubmit}
                  disabled={loading || unchanged || !field.state.value.trim()}
                >
                  {loading ? "Saving…" : "Save Changes"}
                </PrimaryButton>
              </DialogFooter>
            </>
          );
        }}
      </form.Field>
    </DialogWrapper>
  );
}
