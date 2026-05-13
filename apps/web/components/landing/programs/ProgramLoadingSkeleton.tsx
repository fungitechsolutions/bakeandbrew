export default function ProgramsSkeleton() {
  return (
    <section className="relative w-full overflow-hidden bg-[#2d4a3e] px-6 py-24">
      {/* Dot texture — kept identical to real section */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.025' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* ── Header skeleton ── */}
        <div className="mb-16 flex flex-col items-center gap-3">
          {/* eyebrow */}
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
          {/* headline line 1 */}
          <div className="h-8 w-56 animate-pulse rounded-lg bg-white/10" />
          {/* headline line 2 (italic) */}
          <div className="h-8 w-40 animate-pulse rounded-lg bg-white/8" />
          {/* sub-copy */}
          <div className="mt-1 h-4 w-80 animate-pulse rounded-full bg-white/8" />
          <div className="h-4 w-64 animate-pulse rounded-full bg-white/8" />
        </div>

        {/* ── Cards skeleton ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* ── CTA strip skeleton ── */}
        <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-64 animate-pulse rounded-lg bg-white/10" />
            <div className="h-4 w-80 animate-pulse rounded-full bg-white/8" />
          </div>
          <div className="h-11 w-40 animate-pulse rounded-xl bg-white/10" />
        </div>
      </div>
    </section>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
      {/* Icon + tagline row */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-white/10" />
        <div className="h-6 w-28 animate-pulse rounded-full bg-white/10" />
      </div>

      {/* Title */}
      <div className="mb-2 h-7 w-28 animate-pulse rounded-lg bg-white/10" />

      {/* Duration + seats meta */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-3.5 w-14 animate-pulse rounded-full bg-white/10" />
        <div className="h-3 w-px bg-white/15" />
        <div className="h-3.5 w-24 animate-pulse rounded-full bg-white/8" />
      </div>

      {/* Price badge */}
      <div className="mb-4 h-12 animate-pulse rounded-xl bg-white/8" />

      {/* Description lines */}
      <div className="mb-5 flex flex-1 flex-col gap-2">
        <div className="h-3.5 w-full animate-pulse rounded-full bg-white/8" />
        <div className="h-3.5 w-[90%] animate-pulse rounded-full bg-white/8" />
        <div className="h-3.5 w-[80%] animate-pulse rounded-full bg-white/8" />
        <div className="h-3.5 w-[70%] animate-pulse rounded-full bg-white/8" />
      </div>

      {/* Divider */}
      <div className="mb-5 h-px bg-white/8" />

      {/* Highlights — 4 rows */}
      <ul className="mb-6 flex flex-col gap-2.5">
        {Array.from({ length: 4 }).map((_, j) => (
          <li key={j} className="flex items-center gap-2.5">
            <div className="h-3.5 w-3.5 shrink-0 animate-pulse rounded-full bg-white/10" />
            <div
              className="h-3 animate-pulse rounded-full bg-white/8"
              style={{ width: `${68 + j * 6}%` }}
            />
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <div className="mt-auto h-11 animate-pulse rounded-xl bg-white/8" />

      {/* Bottom accent bar */}
      <div className="mt-4 h-0.75 w-10 rounded-full bg-white/10" />
    </div>
  );
}
