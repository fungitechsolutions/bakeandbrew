"use client";

interface BankAccountDefaultToggleProps {
  accountId: string;
  isDefault: boolean;
  loading: boolean;
  onToggle: (id: string) => void;
}

export function BankAccountDefaultToggle({
  accountId,
  isDefault,
  loading,
  onToggle,
}: BankAccountDefaultToggleProps) {
  return (
    <button
      onClick={() => onToggle(accountId)}
      disabled={loading}
      aria-label={
        isDefault ? "Unset as default account" : "Set as default account"
      }
      aria-pressed={isDefault}
      className={[
        "relative inline-flex items-center w-10 h-[22px] rounded-full border-none p-[2px] transition-colors duration-200 cursor-pointer",
        isDefault ? "bg-[#2f4e40]" : "bg-stone-300",
        loading ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      <span
        className={[
          "w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 pointer-events-none block",
          isDefault ? "translate-x-[18px]" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}
