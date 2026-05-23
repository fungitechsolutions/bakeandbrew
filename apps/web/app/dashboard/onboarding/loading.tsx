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
    <div className="min-h-screen bg-[#fbfaf7] flex flex-col">
      <style>{`
        @keyframes sk-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-[#1a1a1a]/6 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <S className="w-8 h-8 rounded-lg" />
          <S className="h-4 w-32" />
        </div>
        <S className="h-3 w-40 hidden sm:block" />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Step indicator */}
          <div className="flex items-center w-full max-w-sm mx-auto mb-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <S className="w-9 h-9 rounded-xl" />
                  <S className="h-2.5 w-14" />
                </div>
                {i < 2 && (
                  <div className="flex-1 mx-2 mb-5">
                    <S className="h-0.5 w-full rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div
            className="rounded-2xl bg-white overflow-hidden"
            style={{
              border: "1px solid rgba(26,26,26,0.08)",
              boxShadow:
                "0 1px 3px rgba(26,26,26,0.06), 0 12px 40px rgba(26,26,26,0.09)",
            }}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-[#1a1a1a]/8" />

            <div className="p-8 space-y-6">
              {/* Icon + heading */}
              <div className="flex items-start gap-4">
                <S className="w-12 h-12 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <S className="h-5 w-48" />
                  <S className="h-3.5 w-full" />
                  <S className="h-3.5 w-3/4" />
                </div>
              </div>

              <div className="h-px bg-[#1a1a1a]/6" />

              {/* Steps */}
              <div className="space-y-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <S className="w-5 h-3.5 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1.5">
                      <S className="h-4 w-40" />
                      <S className="h-3 w-full" />
                      <S className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <S className="h-12 w-full rounded-xl" />
            </div>
          </div>

          {/* Help note */}
          <div className="flex justify-center gap-2 mt-6">
            <S className="h-3 w-20" />
            <S className="h-3 w-28" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a]/6 px-6 py-4 flex justify-center">
        <S className="h-3 w-56" />
      </footer>
    </div>
  );
}
