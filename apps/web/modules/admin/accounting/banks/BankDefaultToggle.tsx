"use client";

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
  return (
    <button
      onClick={() => onToggle(bankId)}
      disabled={loading}
      aria-label={isDefault ? "Unset as default bank" : "Set as default bank"}
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
