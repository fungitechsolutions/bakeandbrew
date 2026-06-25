"use client";

import { useRef, useState, useEffect } from "react";
import {
  DialogWrapper,
  DialogHeader,
  DialogFooter,
  DialogField,
  GhostButton,
  PrimaryButton,
} from "./DialogPrimitives";
import {
  CreateBankInput,
  createBankInputSchema,
} from "@repo/types/admin/accounting/bank";
import { useForm } from "@tanstack/react-form-nextjs";
import { AxiosError } from "axios";
import { APIError } from "@repo/types";

import { mapFieldErrors } from "@/utils/api";

interface BankCreateDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export function BankCreateDialog({
  open,
  loading,
  onClose,
  onCreate,
}: BankCreateDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CreateBankInput, string>>
  >({});

  useEffect(() => {
    if (!open) return;

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const form = useForm({
    defaultValues: { name: "" },
    validators: { onSubmit: createBankInputSchema },
    onSubmit: async ({ value, formApi }) => {
      setFieldErrors({});
      try {
        await onCreate(value.name);
        formApi.reset();
        onClose();
      } catch (err) {
        const error = err as AxiosError<APIError>;
        const data = error.response?.data;
        if (data?.errors?.length) {
          setFieldErrors(mapFieldErrors(data));
        }
      }
    },
  });
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") form.handleSubmit();
    if (e.key === "Escape") onClose();
  };

  return (
    <DialogWrapper
      open={open}
      onClose={handleClose}
      ariaLabelledBy="create-dialog-title"
    >
      <DialogHeader
        id="create-dialog-title"
        title="Add Bank"
        onClose={handleClose}
      />
      <form.Field name="name">
        {(field) => {
          const fieldError = field.state.meta.errors[0]?.message;
          const mergedError = fieldError ?? fieldErrors.name;
          return (
            <div className="px-6 py-5">
              <DialogField
                id="create-bank-name"
                label="Bank Name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Nepal Investment Mega Bank"
                disabled={loading}
                error={mergedError}
                inputRef={inputRef}
              />
            </div>
          );
        }}
      </form.Field>
      <DialogFooter>
        <GhostButton onClick={handleClose} disabled={loading}>
          Cancel
        </GhostButton>
        <PrimaryButton onClick={form.handleSubmit} disabled={loading}>
          {loading ? "Adding…" : "Add Bank"}
        </PrimaryButton>
      </DialogFooter>
    </DialogWrapper>
  );
}
