"use client";

import { StatusToggle } from "@/components/admin/status-toggle";

interface BankDefaultToggleProps {
  bankId: string;
  isDefault: boolean;
  loading: boolean;
  onToggle: (id: string) => void;
}

export function BankDefaultToggle({
  bankId,
  isDefault,
  loading,
  onToggle,
}: BankDefaultToggleProps) {
  const disabled = loading || isDefault;

  return (
    <div className="group relative inline-flex">
      <StatusToggle
        checked={isDefault}
        disabled={disabled}
        ariaLabel={isDefault ? "Default bank" : "Set as default bank"}
        onChange={() => {
          if (disabled) return;
          onToggle(bankId);
        }}
      />

      {isDefault ? (
        <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 group-hover:block">
          <div className="whitespace-nowrap rounded-sm bg-[#1a1a1a] px-2 py-1 font-(family-name:--font-dm-sans) text-[11px] text-white">
            Set another bank as default to change this
          </div>
        </div>
      ) : null}
    </div>
  );
}
