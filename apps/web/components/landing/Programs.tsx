import Link from "next/link";
import {
  Coffee,
  CroissantIcon,
  GlassWater,
  CheckCircle2,
  ArrowRight,
  // UtensilsCrossed,
} from "lucide-react";
import { CoursesList } from "@repo/types";

const programs = [
  {
    course: "Barista",
    slug: "barista",
    tagline: "The Art of Coffee",
    description:
      "Master espresso extraction, milk texturing, latte art, and cafe workflow. From bean origin to the perfect cup — passion turned into craft.",
    highlights: [
      "Espresso theory & extraction",
      "Milk steaming & latte art",
      "Cafe equipment handling",
      "Customer service & menu design",
    ],
    duration: "4 Weeks",
    seats: 16,
    icon: Coffee,
    color: "#E8552A",
    accentAlpha: "rgba(232,85,42,0.12)",
    accentBorder: "rgba(232,85,42,0.28)",
    number: "01",
  },
  {
    course: "Bakery",
    slug: "bakery",
    tagline: "From Flour to Showpiece",
    description:
      "Classical and contemporary baking — breads, pastries, cakes — with hands-on sessions in a fully equipped bakery lab.",
    highlights: [
      "Bread & sourdough making",
      "Pastry & viennoiserie",
      "Cake decoration techniques",
      "Food costing & production",
    ],
    duration: "4 Weeks",
    seats: 14,
    icon: CroissantIcon,
    color: "#D4A55A",
    accentAlpha: "rgba(212,165,90,0.12)",
    accentBorder: "rgba(212,165,90,0.28)",
    number: "02",
  },
  {
    course: "Bartending",
    slug: "bartending",
    tagline: "Craft Behind the Bar",
    description:
      "Classic cocktails to modern mixology — flair techniques, bar management, and the science of flavour pairing.",
    highlights: [
      "Classic & craft cocktails",
      "Spirits & beverage knowledge",
      "Bar operations & hygiene",
      "Responsible alcohol service",
    ],
    duration: "4 Weeks",
    seats: 18,
    icon: GlassWater,
    color: "#9B7FC7",
    accentAlpha: "rgba(155,127,199,0.12)",
    accentBorder: "rgba(155,127,199,0.28)",
    number: "03",
  },
  // {
  //   course: "Sushi",
  //   slug: "sushi",
  //   tagline: "Japanese Culinary Tradition",
  //   description:
  //     "Precision and philosophy behind Japanese cuisine — rice prep, fish butchery, nigiri, maki, and omakase plating standards.",
  //   highlights: [
  //     "Sushi rice & seasoning",
  //     "Fish filleting & food safety",
  //     "Nigiri, maki & temaki",
  //     "Plating & omakase culture",
  //   ],
  //   duration: "4 Weeks",
  //   seats: 12,
  //   icon: UtensilsCrossed,
  //   color: "#4EA87A",
  //   accentAlpha: "rgba(78,168,122,0.12)",
  //   accentBorder: "rgba(78,168,122,0.28)",
  //   number: "04",
  // },
] as const;

