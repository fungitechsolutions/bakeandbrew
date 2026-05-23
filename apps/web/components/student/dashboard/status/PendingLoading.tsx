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

export default function PendingLoading() {
  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-[#fbfaf7] px-6 py-20 sm:px-10 lg:px-16">
      <style>{`
        @keyframes sk-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Left accent rule */}
      <div
        className="pointer-events-none fixed bottom-0 left-6 top-0 z-0 w-px sm:left-10 lg:left-16"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(194,138,79,0.2) 20%, rgba(194,138,79,0.2) 80%, transparent)",
        }}
      />

      <div className="relative z-10 w-full max-w-xl">
        {/* Eyebrow — dot + label + rule */}
        <div className="mb-10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#c28a4f]/30 shrink-0" />
          <S className="h-2.5 w-36" />
          <div className="h-px w-8 shrink-0 bg-[#1a1a1a]/8" />
        </div>

        {/* Headline — two lines like "Hang tight, Priya." */}
        <div className="space-y-3 mb-5">
          <S className="h-11 w-64 sm:h-12" />
        </div>

        {/* Sub copy — italic lora, ~2 lines */}
        <div className="space-y-2 max-w-md mb-7">
          <S className="h-4 w-full" />
          <S className="h-4 w-5/6" />
          <S className="h-4 w-4/6" />
        </div>

        {/* Submitted meta — label + dash + date */}
        <div className="flex items-center gap-3 mb-10">
          <S className="h-2.5 w-20" />
          <div className="h-px w-4 shrink-0 bg-[#1a1a1a]/10" />
          <S className="h-3.5 w-40" />
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#c28a4f]/18 mb-10" />

        {/* Section label */}
        <S className="h-2.5 w-24 mb-8" />

        {/* Timeline — 4 items */}
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[2.5rem_1fr] gap-x-5">
              {/* Left col: dot + connector */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#1a1a1a]/8 shrink-0" />
                {i < 3 && (
                  <div
                    className="mt-1 w-px flex-1 bg-[#1a1a1a]/8"
                    style={{ minHeight: "2rem" }}
                  />
                )}
              </div>

              {/* Right col: label + desc */}
              <div className={`pt-0.5 ${i < 3 ? "pb-8" : "pb-0"} space-y-2`}>
                <S className="h-3 w-36" />
                <S className="h-3.5 w-full" />
                <S className="h-3.5 w-4/5" />
              </div>
            </div>
          ))}
        </div>

        {/* Inbox nudge */}
        <S className="h-3.5 w-80 max-w-full mt-2 mb-10" />

        {/* CTA — "Back to Home" link */}
        <div className="flex items-center gap-2">
          <S className="w-4 h-4 rounded" />
          <S className="h-3.5 w-24" />
        </div>

        {/* Footer */}
        <div className="mt-14 flex items-center gap-1.5">
          <S className="h-3 w-52" />
          <S className="h-3 w-40" />
        </div>
      </div>
    </div>
  );
}
