"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LedgerPageHeaderProps {
  title: string;
  subtitle?: string;
  onCreateEntry: () => void;
}

export function LedgerPageHeader({
  title,
  subtitle,
  onCreateEntry,
}: LedgerPageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--brand-ink)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-sm" style={{ color: "#6b7280" }}>
            {subtitle}
          </p>
        )}
      </div>
      <Button
        onClick={onCreateEntry}
        className="mt-3 sm:mt-0 self-start sm:self-auto gap-2 text-sm font-medium"
        style={{
          backgroundColor: "var(--brand-green)",
          color: "var(--brand-cream)",
        }}
      >
        <PlusCircle size={15} />
        New Entry
      </Button>
    </div>
  );
}
