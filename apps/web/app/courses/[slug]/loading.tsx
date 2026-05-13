export default function Loading() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--brand-cream, #fbfaf7)" }}
    >
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden px-6 pb-20 pt-30"
        style={{ backgroundColor: "var(--brand-green, #2f4e40)" }}
      >
        {/* Dot texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative mx-auto max-w-6xl">
          {/* Badge row */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />
            <div className="h-7 w-36 animate-pulse rounded-full bg-white/10" />
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-end">
            {/* Left: title + description + CTAs */}
            <div>
              {/* H1 line 1 */}
              <div className="mb-3 h-12 w-48 animate-pulse rounded-xl bg-white/10" />
              {/* H1 line 2 italic */}
              <div className="mb-5 h-10 w-64 animate-pulse rounded-xl bg-white/8" />

              {/* Description lines */}
              <div className="mb-2 h-4 w-full animate-pulse rounded-full bg-white/8" />
              <div className="mb-2 h-4 w-[90%] animate-pulse rounded-full bg-white/8" />
              <div className="mb-8 h-4 w-[75%] animate-pulse rounded-full bg-white/8" />

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <div className="h-12 w-36 animate-pulse rounded-xl bg-white/10" />
                <div className="h-12 w-44 animate-pulse rounded-xl bg-white/8" />
              </div>
            </div>

            {/* Right: 4 meta cards */}
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm"
                >
                  <div className="mb-2 h-4 w-4 animate-pulse rounded-full bg-white/10" />
                  <div className="mb-1.5 h-3 w-16 animate-pulse rounded-full bg-white/8" />
                  <div className="h-4 w-24 animate-pulse rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Overview ── */}
      <section
        className="px-6 py-20"
        style={{ backgroundColor: "var(--brand-cream, #fbfaf7)" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_400px]">
            {/* Left: description */}
            <div>
              {/* Section label */}
              <div className="mb-3 h-3 w-32 animate-pulse rounded-full bg-black/10" />
              {/* Heading */}
              <div className="mb-2 h-8 w-64 animate-pulse rounded-xl bg-black/8" />
              <div className="mb-6 h-8 w-48 animate-pulse rounded-xl bg-black/6" />

              {/* Body copy */}
              <div className="flex flex-col gap-2">
                {[100, 95, 88, 92, 80, 70].map((w, i) => (
                  <div
                    key={i}
                    className="h-4 animate-pulse rounded-full bg-black/6"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>

              {/* Tuition callout */}
              <div className="mt-10 h-16 w-72 animate-pulse rounded-2xl bg-black/6" />
            </div>

            {/* Right: outcomes card */}
            <div className="rounded-2xl border border-black/7 bg-[#f3f1eb] p-7">
              {/* Card header */}
              <div className="mb-5 flex items-center gap-2.5">
                <div className="h-4.5 w-4.5 animate-pulse rounded-full bg-black/10" />
                <div className="h-4 w-36 animate-pulse rounded-full bg-black/10" />
              </div>

              {/* Outcome rows */}
              <ul className="flex flex-col gap-3.5">
                {[85, 70, 90, 75, 80].map((w, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 h-4 w-4 shrink-0 animate-pulse rounded-full bg-black/10" />
                    <div
                      className="h-3.5 animate-pulse rounded-full bg-black/8"
                      style={{ width: `${w}%` }}
                    />
                  </li>
                ))}
              </ul>

              {/* Start dates */}
              <div className="mt-7 border-t border-black/7 pt-6">
                <div className="mb-3 h-3 w-40 animate-pulse rounded-full bg-black/10" />
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-3.5 w-32 animate-pulse rounded-full bg-black/8" />
                      {i === 0 && (
                        <div className="h-5 w-20 animate-pulse rounded-full bg-black/8" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section className="px-6 py-20" style={{ backgroundColor: "#f3f1eb" }}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-3 h-3 w-24 animate-pulse rounded-full bg-black/10" />
          <div className="mb-12 h-8 w-48 animate-pulse rounded-xl bg-black/8" />

          {/* Accordion rows */}
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-black/7 bg-white/60 px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-6 w-14 animate-pulse rounded-full bg-black/8" />
                  <div
                    className="h-4 animate-pulse rounded-full bg-black/8"
                    style={{ width: `${120 + i * 20}px` }}
                  />
                </div>
                <div className="h-5 w-5 animate-pulse rounded-full bg-black/8" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video ── */}
      <section
        className="px-6 py-20"
        style={{ backgroundColor: "var(--brand-cream, #fbfaf7)" }}
      >
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-10 flex flex-col items-center gap-3">
            <div className="h-3 w-28 animate-pulse rounded-full bg-black/10" />
            <div className="h-8 w-56 animate-pulse rounded-xl bg-black/8" />
          </div>
          {/* Video player placeholder */}
          <div className="aspect-video w-full animate-pulse rounded-2xl bg-black/8" />
        </div>
      </section>

      {/* ── Instructor ── */}
      <section className="px-6 py-20" style={{ backgroundColor: "#f3f1eb" }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 h-3 w-28 animate-pulse rounded-full bg-black/10" />
          <div className="mt-10 grid grid-cols-1 items-center gap-12 sm:grid-cols-[220px_1fr]">
            {/* Avatar column */}
            <div className="flex flex-col items-center gap-4 sm:items-start">
              <div className="h-44 w-44 animate-pulse rounded-2xl bg-black/8" />
              <div className="flex flex-col gap-2">
                <div className="h-5 w-32 animate-pulse rounded-full bg-black/10" />
                <div className="h-3.5 w-40 animate-pulse rounded-full bg-black/8" />
              </div>
            </div>

            {/* Bio column */}
            <div className="flex flex-col gap-2">
              {[100, 92, 96, 85, 78, 65].map((w, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded-full bg-black/8"
                  style={{ width: `${w}%` }}
                />
              ))}
              {/* Experience badge */}
              <div className="mt-4 flex items-center gap-3">
                <div className="h-4 w-4 animate-pulse rounded-full bg-black/10" />
                <div className="h-4 w-48 animate-pulse rounded-full bg-black/8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section
        className="px-6 py-20"
        style={{ backgroundColor: "var(--brand-cream, #fbfaf7)" }}
      >
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-3 flex justify-center">
            <div className="h-3 w-32 animate-pulse rounded-full bg-black/10" />
          </div>
          <div className="mb-12 flex justify-center">
            <div className="h-8 w-40 animate-pulse rounded-xl bg-black/8" />
          </div>

          {/* FAQ accordion rows */}
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl border border-black/7 bg-white/60 px-5 py-4"
              >
                <div
                  className="h-4 animate-pulse rounded-full bg-black/8"
                  style={{ width: `${55 + i * 8}%` }}
                />
                <div className="h-5 w-5 animate-pulse rounded-full bg-black/8" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className="px-6 pb-24 pt-4"
        style={{ backgroundColor: "var(--brand-cream, #fbfaf7)" }}
      >
        <div
          className="mx-auto max-w-5xl overflow-hidden rounded-3xl"
          style={{ backgroundColor: "var(--brand-green, #2f4e40)" }}
        >
          {/* Accent bar */}
          <div className="h-1 w-full animate-pulse bg-white/20" />
          <div className="px-8 py-12 sm:px-14 sm:py-14">
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
              {/* Text */}
              <div className="flex flex-col gap-3">
                <div className="h-8 w-64 animate-pulse rounded-xl bg-white/10" />
                <div className="h-8 w-48 animate-pulse rounded-xl bg-white/8" />
                <div className="h-4 w-56 animate-pulse rounded-full bg-white/8" />
              </div>
              {/* Buttons */}
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <div className="h-12 w-36 animate-pulse rounded-xl bg-white/10" />
                <div className="h-12 w-40 animate-pulse rounded-xl bg-white/8" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
