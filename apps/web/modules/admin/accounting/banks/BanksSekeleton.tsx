"use client";

import { PER_PAGE } from "./mock-api";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-stone-200 ${className}`} />;
}

export function BankSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SkeletonBlock className="h-7 w-44" />
        <SkeletonBlock className="h-9 w-32 rounded-lg" />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-sm">
        {/* Thead */}
        <div className="grid grid-cols-[1fr_90px_160px_80px] gap-4 px-5 py-3 bg-stone-50 border-b border-stone-200">
          {["w-24", "w-16", "w-20", "w-12"].map((w, i) => (
            <SkeletonBlock key={i} className={`h-3 ${w}`} />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: PER_PAGE }, (_, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_90px_160px_80px] gap-4 items-center px-5 py-4 border-b border-stone-100 last:border-0"
          >
            <SkeletonBlock className="h-4 w-3/4" />
            <SkeletonBlock className="h-5 w-16 rounded-full" />
            <SkeletonBlock className="h-3 w-4/5" />
            <SkeletonBlock className="h-7 w-16 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
