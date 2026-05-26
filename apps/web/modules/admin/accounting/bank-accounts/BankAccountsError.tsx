"use client";

import { WifiOff } from "lucide-react";

interface BankAccountsErrorProps {
  message?: string;
  onRetry: () => void;
}

export function BankAccountsError({
  message,
  onRetry,
}: BankAccountsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center gap-4">
      <div className="w-16 h-16 rounded-full border border-dashed border-red-400 flex items-center justify-center text-red-400 opacity-75">
        <WifiOff size={26} strokeWidth={1.5} />
      </div>
      <h3 className="font-[family-name:var(--font-lora)] text-lg font-semibold text-[#1a1a1a]">
        Failed to load bank accounts
      </h3>
      <p className="font-[family-name:var(--font-dm-sans)] text-sm text-stone-500 max-w-xs leading-relaxed">
        {message ??
          "Something went wrong. Check your connection and try again."}
      </p>
      <button
        onClick={onRetry}
        className="mt-1 px-5 py-2 rounded-lg border-2 border-[#2f4e40] text-[#2f4e40] text-sm font-medium font-[family-name:var(--font-dm-sans)] hover:bg-[#2f4e40] hover:text-[#fbfaf7] transition-colors cursor-pointer"
      >
        Retry
      </button>
    </div>
  );
}
