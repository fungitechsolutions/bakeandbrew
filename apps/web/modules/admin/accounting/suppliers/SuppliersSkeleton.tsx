export function SuppliersSkeleton() {
  return (
    <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-sm animate-pulse">
      {/* Header row */}
      <div className="grid grid-cols-[minmax(200px,1fr)_160px_140px_160px_80px] gap-4 px-5 py-3 bg-stone-50 border-b border-stone-200">
        {[120, 80, 70, 90, 40].map((w, i) => (
          <div
            key={i}
            className="h-3 rounded bg-stone-200"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[minmax(200px,1fr)_160px_140px_160px_80px] gap-4 items-center px-5 py-4 border-b border-stone-100 last:border-0"
        >
          <div className="h-4 rounded bg-stone-100 w-48" />
          <div className="h-4 rounded bg-stone-100 w-24" />
          <div className="h-4 rounded bg-stone-100 w-28" />
          <div className="h-4 rounded bg-stone-100 w-24" />
          <div className="flex justify-end gap-2">
            <div className="h-8 w-8 rounded-md bg-stone-100" />
            <div className="h-8 w-8 rounded-md bg-stone-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
