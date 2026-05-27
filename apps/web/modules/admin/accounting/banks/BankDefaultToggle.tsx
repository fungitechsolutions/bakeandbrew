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
  const disabled = loading || isDefault;

  return (
    <div className="relative group inline-flex">
      <button
        onClick={() => {
          if (disabled) return;
          onToggle(bankId);
        }}
        disabled={disabled}
        aria-label={isDefault ? "Default bank" : "Set as default bank"}
        aria-pressed={isDefault}
        className={[
          "relative inline-flex items-center w-10 h-[22px] rounded-full p-[2px] transition-colors duration-200",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          isDefault ? "bg-[#2f4e40]" : "bg-stone-300",
        ].join(" ")}
      >
        <span
          className={[
            "w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 block",
            isDefault ? "translate-x-[18px]" : "translate-x-0",
          ].join(" ")}
        />
      </button>

      {/* Tooltip */}
      {isDefault && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-10">
          <div className="text-[11px] bg-stone-900 text-white px-2 py-1 rounded whitespace-nowrap">
            Set another bank as default to change this
          </div>
        </div>
      )}
    </div>
  );
}
