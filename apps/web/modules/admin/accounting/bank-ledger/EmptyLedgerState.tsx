"use client";

import { BookOpen, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyLedgerStateProps {
  onCreateEntry: () => void;
}

export function EmptyLedgerState({ onCreateEntry }: EmptyLedgerStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: "#f0f4f1", color: "var(--brand-green)" }}
      >
        <BookOpen size={28} />
      </div>
      <h3
        className="text-base font-semibold"
        style={{ color: "var(--brand-ink)" }}
      >
        No ledger entries yet
      </h3>
      <p className="mt-1 max-w-xs text-sm" style={{ color: "#6b7280" }}>
        No financial transactions have been recorded for this account. Create
        the first entry to get started.
      </p>
      <Button
        onClick={onCreateEntry}
        className="mt-5 gap-2 text-sm font-medium"
        style={{
          backgroundColor: "var(--brand-green)",
          color: "var(--brand-cream)",
        }}
      >
        <PlusCircle size={15} />
        Create First Entry
      </Button>
    </div>
  );
}
