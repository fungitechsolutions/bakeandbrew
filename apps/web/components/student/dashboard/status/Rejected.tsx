"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RejectedStatusProps {
  studentName: string;
  decidedAt: string; // ISO date string
  rejectionReason?: string;
}

interface ActionItem {
  index: number;
  label: string;
  description: string;
  href: string;
  isExternal?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      aria-hidden="true"
    >
      <path d="M7 7h10v10M7 17 17 7" />
    </svg>
  );
}

// ─── Action Row ───────────────────────────────────────────────────────────────

interface ActionRowProps extends ActionItem {
  delay: number;
  visible: boolean;
}

function ActionRow({
  index,
  label,
  description,
  href,
  isExternal,
  delay,
  visible,
}: ActionRowProps) {
  const sharedClass = `group grid grid-cols-[2.5rem_1fr] gap-x-5 transition-all duration-500 ${
    visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
  }`;

  const content = (
    <>
      {/* Ghost index number */}
      <span
        className="font-playfair text-2xl font-black leading-none text-[#2f4e40]/18 sm:text-3xl"
        aria-hidden="true"
      >
        {String(index).padStart(2, "0")}
      </span>

      {/* Text */}
      <div className="border-b border-[#1a1a1a]/8 pb-6 pt-0.5 transition-colors duration-200 group-hover:border-[#2f4e40]/20">
        <div className="flex items-start justify-between gap-3">
          <p className="font-dm-sans text-[13px] font-bold uppercase tracking-[0.09em] text-[#1a1a1a] transition-colors duration-200 group-hover:text-[#2f4e40]">
            {label}
          </p>
          <span className="mt-0.5 flex-shrink-0 text-[#1a1a1a]/25 transition-colors duration-200 group-hover:text-[#2f4e40]">
            {isExternal ? <ArrowUpRightIcon /> : <ArrowRightIcon />}
          </span>
        </div>
        <p className="mt-1.5 font-dm-sans text-sm leading-relaxed text-[#1a1a1a]/48">
          {description}
        </p>
      </div>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClass}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={sharedClass}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {content}
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RejectedStatus({
  studentName,
  decidedAt,
  rejectionReason,
}: RejectedStatusProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const firstName = studentName.split(" ")[0] ?? "Student";

  const actions: ActionItem[] = [
    {
      index: 1,
      label: "Reapply Next Cycle",
      description:
        "Our admissions open every cycle. We encourage you to apply again — many of our best students were re-applicants.",
      href: "/admission",
    },
    {
      index: 2,
      label: "Contact Admissions",
      description:
        "Reach out to understand the decision better or ask what you can strengthen before reapplying.",
      href: "mailto:brewandbakeacademy@gmail.com",
      isExternal: true,
    },
    {
      index: 3,
      label: "Explore Short Programs",
      description:
        "Browse our workshops and short courses — there may be a shorter path in for you.",
      href: "/",
    },
  ];

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-[#fbfaf7] px-6 py-20 sm:px-10 lg:px-16">
      {/* Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.028]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Left accent rule — muted green */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-6 top-0 z-0 w-px sm:left-10 lg:left-16"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(47,78,64,0.15) 20%, rgba(47,78,64,0.15) 80%, transparent)",
        }}
      />

      <div className="relative z-10 w-full max-w-xl">
        {/* ── Eyebrow ── */}
        <div
          className={`mb-10 flex items-center gap-3 transition-all duration-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
          style={{ transitionDelay: "0ms" }}
        >
          <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#1a1a1a]/25" />
          <span className="font-dm-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/40">
            Application Unsuccessful
          </span>
          <div className="h-px w-8 flex-shrink-0 bg-[#1a1a1a]/12" />
        </div>

        {/* ── Headline ── */}
        <h1
          className={`font-playfair text-4xl font-bold leading-[1.1] text-[#1a1a1a] transition-all duration-500 sm:text-5xl lg:text-[3.25rem] ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
          style={{ transitionDelay: "80ms" }}
        >
          We&apos;re sorry, <span className="text-[#2f4e40]">{firstName}.</span>
        </h1>

        {/* ── Sub copy ── */}
        <p
          className={`mt-5 max-w-md font-lora text-base leading-[1.8] text-[#1a1a1a]/55 italic transition-all duration-500 sm:text-[17px] ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "160ms" }}
        >
          After careful consideration, we were unable to offer you a place this
          cycle. This is never an easy decision, and we genuinely appreciate
          your interest in Brew &amp; Bake Academy.
        </p>

        {/* ── Decision meta ── */}
        <div
          className={`mt-7 flex items-baseline gap-3 transition-all duration-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "240ms" }}
        >
          <span className="font-dm-sans text-[11px] font-semibold uppercase tracking-[0.13em] text-[#1a1a1a]/30">
            Decision made
          </span>
          <span className="h-px w-4 flex-shrink-0 bg-[#1a1a1a]/15" />
          <span className="font-dm-sans text-sm font-medium text-[#1a1a1a]/55">
            {formatDate(decidedAt)}
          </span>
        </div>

        {/* ── Optional rejection reason ── */}
        {rejectionReason && (
          <div
            className={`mt-5 transition-all duration-500 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <span className="font-dm-sans text-[11px] font-semibold uppercase tracking-[0.13em] text-[#1a1a1a]/30">
              Reason provided
            </span>
            <p className="mt-1.5 max-w-md font-dm-sans text-sm leading-relaxed text-[#1a1a1a]/55">
              {rejectionReason}
            </p>
          </div>
        )}

        {/* ── Divider ── */}
        <div
          className={`mb-10 mt-10 h-px origin-left bg-[#1a1a1a]/10 transition-all duration-700 ${
            mounted ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
          }`}
          style={{ transitionDelay: "360ms" }}
        />

        {/* ── Section label ── */}
        <p
          className={`mb-8 font-dm-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/28 transition-all duration-500 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "420ms" }}
        >
          Your options
        </p>

        {/* ── Action rows ── */}
        <div className="flex flex-col gap-0">
          {actions.map((action, i) => (
            <ActionRow
              key={action.label}
              {...action}
              delay={480 + i * 80}
              visible={mounted}
            />
          ))}
        </div>

        {/* ── Quote ── */}
        <div
          className={`mt-10 transition-all duration-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "740ms" }}
        >
          <p className="max-w-sm font-lora text-sm leading-relaxed text-[#2f4e40]/55 italic">
            &ldquo;Every great barista and baker started somewhere. This is just
            the beginning — not the end — of your journey with us.&rdquo;
          </p>
          <p className="mt-2 font-dm-sans text-[11px] font-semibold text-[#2f4e40]/38">
            — Brew &amp; Bake Admissions Team
          </p>
        </div>

        {/* ── Footer ── */}
        <p
          className={`mt-14 font-dm-sans text-xs text-[#1a1a1a]/28 transition-all duration-500 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "820ms" }}
        >
          Need clarification?{" "}
          <a
            href="mailto:brewandbakeacademy@gmail.com"
            className="underline underline-offset-2 transition-colors duration-150 hover:text-[#2f4e40]"
          >
            brewandbakeacademy@gmail.com
          </a>
          {" · "}
          <a
            href="tel:+9779851433332"
            className="underline underline-offset-2 transition-colors duration-150 hover:text-[#2f4e40]"
          >
            +977 9851433332
          </a>
        </p>
      </div>
    </div>
  );
}
