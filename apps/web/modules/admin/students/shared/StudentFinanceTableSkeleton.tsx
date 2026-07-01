const skClass = "animate-pulse bg-[rgba(47,78,64,0.08)]";

export function StudentFinanceTableSkeleton({
  rows = 8,
  columns,
}: {
  rows?: number;
  columns: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-[rgba(47,78,64,0.08)]">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <td key={colIndex} className="px-5 py-4">
              <div
                className={`h-3.5 ${skClass} ${
                  colIndex === 0 ? "w-40" : colIndex === columns - 1 ? "w-24" : "w-28"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function StudentFinanceMobileSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="border-b border-[rgba(47,78,64,0.1)] p-4 last:border-b-0"
        >
          <div className="mb-3 flex gap-3">
            <div className={`h-10 w-10 shrink-0 ${skClass}`} />
            <div className="flex flex-1 flex-col gap-2">
              <div className={`h-3.5 w-2/5 ${skClass}`} />
              <div className={`h-3 w-3/5 bg-[rgba(47,78,64,0.06)] animate-pulse`} />
            </div>
          </div>
          <div className="flex flex-col gap-2 pl-[52px]">
            {Array.from({ length: 4 }).map((__, j) => (
              <div key={j} className={`h-3 w-1/2 bg-[rgba(47,78,64,0.06)] animate-pulse`} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