export default async function Programs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Failed to fetch courses data");
  const data = (await res.json()) as CoursesList;
  if (!data.success) throw new Error(data.message);
  const courses = data.data;

  return (
    <section
      id="programs"
      className="relative w-full overflow-hidden px-6 py-24"
      style={{ background: "#1e3328" }}
    >
      {/* Subtle dot texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.018' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-320">
        {/* ── Header ── */}
        <div className="mb-20">
          <span
            className="mb-4 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.18em]"
            style={{
              color: "rgba(194,138,79,0.7)",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            Our Courses
          </span>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2
              className="text-[clamp(2rem,4vw,2.6rem)] font-bold leading-[1.15] text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Courses That Build
              <br />
              <em
                className="font-medium"
                style={{ color: "#c2a06a", fontStyle: "italic" }}
              >
                Real Careers
              </em>
            </h2>
            <p
              className="max-w-xs text-[0.88rem] leading-[1.7] sm:text-right"
              style={{
                color: "rgba(255,255,255,0.42)",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              Practical training taught by working professionals — graduate
              job-ready, not just certified.
            </p>
          </div>
        </div>

        {/* ── Program rows ── */}
        <div className="flex flex-col">
          {programs.map((program, idx) => {
            const Icon = program.icon;
            const courseData = courses.find(
              (c) => c.name === program.course.toLowerCase(),
            );
            const isLast = idx === programs.length - 1;

            return (
              <div key={program.course} className="group relative">
                {/* Row */}
                <div
                  className="grid grid-cols-1 gap-8 py-10 transition-all duration-300 lg:grid-cols-[1fr_1.1fr_auto]"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.07)",
                    borderBottom: isLast
                      ? "1px solid rgba(255,255,255,0.07)"
                      : "none",
                  }}
                >
                  {/* ── Left: identity ── */}
                  <div className="flex flex-col justify-between gap-6">
                    <div>
                      {/* Number + icon row */}
                      <div className="mb-5 flex items-center gap-4">
                        <span
                          className="font-mono text-[0.65rem] font-semibold tracking-widest"
                          style={{
                            color: "rgba(255,255,255,0.2)",
                            fontFamily: "var(--font-dm-sans)",
                          }}
                        >
                          {program.number}
                        </span>
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{
                            background: program.accentAlpha,
                            border: `1px solid ${program.accentBorder}`,
                          }}
                        >
                          <Icon
                            className="h-[18px] w-[18px]"
                            strokeWidth={1.75}
                            style={{ color: program.color }}
                          />
                        </div>
                        {/* tagline pill */}
                        <span
                          className="rounded-full px-3 py-1 text-[0.68rem] font-semibold tracking-wide"
                          style={{
                            background: program.accentAlpha,
                            border: `1px solid ${program.accentBorder}`,
                            color: program.color,
                            fontFamily: "var(--font-dm-sans)",
                          }}
                        >
                          {program.tagline}
                        </span>
                      </div>

                      {/* Course name */}
                      <h3
                        className="mb-3 text-[2rem] font-bold leading-[1.1] text-white"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {program.course}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-[0.86rem] leading-[1.7]"
                        style={{
                          color: "rgba(255,255,255,0.45)",
                          fontFamily: "var(--font-dm-sans)",
                        }}
                      >
                        {program.description}
                      </p>
                    </div>

                    {/* Meta pills */}
                    <div className="flex items-center gap-3">
                      <span
                        className="rounded-full px-3 py-1 text-[0.72rem] font-medium"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.5)",
                          fontFamily: "var(--font-dm-sans)",
                        }}
                      >
                        {program.duration}
                      </span>
                      <span
                        className="rounded-full px-3 py-1 text-[0.72rem] font-medium"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.5)",
                          fontFamily: "var(--font-dm-sans)",
                        }}
                      >
                        Max {program.seats} students
                      </span>
                    </div>
                  </div>

                  {/* ── Middle: highlights ── */}
                  <div className="flex flex-col justify-center">
                    <p
                      className="mb-4 text-[0.68rem] font-semibold uppercase tracking-widest"
                      style={{
                        color: "rgba(255,255,255,0.25)",
                        fontFamily: "var(--font-dm-sans)",
                      }}
                    >
                      What you&apos;ll learn
                    </p>
                    <ul className="flex flex-col gap-3">
                      {program.highlights.map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <span
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                            style={{ background: program.accentAlpha }}
                          >
                            <CheckCircle2
                              className="h-3 w-3"
                              strokeWidth={2.5}
                              style={{ color: program.color }}
                            />
                          </span>
                          <span
                            className="text-[0.86rem]"
                            style={{
                              color: "rgba(255,255,255,0.6)",
                              fontFamily: "var(--font-dm-sans)",
                            }}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ── Right: price + CTA ── */}
                  <div className="flex flex-col items-start justify-between gap-6 lg:items-end">
                    {/* Price block */}
                    {courseData ? (
                      <div className="text-left lg:text-right">
                        <p
                          className="mb-1 text-[0.65rem] font-semibold uppercase tracking-widest"
                          style={{
                            color: "rgba(255,255,255,0.28)",
                            fontFamily: "var(--font-dm-sans)",
                          }}
                        >
                          Course fee
                        </p>
                        <div className="flex items-baseline gap-1.5 lg:justify-end">
                          <span
                            className="text-[0.78rem] font-medium"
                            style={{
                              color: "rgba(255,255,255,0.35)",
                              fontFamily: "var(--font-dm-sans)",
                            }}
                          >
                            NPR
                          </span>
                          <span
                            className="text-[2.2rem] font-bold leading-none tracking-tight"
                            style={{
                              color: program.color,
                              fontFamily: "var(--font-lora)",
                            }}
                          >
                            {(courseData.fee / 100).toLocaleString()}
                          </span>
                        </div>
                        <p
                          className="mt-1 text-[0.68rem]"
                          style={{
                            color: "rgba(255,255,255,0.25)",
                            fontFamily: "var(--font-dm-sans)",
                          }}
                        >
                          Pricing inclusive of VAT
                        </p>
                      </div>
                    ) : (
                      <div className="text-left lg:text-right">
                        <p
                          className="text-[0.75rem]"
                          style={{
                            color: "rgba(255,255,255,0.28)",
                            fontFamily: "var(--font-dm-sans)",
                          }}
                        >
                          Contact us for pricing
                        </p>
                      </div>
                    )}

                    {/* CTA */}
                    <Link
                      href={`/courses/${program.slug}`}
                      className="group/btn flex items-center gap-2 rounded-xl px-5 py-3 text-[0.82rem] font-semibold text-white transition-all duration-200 hover:-translate-y-[1px]"
                      style={{
                        background: program.accentAlpha,
                        border: `1px solid ${program.accentBorder}`,
                        color: program.color,
                        fontFamily: "var(--font-dm-sans)",
                      }}
                    >
                      View Program
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5"
                        strokeWidth={2.5}
                      />
                    </Link>
                  </div>
                </div>

                {/* Hover accent line */}
                <div
                  className="pointer-events-none absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ background: program.color, opacity: 0.35 }}
                />
              </div>
            );
          })}
        </div>

        {/* ── CTA strip ── */}
        <div
          className="mt-16 flex flex-col items-start justify-between gap-5 rounded-2xl p-6 sm:flex-row sm:items-center sm:p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div>
            <p
              className="mb-1 text-[1.05rem] font-semibold text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Not sure which course is right for you?
            </p>
            <p
              className="text-[0.88rem]"
              style={{
                color: "rgba(255,255,255,0.42)",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              Send us an inquiry and our team will guide you through the
              options.
            </p>
          </div>
          <Link
            href="#inquiry"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-[0.875rem] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "var(--brand-brown)",
              boxShadow: "0 4px 20px rgba(194,138,79,0.25)",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            Talk to an Advisor
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
