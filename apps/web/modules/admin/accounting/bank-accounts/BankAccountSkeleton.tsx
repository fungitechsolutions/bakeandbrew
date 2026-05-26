"use client";

import { PER_PAGE } from "./mock-api";

function Pulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-stone-200 ${className}`} />;
}

export function BankAccountSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Pulse className="h-7 w-52" />
        <Pulse className="h-9 w-36 rounded-lg" />
      </div>

      <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-sm">
        {/* thead */}
        <div className="grid grid-cols-[1fr_160px_140px_90px_80px] gap-4 px-5 py-3 bg-stone-50 border-b border-stone-200">
          {["w-28", "w-24", "w-20", "w-16", "w-10"].map((w, i) => (
            <Pulse key={i} className={`h-3 ${w}`} />
          ))}
        </div>

        {Array.from({ length: PER_PAGE }, (_, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_160px_140px_90px_80px] gap-4 items-center px-5 py-4 border-b border-stone-100 last:border-0"
          >
            <div className="flex flex-col gap-1.5">
              <Pulse className="h-4 w-3/4" />
              <Pulse className="h-3 w-1/2" />
            </div>
            <Pulse className="h-3 w-4/5" />
            <Pulse className="h-3 w-2/3" />
            <Pulse className="h-5 w-14 rounded-full" />
            <Pulse className="h-7 w-16 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
