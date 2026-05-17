// components/admin/student-detail-skeleton.tsx
export function StudentDetailSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-[#f4f1ec] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Top bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#2d4a3e]/10" />
            <div className="flex flex-col gap-2">
              <div className="h-6 w-44 rounded-xl bg-[#2d4a3e]/12" />
              <div className="h-3.5 w-32 rounded-lg bg-[#2d4a3e]/07" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-20 rounded-full bg-[#2d4a3e]/08" />
            <div className="h-9 w-32 rounded-xl bg-[#2d4a3e]/12" />
            <div className="h-9 w-32 rounded-xl bg-[#2d4a3e]/08" />
          </div>
        </div>

        {/* Stat row */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
            >
              <div className="mb-2 h-2.5 w-16 rounded-md bg-[#2d4a3e]/10" />
              <div className="mb-1.5 h-5 w-28 rounded-lg bg-[#2d4a3e]/12" />
              <div className="h-2.5 w-14 rounded-md bg-[#2d4a3e]/07" />
            </div>
          ))}
        </div>

        {/* ── Main grid: 3 equal cols ── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* LEFT col — Discounts + Scholarship */}
          <div className="flex flex-col gap-5">
            {/* Discounts card */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/08" />
                  <div className="h-3.5 w-24 rounded-lg bg-[#2d4a3e]/10" />
                </div>
                <div className="h-7 w-14 rounded-lg bg-[#2d4a3e]/08" />
              </div>
              {/* Discount rows */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="mb-2 flex flex-col gap-2 rounded-xl border border-[#2d4a3e]/08 bg-[#f4f1ec]/50 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-16 rounded-md bg-[#e8552a]/15" />
                      <div className="h-4 w-8 rounded-md bg-[#2d4a3e]/10" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/07" />
                      <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/07" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-2.5 w-20 rounded-md bg-[#2d4a3e]/08" />
                    <div className="h-2.5 w-16 rounded-md bg-[#2d4a3e]/06" />
                  </div>
                </div>
              ))}
              {/* Total saved footer */}
              <div className="mt-3 flex items-center justify-between border-t border-[#2d4a3e]/08 pt-3">
                <div className="h-2.5 w-16 rounded-md bg-[#2d4a3e]/08" />
                <div className="h-4 w-24 rounded-md bg-[#e8552a]/15" />
              </div>
            </div>

            {/* Scholarship card */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/08" />
                <div className="h-3.5 w-28 rounded-lg bg-[#2d4a3e]/10" />
              </div>
              <div className="rounded-xl border border-[#2d4a3e]/08 bg-[#f4f1ec]/50 px-4 py-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="h-7 w-16 rounded-lg bg-[#2d4a3e]/12" />
                    <div className="h-3 w-24 rounded-md bg-[#2d4a3e]/08" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/07" />
                    <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/07" />
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-amber-50/60 px-3 py-2">
                  <div className="h-2.5 w-full rounded-md bg-amber-200/50" />
                </div>
                <div className="mt-2 h-2.5 w-32 rounded-md bg-[#2d4a3e]/06" />
              </div>
            </div>
          </div>

          {/* MIDDLE col — Personal Info + Guardian + Payments */}
          <div className="flex flex-col gap-5">
            {/* Personal info card */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/08" />
                  <div className="h-3.5 w-36 rounded-lg bg-[#2d4a3e]/10" />
                </div>
                {/* Edit icon */}
                <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/07" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex flex-col gap-1.5 ${i === 8 || i === 9 ? "col-span-2" : ""}`}
                  >
                    <div className="h-2.5 w-14 rounded-md bg-[#2d4a3e]/08" />
                    <div className="flex items-center gap-1.5">
                      <div className="h-3.5 w-3.5 shrink-0 rounded bg-[#2d4a3e]/07" />
                      <div
                        className="h-3.5 rounded-md bg-[#2d4a3e]/10"
                        style={{ width: `${80 + ((i * 29) % 70)}px` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guardian card */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/08" />
                  <div className="h-3.5 w-36 rounded-lg bg-[#2d4a3e]/10" />
                </div>
                <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/07" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="h-2.5 w-20 rounded-md bg-[#2d4a3e]/08" />
                    <div className="flex items-center gap-1.5">
                      <div className="h-3.5 w-3.5 shrink-0 rounded bg-[#2d4a3e]/07" />
                      <div className="h-3.5 w-28 rounded-md bg-[#2d4a3e]/10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payments card */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/08" />
                  <div className="h-3.5 w-32 rounded-lg bg-[#2d4a3e]/10" />
                </div>
                <div className="h-7 w-14 rounded-lg bg-[#2d4a3e]/08" />
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="mb-2 flex items-center justify-between rounded-xl border border-[#2d4a3e]/08 bg-[#f4f1ec]/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-green-100/70" />
                    <div className="flex flex-col gap-1.5">
                      <div className="h-3.5 w-24 rounded-md bg-[#2d4a3e]/10" />
                      <div className="h-2.5 w-36 rounded-md bg-[#2d4a3e]/07" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-12 rounded-md bg-[#2d4a3e]/06" />
                    <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/07" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT col — Courses + Enrollment + Notes */}
          <div className="flex flex-col gap-5">
            {/* Courses card */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/08" />
                <div className="h-3.5 w-28 rounded-lg bg-[#2d4a3e]/10" />
              </div>
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="mb-2 flex items-center justify-between rounded-xl border border-[#2d4a3e]/08 bg-[#f4f1ec]/50 px-4 py-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-[#e8552a]/30" />
                    <div className="h-3.5 w-20 rounded-md bg-[#2d4a3e]/10" />
                  </div>
                  <div className="h-3.5 w-16 rounded-md bg-[#2d4a3e]/08" />
                </div>
              ))}
              <div className="mt-3 flex items-center justify-between border-t border-[#2d4a3e]/08 pt-3">
                <div className="h-2.5 w-10 rounded-md bg-[#2d4a3e]/08" />
                <div className="h-4 w-20 rounded-md bg-[#2d4a3e]/10" />
              </div>
            </div>

            {/* Enrollment details card */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/08" />
                <div className="h-3.5 w-32 rounded-lg bg-[#2d4a3e]/10" />
              </div>
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-2.5 w-20 rounded-md bg-[#2d4a3e]/08" />
                    <div
                      className="h-3.5 rounded-md bg-[#2d4a3e]/10"
                      style={{ width: `${56 + ((i * 23) % 40)}px` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Notes card */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-[#2d4a3e]/08" />
                <div className="h-3.5 w-24 rounded-lg bg-[#2d4a3e]/10" />
              </div>
              <div className="rounded-xl bg-amber-50/60 px-4 py-3">
                <div className="mb-2 h-3 w-full rounded-md bg-amber-200/60" />
                <div className="mb-2 h-3 w-4/5 rounded-md bg-amber-200/60" />
                <div className="h-3 w-2/3 rounded-md bg-amber-200/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
