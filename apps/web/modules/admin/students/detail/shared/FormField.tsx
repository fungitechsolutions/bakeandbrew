export function FormField({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[#2d4a3e]/50"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        {label}
        {required && <span className="ml-0.5 text-[#e8552a]">*</span>}
      </label>
      {children}
      {hint && (
        <p
          className="text-[0.72rem] text-[#2d4a3e]/35"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
