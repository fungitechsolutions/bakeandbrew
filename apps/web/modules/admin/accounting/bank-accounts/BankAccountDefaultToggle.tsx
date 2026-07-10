"use client";

import { useEffect, useState } from "react";

import { StatusToggle } from "@/components/admin/status-toggle";

interface BankAccountDefaultToggleProps {
  accountId: string;
  isDefault: boolean;
  isToggling: boolean;
  onToggle: (id: string) => void;
}

export function BankAccountDefaultToggle({
  accountId,
  isDefault,
  isToggling,
  onToggle,
}: BankAccountDefaultToggleProps) {
  const [optimistic, setOptimistic] = useState(isDefault);

  useEffect(() => {
    setTimeout(() => {
      setOptimistic(isDefault);
    }, 0);
  }, [isDefault]);

  const isLocked = optimistic;
  const disabled = isLocked || isToggling;

  const handleClick = () => {
    if (disabled) return;
    setOptimistic(true);
    onToggle(accountId);
  };

  return (
    <div className="group relative inline-flex">
      <StatusToggle
        checked={optimistic}
        disabled={disabled}
        ariaLabel={
          optimistic ? "Default account (locked)" : "Set as default account"
        }
        onChange={handleClick}
      />

      {isLocked ? (
        <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 group-hover:block">
          <div className="whitespace-nowrap rounded-sm bg-[#1a1a1a] px-2 py-1 font-(family-name:--font-dm-sans) text-[11px] text-white">
            Cannot unset default account directly. Set another account as
            default first.
          </div>
        </div>
      ) : null}
    </div>
  );
}
