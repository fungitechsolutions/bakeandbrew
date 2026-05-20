import { cn } from "@/lib/utils";

export function InfoRow({
  label,
  value,
  icon: Icon,
  truncate = false,
  className,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  truncate?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", className)}>
      <span
        className="text-[0.7rem] font-semibold uppercase tracking-[0.07em] text-[#2d4a3e]/40"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        {label}
      </span>
      <div className="flex min-w-0 items-center gap-1.5">
        <Icon
          className="h-3.5 w-3.5 shrink-0 text-[#2d4a3e]/30"
          strokeWidth={1.75}
        />
        <span
          className={cn(
            "text-[0.88rem] font-medium text-[#2d4a3e]",
            truncate && "min-w-0 truncate",
          )}
          style={{ fontFamily: "var(--font-dm-sans)" }}
          title={truncate ? value : undefined}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
