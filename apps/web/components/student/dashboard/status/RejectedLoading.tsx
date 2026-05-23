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

export default function RejectedLoading() {
  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-[#fbfaf7] px-6 py-20 sm:px-10 lg:px-16">
      <style>{`
        @keyframes sk-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Left accent rule — green tint (rejected uses green not brown) */}
      <div
        className="pointer-events-none fixed bottom-0 left-6 top-0 z-0 w-px sm:left-10 lg:left-16"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(47,78,64,0.15) 20%, rgba(47,78,64,0.15) 80%, transparent)",
        }}
      />

      <div className="relative z-10 w-full max-w-xl">
        {/* Eyebrow — static dot + label + rule */}
        <div className="mb-10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#1a1a1a]/20 shrink-0" />
          <S className="h-2.5 w-44" />
          <div className="h-px w-8 shrink-0 bg-[#1a1a1a]/8" />
        </div>

        {/* Headline */}
        <S className="h-11 w-72 mb-5 sm:h-12" />

        {/* Sub copy — italic lora, 3 lines */}
        <div className="space-y-2 max-w-md mb-7">
          <S className="h-4 w-full" />
          <S className="h-4 w-full" />
          <S className="h-4 w-3/5" />
        </div>

        {/* Decision meta */}
        <div className="flex items-center gap-3 mb-5">
          <S className="h-2.5 w-24" />
          <div className="h-px w-4 shrink-0 bg-[#1a1a1a]/10" />
          <S className="h-3.5 w-36" />
        </div>

        {/* Rejection reason block (optional but always skeleton it) */}
        <div className="space-y-2 mb-10">
          <S className="h-2.5 w-28" />
          <S className="h-3.5 w-full max-w-md" />
          <S className="h-3.5 w-3/4 max-w-md" />
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#1a1a1a]/10 mb-10" />

        {/* Section label */}
        <S className="h-2.5 w-20 mb-8" />

        {/* Action rows — 3 items, each: big ghost number + label + desc + bottom border */}
        <div className="flex flex-col">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[2.5rem_1fr] gap-x-5">
              {/* Ghost index number */}
              <S className="h-8 w-8 rounded mt-0.5" />

              {/* Text block */}
              <div
                className={`pb-6 pt-0.5 space-y-2 ${i < 2 ? "border-b border-[#1a1a1a]/8" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <S className="h-3 w-32" />
                  <S className="w-3.5 h-3.5 rounded shrink-0 mt-0.5" />
                </div>
                <S className="h-3.5 w-full" />
                <S className="h-3.5 w-4/5" />
              </div>
            </div>
          ))}
        </div>

        {/* Quote block */}
        <div className="mt-10 space-y-2">
          <S className="h-3.5 w-full max-w-sm" />
          <S className="h-3.5 w-4/5 max-w-sm" />
          <S className="h-3 w-40 mt-2" />
        </div>

        {/* Footer */}
        <div className="mt-14 flex items-center gap-2 flex-wrap">
          <S className="h-3 w-36" />
          <S className="h-3 w-28" />
          <S className="h-3 w-28" />
        </div>
      </div>
    </div>
  );
}
