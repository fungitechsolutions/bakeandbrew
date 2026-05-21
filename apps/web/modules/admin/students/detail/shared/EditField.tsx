import { cn } from "@/lib/utils";

export function EditField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label
        className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#2d4a3e]/40"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
