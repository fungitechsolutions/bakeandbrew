function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gradient-to-r from-[#1a1a1a]/6 via-[#1a1a1a]/10 to-[#1a1a1a]/6 bg-[length:400%_100%] ${className ?? ""}`}
      style={{
        animation: "shimmer 1.6s ease-in-out infinite",
      }}
    />
  );
}

function HeroSkeleton() {
  return (
    <div className="rounded-2xl bg-[#2f4e40]/10 p-6 md:p-8">
      <div className="flex items-start gap-5 mb-6">
        <Shimmer className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shrink-0" />
        <div className="flex-1 pt-1">
          <Shimmer className="h-7 w-48 mb-2" />
          <Shimmer className="h-4 w-32 mb-1" />
          <Shimmer className="h-3 w-40" />
        </div>
      </div>
      <div className="h-px bg-[#1a1a1a]/8 my-4" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Shimmer className="w-4 h-4 mt-0.5 rounded shrink-0" />
            <div className="flex-1">
              <Shimmer className="h-2.5 w-16 mb-1.5" />
              <Shimmer className="h-3.5 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div>
      <Shimmer className="h-4 w-36 mb-4" />
      <div className="grid grid-cols-3 gap-4 mb-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#1a1a1a]/8 p-5">
            <Shimmer className="h-3 w-20 mb-3" />
            <Shimmer className="h-7 w-32 mb-1.5" />
            <Shimmer className="h-2.5 w-24" />
          </div>
        ))}
      </div>
      <Shimmer className="h-2 w-full rounded-full" />
    </div>
  );
}

function CoursesSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Shimmer className="h-4 w-36" />
        <Shimmer className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl border border-[#1a1a1a]/8"
          >
            <Shimmer className="w-10 h-10 rounded-lg shrink-0" />
            <div className="flex-1">
              <Shimmer className="h-4 w-48 mb-1.5" />
              <Shimmer className="h-3 w-32" />
            </div>
            <Shimmer className="w-16 h-6 rounded-full hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Shimmer className="h-4 w-36" />
        <Shimmer className="h-6 w-28 rounded-full" />
      </div>
      <div className="rounded-xl border border-[#1a1a1a]/8 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border-b border-[#1a1a1a]/5 last:border-0"
          >
            <Shimmer className="w-8 h-8 rounded-lg hidden sm:block shrink-0" />
            <div className="flex-1">
              <Shimmer className="h-5 w-24 rounded-full mb-1.5" />
              <Shimmer className="h-3 w-36" />
            </div>
            <Shimmer className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Page title */}
        <div>
          <Shimmer className="h-7 w-48 mb-2" />
          <Shimmer className="h-3.5 w-64" />
        </div>

        <HeroSkeleton />
        <StatsSkeleton />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CoursesSkeleton />
          <CoursesSkeleton />
        </div>

        <PaymentsSkeleton />
      </div>
    </>
  );
}
