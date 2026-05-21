export default function ProgramsSkeleton() {
  return (
    <section
      className="relative w-full overflow-hidden px-6 py-24"
      style={{ background: "#1e3328" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.018' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Header skeleton */}
        <div className="mb-20">
          <div className="mb-4 h-2.5 w-20 animate-pulse rounded-full bg-white/10" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-9 w-64 animate-pulse rounded-lg bg-white/10" />
              <div className="h-9 w-44 animate-pulse rounded-lg bg-white/8" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-52 animate-pulse rounded-full bg-white/8" />
              <div className="h-3 w-40 animate-pulse rounded-full bg-white/6" />
            </div>
          </div>
        </div>

        {/* Row skeletons */}
        <div className="flex flex-col">
          {[0, 1, 2].map((i) => (
            <SkeletonRow key={i} isLast={i === 2} />
          ))}
        </div>

        {/* CTA strip skeleton */}
        <div
          className="mt-16 flex flex-col items-start justify-between gap-5 rounded-2xl p-6 sm:flex-row sm:items-center sm:p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="h-5 w-64 animate-pulse rounded-lg bg-white/10" />
            <div className="h-3.5 w-80 animate-pulse rounded-full bg-white/7" />
          </div>
          <div className="h-11 w-40 animate-pulse rounded-xl bg-white/10" />
        </div>
      </div>
    </section>
  );
}

function SkeletonRow({ isLast }: { isLast: boolean }) {
  return (
    <div
      className="grid grid-cols-1 gap-8 py-10 lg:grid-cols-[1fr_1.1fr_auto]"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: isLast ? "1px solid rgba(255,255,255,0.07)" : "none",
      }}
    >
      {/* Left */}
      <div className="flex flex-col justify-between gap-6">
        <div>
          <div className="mb-5 flex items-center gap-4">
            <div className="h-2 w-5 animate-pulse rounded-full bg-white/10" />
            <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />
            <div className="h-6 w-28 animate-pulse rounded-full bg-white/10" />
          </div>
          <div className="mb-3 h-9 w-36 animate-pulse rounded-lg bg-white/10" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-full animate-pulse rounded-full bg-white/7" />
            <div className="h-3 w-[90%] animate-pulse rounded-full bg-white/7" />
            <div className="h-3 w-[75%] animate-pulse rounded-full bg-white/6" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-7 w-20 animate-pulse rounded-full bg-white/8" />
          <div className="h-7 w-28 animate-pulse rounded-full bg-white/8" />
        </div>
      </div>

      {/* Middle */}
      <div className="flex flex-col justify-center gap-3">
        <div className="mb-1 h-2 w-24 animate-pulse rounded-full bg-white/10" />
        {[100, 88, 94, 80].map((w, j) => (
          <div key={j} className="flex items-center gap-3">
            <div className="h-5 w-5 shrink-0 animate-pulse rounded-full bg-white/10" />
            <div
              className="h-3 animate-pulse rounded-full bg-white/7"
              style={{ width: `${w}%` }}
            />
          </div>
        ))}
      </div>

      {/* Right */}
      <div className="flex flex-col items-start justify-between gap-6 lg:items-end">
        <div className="text-left lg:text-right">
          <div className="mb-2 h-2 w-16 animate-pulse rounded-full bg-white/10" />
          <div className="h-10 w-36 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-1.5 h-2 w-28 animate-pulse rounded-full bg-white/7" />
        </div>
        <div className="h-11 w-36 animate-pulse rounded-xl bg-white/10" />
      </div>
    </div>
  );
}
