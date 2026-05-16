export function IconBtn({
  icon: Icon,
  label,
  onClick,
  variant = "ghost",
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  variant?: "ghost" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
        variant === "danger"
          ? "text-red-400 hover:bg-red-50 hover:text-red-600"
          : "text-[#2d4a3e]/40 hover:bg-[#2d4a3e]/06 hover:text-[#2d4a3e]"
      }`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  );
}
