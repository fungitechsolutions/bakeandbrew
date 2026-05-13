"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { siteInfo } from "@/utils/site-info";
import { useAuthStore } from "@/store/auth";

interface StatItem {
  number: string;
  label: string;
}

interface Greeting {
  salutation: string;
  sub: string;
}

interface WelcomeBannerProps {
  userName: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): Greeting {
  const hour = new Date().getHours();
  if (hour < 12)
    return {
      salutation: "Good morning",
      sub: "Ready to brew something great today?",
    };
  if (hour < 17)
    return {
      salutation: "Good afternoon",
      sub: "Keep the momentum going — great work awaits.",
    };
  return {
    salutation: "Good evening",
    sub: "Wrapping up strong. Your progress matters.",
  };
}

function getFormattedDate(): { date: string; day: string; rest: string } {
  const now = new Date();
  return {
    date: String(now.getDate()).padStart(2, "0"),
    day: now.toLocaleDateString("en-US", { weekday: "long" }),
    rest: now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
}

// ─── StatPill ─────────────────────────────────────────────────────────────────

function StatPill({ number, label }: StatItem) {
  return (
    <div className="group flex flex-col items-center gap-0.5 rounded-xl border border-[--brand-green]/10 bg-[--brand-green]/5 px-4 py-2.5 cursor-default select-none transition-all duration-200 hover:border-[--brand-brown]/30 hover:bg-[--brand-brown]/8 hover:shadow-sm">
      <span className="font-playfair text-base font-bold text-[--brand-brown] transition-colors duration-200">
        {number}
      </span>
      <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-[--brand-green]/50">
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WelcomeBanner() {
  const user = useAuthStore((state) => state.user);
  const userName = user?.name;
  const [mounted, setMounted] = useState<boolean>(false);
  const firstName = (userName ?? "Student").split(" ")[0] ?? "Student";
  const greeting = getGreeting();
  const { date, day, rest } = getFormattedDate();
  const stats = siteInfo.stats as readonly StatItem[];

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      aria-label="Welcome banner"
      className="relative w-full overflow-hidden "
    >
      {/* ── Subtle warm mesh background ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 80% -10%, rgba(194,138,79,0.09) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at -10% 100%, rgba(47,78,64,0.07) 0%, transparent 60%)",
        }}
      />

      {/* ── Decorative vertical stripe ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 bottom-0 z-0 w-1 rounded-l-2xl bg-linear-to-b from-[--brand-brown]/60 via-[--brand-brown]/20 to-transparent"
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col gap-5 p-6 sm:p-8 lg:p-9">
        {/* Top row */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: greeting copy */}
          <div className="flex min-w-0 flex-col gap-2.5">
            {/* Eyebrow */}
            <div
              className={`flex items-center gap-2 transition-all duration-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
              style={{ transitionDelay: "0ms" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[--brand-brown] shadow-[0_0_0_3px_rgba(194,138,79,0.18)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[--brand-brown]">
                {siteInfo.admission.cycleLabel}&nbsp;·&nbsp;Student Portal
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`font-playfair text-3xl font-bold leading-tight text-[--brand-ink] transition-all duration-500 sm:text-4xl lg:text-[2.5rem] ${mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
              style={{ transitionDelay: "80ms" }}
            >
              {greeting.salutation},{" "}
              <span
                className="animate-wb-shimmer bg-clip-text text-transparent [background-size:200%_auto]"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg,#2f4e40 0%,#c28a4f 40%,#2f4e40 80%,#c28a4f 100%)",
                }}
              >
                {firstName}
              </span>{" "}
              <span aria-hidden="true">👋</span>
            </h1>

            {/* Subline */}
            {/* <p
              className={`font-dm-sans text-sm leading-relaxed text-[--brand-ink]/50 transition-all duration-500 sm:text-[15px] ${mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
              style={{ transitionDelay: "160ms" }}
            >
              {greeting.sub}
            </p> */}

            {/* Badge pills */}
            {/* <div
              className={`mt-1 flex flex-wrap items-center gap-2 transition-all duration-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
              style={{ transitionDelay: "240ms" }}
            >
              <div className="flex cursor-default select-none items-center gap-2 rounded-full border border-[--brand-green]/20 bg-[--brand-green]/8 px-3 py-1.5 transition-all duration-200 hover:border-[--brand-green]/40 hover:bg-[--brand-green]/12">
                <Image
                  src={siteInfo.assets.noBGLogo}
                  alt={siteInfo.company.shortName}
                  width={14}
                  height={14}
                  className="object-contain opacity-70"
                />
                <span className="text-[11px] font-semibold tracking-wide text-[--brand-green]">
                  {siteInfo.company.shortName}
                </span>
              </div>

              <div className="flex cursor-default select-none items-center gap-1.5 rounded-full border border-[--brand-green]/15 bg-emerald-50 px-3 py-1.5 transition-all duration-200 hover:bg-emerald-100/60">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-[11px] font-semibold tracking-wide text-emerald-700">
                  Live Session
                </span>
              </div>

              <div className="hidden cursor-default select-none items-center rounded-full border border-[--brand-brown]/15 bg-[--brand-brown]/6 px-3 py-1.5 md:flex">
                <span className="text-[11px] font-medium italic text-[--brand-brown]/70">
                  {siteInfo.company.tagline}
                </span>
              </div>
            </div> */}
          </div>

          {/* Right: decorative date block */}
          <div
            className={`flex flex-shrink-0 flex-col items-start gap-0.5 sm:items-end transition-all duration-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <span
              aria-hidden="true"
              className="select-none font-playfair text-7xl font-black leading-none tracking-tight text-[--brand-green]/[0.07] sm:text-8xl"
            >
              {date}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[--brand-ink]/35">
              {day}
            </span>
            <span className="text-[11px] font-medium text-[--brand-ink]/22">
              {rest}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`h-px w-full bg-gradient-to-r from-transparent via-[--brand-green]/12 to-transparent transition-all duration-700 ${mounted ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`}
          style={{ transitionDelay: "320ms" }}
        />

        {/* Stats row */}
        {/* <div
          className={`flex flex-wrap items-center gap-2.5 transition-all duration-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
          style={{ transitionDelay: "400ms" }}
        >
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[--brand-ink]/28 select-none">
            <span className="h-px w-4 bg-[--brand-green]/25" />
            School at a glance
          </p>
          {stats.map((stat) => (
            <StatPill
              key={stat.label}
              number={stat.number}
              label={stat.label}
            />
          ))}
        </div> */}
      </div>
    </section>
  );
}
