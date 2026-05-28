"use client";
import { useEffect, useState } from "react";

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
    <div className="relative group inline-flex">
      <button
        onClick={handleClick}
        disabled={disabled}
        aria-label={
          optimistic ? "Default account (locked)" : "Set as default account"
        }
        aria-pressed={optimistic}
        className={[
          "relative inline-flex items-center w-10 h-[22px] rounded-full p-[2px]",
          "transition-all duration-200 border",
          optimistic
            ? "bg-[#2f4e40] border-[#2f4e40]"
            : "bg-stone-300 border-stone-300",
          isLocked
            ? "cursor-not-allowed opacity-70"
            : "cursor-pointer hover:opacity-90",
          isToggling ? "cursor-wait opacity-60" : "",
        ].join(" ")}
      >
        <span
          className={[
            "w-[18px] h-[18px] rounded-full bg-white shadow-sm",
            "transition-transform duration-200 block",
            optimistic ? "translate-x-[18px]" : "translate-x-0",
          ].join(" ")}
        />
      </button>

      {isLocked && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-10">
          <div className="text-[10px] bg-stone-900 text-white px-2 py-1 rounded whitespace-nowrap shadow-md">
            Cannot unset default account directly. Set another account as
            default first.
          </div>
        </div>
      )}
    </div>
  );
}
