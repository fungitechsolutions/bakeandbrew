export function SectionCard({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  action?: React.ReactNode; // ← add this
}) {
  return (
    <div className="rounded-2xl border border-[#2d4a3e]/08 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(45,74,62,0.06)]">
      <div className="mb-4 flex items-center justify-between"> {/* justify-between here */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2d4a3e]/08">
            <Icon className="h-3.5 w-3.5 text-[#2d4a3e]" strokeWidth={2} />
          </div>
          <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.07em] text-[#2d4a3e]/60">
            {title}
          </h3>
        </div>
        {action && <div>{action}</div>} {/* ← render action here */}
      </div>
      {children}
    </div>
  );
}