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
import { Bank } from "./types";

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
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bank) {
      setName(bank.name);
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [bank]);

  const handleSubmit = async () => {
    if (!bank) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Bank name is required.");
      return;
    }
    setError(null);
    try {
      await onSave(bank.id, trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onClose();
  };

  const unchanged = name.trim() === bank?.name;

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
      <div className="px-6 py-5">
        <DialogField
          id="edit-bank-name"
          label="Bank Name"
          value={name}
          onChange={(v) => {
            setName(v);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          disabled={loading}
          error={error}
          inputRef={inputRef}
        />
      </div>
      <DialogFooter>
        <GhostButton onClick={onClose} disabled={loading}>
          Cancel
        </GhostButton>
        <PrimaryButton
          onClick={handleSubmit}
          disabled={loading || !name.trim() || unchanged}
        >
          {loading ? "Saving…" : "Save Changes"}
        </PrimaryButton>
      </DialogFooter>
    </DialogWrapper>
  );
}
