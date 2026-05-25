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
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [open]);

  const handleClose = () => {
    setName("");
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Bank name is required.");
      return;
    }
    setError(null);
    try {
      await onCreate(trimmed);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
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
      <div className="px-6 py-5">
        <DialogField
          id="create-bank-name"
          label="Bank Name"
          value={name}
          onChange={(v) => {
            setName(v);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Nepal Investment Mega Bank"
          disabled={loading}
          error={error}
          inputRef={inputRef}
        />
      </div>
      <DialogFooter>
        <GhostButton onClick={handleClose} disabled={loading}>
          Cancel
        </GhostButton>
        <PrimaryButton
          onClick={handleSubmit}
          disabled={loading || !name.trim()}
        >
          {loading ? "Adding…" : "Add Bank"}
        </PrimaryButton>
      </DialogFooter>
    </DialogWrapper>
  );
}
