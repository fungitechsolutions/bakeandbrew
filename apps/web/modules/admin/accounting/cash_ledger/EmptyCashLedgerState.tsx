"use client";

import { Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCashLedgerStateProps {
  onCreateEntry: () => void;
}

export function EmptyCashLedgerState({
  onCreateEntry,
}: EmptyCashLedgerStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: "#f5f3ef", border: "1.5px solid #e5e0d6" }}
      >
        <Banknote size={24} style={{ color: "#9ca3af" }} />
      </div>
      <div className="text-center">
        <p
          className="text-sm font-medium"
          style={{ color: "var(--brand-ink)" }}
        >
          No cash entries yet
        </p>
        <p className="mt-1 text-xs" style={{ color: "#9ca3af" }}>
          Record your first cash transaction to get started
        </p>
      </div>
      <Button
        onClick={onCreateEntry}
        size="sm"
        className="gap-2 text-xs"
        style={{
          backgroundColor: "var(--brand-green)",
          color: "var(--brand-cream)",
        }}
      >
        New Entry
      </Button>
    </div>
  );
}
