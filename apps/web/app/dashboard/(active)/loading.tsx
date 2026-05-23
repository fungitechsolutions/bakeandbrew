const shimmerStyle = {
  background:
    "linear-gradient(90deg, rgba(26,26,26,0.06) 0%, rgba(26,26,26,0.1) 50%, rgba(26,26,26,0.06) 100%)",
  backgroundSize: "200% 100%",
  animation: "sk-shimmer 1.5s ease-in-out infinite",
} as const;

function S({ className }: { className?: string }) {
  return (
    <div className={`rounded-lg ${className ?? ""}`} style={shimmerStyle} />
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <style>{`
        @keyframes sk-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-2">
            <S className="h-7 w-44" />
            <S className="h-3.5 w-64" />
          </div>
        </div>

        <div className="space-y-8">
          {/* StudentHero skeleton */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: "#fbfaf7",
              border: "1px solid rgba(26,26,26,0.08)",
              boxShadow:
                "0 1px 3px rgba(26,26,26,0.06), 0 8px 32px rgba(26,26,26,0.08)",
            }}
          >
            {/* Left strip */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
              style={{
                background:
                  "linear-gradient(to bottom, #2f4e40, #3a5a49, rgba(47,78,64,0.3))",
              }}
            />
            <div className="relative pl-7 md:pl-9">
              <div className="px-5 pt-6 pb-5 md:px-7 md:pt-7">
                <div className="flex items-start gap-5">
                  <S className="w-20 h-20 md:w-[88px] md:h-[88px] rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2.5 pt-1">
                    <S className="h-3 w-24" />
                    <S className="h-8 w-52" />
                    <S className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="hidden sm:flex flex-col gap-2 shrink-0">
                    <S className="h-7 w-32 rounded-lg" />
                    <S className="h-7 w-28 rounded-lg" />
                  </div>
                </div>
              </div>
              <div className="mx-5 md:mx-7 h-px bg-[#1a1a1a]/[0.07]" />
              <div className="p-5 md:p-7 grid grid-cols-2 lg:grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="p-3 space-y-1.5">
                    <S className="h-2.5 w-14" />
                    <S className="h-4 w-28" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FinancialSummary skeleton */}
          <div className="space-y-4">
            <S className="h-4 w-40" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#1a1a1a]/8 p-5 space-y-3"
                >
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <S className="h-2.5 w-20" />
                      <S className="h-7 w-28" />
                      <S className="h-2.5 w-20" />
                    </div>
                    <S className="w-9 h-9 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <S className="h-3 w-28" />
                <S className="h-3 w-8" />
              </div>
              <S className="h-2 w-full rounded-full" />
            </div>
          </div>

          {/* Courses + Help row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Courses */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <S className="h-4 w-36" />
                <S className="h-6 w-20 rounded-full" />
              </div>
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3.5 p-4 rounded-xl border border-[#1a1a1a]/8 bg-white"
                >
                  <S className="w-10 h-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <S className="h-4 w-44" />
                    <S className="h-3 w-28" />
                  </div>
                </div>
              ))}
            </div>

            {/* Help card */}
            <div className="rounded-xl border border-[#1a1a1a]/8 bg-white p-5 space-y-4">
              <S className="h-4 w-24 mb-2" />
              <div className="space-y-1.5">
                <S className="h-3 w-20" />
                <S className="h-4 w-36" />
                <S className="h-4 w-44" />
              </div>
              <div className="h-px bg-[#1a1a1a]/6" />
              <div className="space-y-1.5">
                <S className="h-3 w-24" />
                <S className="h-4 w-40" />
              </div>
              <div className="h-px bg-[#1a1a1a]/6" />
              <div className="space-y-1.5">
                <S className="h-3 w-16" />
                <S className="h-4 w-48" />
              </div>
            </div>
          </div>

          {/* PaymentHistory skeleton */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <S className="h-4 w-36" />
              <S className="h-6 w-28 rounded-full" />
            </div>
            <div className="rounded-xl border border-[#1a1a1a]/8 bg-white overflow-hidden divide-y divide-[#1a1a1a]/5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 p-4"
                >
                  <S className="w-8 h-8 rounded-lg hidden sm:block" />
                  <div className="space-y-1.5">
                    <S className="h-5 w-24 rounded-full" />
                    <S className="h-3 w-40" />
                  </div>
                  <S className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-[#1a1a1a]/6 flex justify-center">
          <S className="h-3 w-64" />
        </div>
      </div>
    </div>
  );
}
