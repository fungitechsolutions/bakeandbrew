export function SupplierLedgerSkeleton() {
  return (
    <div
      className="rounded-xl border flex flex-col overflow-hidden animate-pulse"
      style={{
        borderColor: "#e5e0d6",
        height: "calc(100vh - 360px)",
        minHeight: "320px",
      }}
    >
      {/* Sticky header */}
      <div
        className="flex gap-4 px-4 py-3"
        style={{ backgroundColor: "var(--brand-green)", opacity: 0.7 }}
      >
        {[40, 90, 130, 50, 100, 100, 140, 90].map((w, i) => (
          <div
            key={i}
            className="h-3 rounded bg-white/20"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>
      {/* Rows */}
      <div className="flex-1 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 items-center px-4 py-3 border-b"
            style={{
              borderColor: "#f0ede7",
              backgroundColor: i % 2 === 0 ? "#fff" : "#faf9f6",
            }}
          >
            {[40, 90, 130, 50, 100, 100, 140, 90].map((w, j) => (
              <div
                key={j}
                className="h-3 rounded bg-stone-100"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
