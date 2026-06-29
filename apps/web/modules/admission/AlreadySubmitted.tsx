"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StudentStatus = "active" | "pending" | "rejected" | "completed";

interface AlreadySubmittedProps {
  studentName: string;
  submittedAt: string;
  status: StudentStatus;
}

interface StatusConfig {
  eyebrow: string;
  eyebrowColor: string;
  dotColor: string;
  headline: (firstName: string) => React.ReactNode;
  subCopy: string;
  accentColor: string;
  dividerColor: string;
}

interface StepItem {
  label: string;
  description: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Status config map ────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<StudentStatus, StatusConfig> = {
  pending: {
    eyebrow: "Application Pending",
    eyebrowColor: "text-[#c28a4f]",
    dotColor: "bg-[#c28a4f]",
    headline: (firstName) => (
      <>
        Hang tight, <span className="text-[#c28a4f]">{firstName}.</span>
      </>
    ),
    subCopy:
      "Your application is in our hands and under careful review. We appreciate your patience — good things take a little time.",
    accentColor: "#c28a4f",
    dividerColor: "bg-[#c28a4f]/20",
  },
  active: {
    eyebrow: "Application Received",
    eyebrowColor: "text-[#2f4e40]",
    dotColor: "bg-[#2f4e40]",
    headline: (firstName) => (
      <>
        You&apos;re all set,{" "}
        <span className="text-[#2f4e40]">{firstName}.</span>
      </>
    ),
    subCopy:
      "Your admission form has already been submitted. There's nothing more you need to do right now — sit tight!",
    accentColor: "#2f4e40",
    dividerColor: "bg-[#2f4e40]/20",
  },
  completed: {
    eyebrow: "Program Completed",
    eyebrowColor: "text-[#2f4e40]",
    dotColor: "bg-[#2f4e40]",
    headline: (firstName) => (
      <>
        Congratulations, <span className="text-[#2f4e40]">{firstName}.</span>
      </>
    ),
    subCopy:
      "You've successfully completed your program with Brew & Bake Academy. It's been a pleasure having you with us.",
    accentColor: "#2f4e40",
    dividerColor: "bg-[#2f4e40]/20",
  },
  rejected: {
    eyebrow: "Application Unsuccessful",
    eyebrowColor: "text-[#1a1a1a]/45",
    dotColor: "bg-[#1a1a1a]/30",
    headline: (firstName) => (
      <>
        We&apos;re sorry, <span className="text-[#2f4e40]">{firstName}.</span>
      </>
    ),
    subCopy:
      "After careful consideration, we were unable to offer you a place this cycle. This is never an easy decision, and we genuinely appreciate your interest.",
    accentColor: "#2f4e40",
    dividerColor: "bg-[#1a1a1a]/12",
  },
};

// ─── Steps per status ─────────────────────────────────────────────────────────

const STATUS_STEPS: Record<StudentStatus, StepItem[]> = {
  pending: [
    {
      label: "Application Under Review",
      description:
        "Our admissions team carefully reviews every application. This typically takes 2–3 business days.",
    },
    {
      label: "You'll Hear From Us",
      description:
        "We'll reach out via your registered email or phone with your admission decision.",
    },
    {
      label: "Orientation & Onboarding",
      description:
        "Once confirmed, you'll receive batch schedule, orientation date, and all materials.",
    },
  ],
  active: [
    {
      label: "Application Under Review",
      description:
        "Our admissions team carefully reviews every application. This typically takes 2–3 business days.",
    },
    {
      label: "You'll Hear From Us",
      description:
        "We'll reach out via your registered email or phone with your admission status.",
    },
    {
      label: "Orientation & Onboarding",
      description:
        "Once confirmed, you'll receive details about your batch schedule, orientation date, and materials.",
    },
  ],
  completed: [
    {
      label: "Certificate Issued",
      description:
        "Your certificate of completion has been issued. Contact us if you need an extra copy.",
    },
    {
      label: "Alumni Network",
      description:
        "You're now part of our growing alumni family. Stay connected and keep brewing.",
    },
    {
      label: "Career Support",
      description:
        "Our placement support team is still available to you as an alumnus.",
    },
  ],
  rejected: [
    {
      label: "Reapply Next Cycle",
      description:
        "Admissions open every cycle. We encourage you to apply again — many of our best students were re-applicants.",
    },
    {
      label: "Contact Admissions",
      description:
        "Reach out to understand the decision better or ask what you can strengthen before reapplying.",
    },
    {
      label: "Explore Short Programs",
      description:
        "Browse our workshops and short courses — there may be a shorter path in for you.",
    },
  ],
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function LayoutDashboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

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

// ─── Step Row ─────────────────────────────────────────────────────────────────

interface StepRowProps {
  index: number;
  label: string;
  description: string;
  accentColor: string;
  delay: number;
  visible: boolean;
}

function StepRow({
  index,
  label,
  description,
  accentColor,
  delay,
  visible,
}: StepRowProps) {
  return (
    <div
      className={`grid grid-cols-[2rem_1fr] gap-x-5 gap-y-1 transition-all duration-500 sm:grid-cols-[2.5rem_1fr] ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Index number */}
      <span
        className="font-playfair text-2xl font-black leading-none sm:text-3xl"
        style={{ color: accentColor, opacity: 0.25 }}
        aria-hidden="true"
      >
        {String(index).padStart(2, "0")}
      </span>
      {/* Content */}
      <div className="pb-7 pt-0.5">
        <p className="font-dm-sans text-[13px] font-bold uppercase tracking-widest text-[#1a1a1a]">
          {label}
        </p>
        <p className="mt-1.5 font-dm-sans text-sm leading-relaxed text-[#1a1a1a]/50">
          {description}
        </p>
      </div>
      {/* Connector — spans only the number column as a left gutter line */}
      <div
        className="mx-auto w-px flex-shrink-0"
        style={{ background: `${accentColor}18`, minHeight: "1rem" }}
        aria-hidden="true"
      />
      <div /> {/* empty right cell to keep grid aligned */}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AlreadySubmitted({
  studentName,
  submittedAt,
  status,
}: AlreadySubmittedProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const firstName = studentName.split(" ")[0] ?? "Student";
  const formattedDate = formatDate(submittedAt);
  const config = STATUS_CONFIG[status];
  const steps = STATUS_STEPS[status];

  const showDashboardCTA = status === "active" || status === "completed";
  //   const showReapplyCTA = status === "rejected";

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

      {/* Left accent rule — full height */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-6 top-0 z-0 w-px sm:left-10 lg:left-16"
        style={{
          background: `linear-gradient(to bottom, transparent, ${config.accentColor}22 20%, ${config.accentColor}22 80%, transparent)`,
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
          {/* Animated status dot */}
          <span className="relative flex h-2 w-2 flex-shrink-0">
            {status === "pending" && (
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${config.dotColor}`}
              />
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${config.dotColor}`}
            />
          </span>

          <span
            className={`font-dm-sans text-[11px] font-bold uppercase tracking-[0.16em] ${config.eyebrowColor}`}
          >
            {config.eyebrow}
          </span>

          {/* Short rule */}
          <div className={`h-px w-8 flex-shrink-0 ${config.dividerColor}`} />
        </div>

        {/* ── Headline ── */}
        <h1
          className={`font-playfair text-4xl font-bold leading-[1.1] text-[#1a1a1a] transition-all duration-600 sm:text-5xl lg:text-[3.25rem] ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
          style={{ transitionDelay: "80ms" }}
        >
          {config.headline(firstName)}
        </h1>

        {/* ── Sub copy ── */}
        <p
          className={`mt-5 max-w-md font-lora text-base leading-[1.8] text-[#1a1a1a]/55 italic transition-all duration-500 sm:text-[17px] ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "160ms" }}
        >
          {config.subCopy}
        </p>

        {/* ── Submitted on meta ── */}
        <div
          className={`mt-7 flex items-baseline gap-3 transition-all duration-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "240ms" }}
        >
          <span className="font-dm-sans text-[11px] font-semibold uppercase tracking-[0.13em] text-[#1a1a1a]/30">
            Submitted
          </span>
          <span className="h-px w-4 flex-shrink-0 bg-[#1a1a1a]/15" />
          <span className="font-dm-sans text-sm font-medium text-[#1a1a1a]/60">
            {formattedDate}
          </span>
        </div>

        {/* ── Horizontal rule ── */}
        <div
          className={`mb-10 mt-10 h-px transition-all duration-700 ${config.dividerColor} ${
            mounted ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
          } origin-left`}
          style={{ transitionDelay: "320ms" }}
        />

        {/* ── Section label ── */}
        <p
          className={`mb-8 font-dm-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/28 transition-all duration-500 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "380ms" }}
        >
          {status === "rejected" ? "Your options" : "What happens next"}
        </p>

        {/* ── Steps ── */}
        <div>
          {steps.map((step, i) => (
            <StepRow
              key={step.label}
              index={i + 1}
              label={step.label}
              description={step.description}
              accentColor={config.accentColor}
              delay={440 + i * 80}
              visible={mounted}
            />
          ))}
        </div>

        {/* ── CTAs ── */}
        <div
          className={`mt-4 flex flex-col gap-3 sm:flex-row sm:items-center transition-all duration-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: `${440 + steps.length * 80 + 80}ms` }}
        >
          {showDashboardCTA && (
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-[#2f4e40] px-6 py-3.5 font-dm-sans text-sm font-semibold text-[#fbfaf7] shadow-[0_2px_12px_-2px_rgba(47,78,64,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3a5a49] hover:shadow-[0_6px_20px_-4px_rgba(47,78,64,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4e40] focus-visible:ring-offset-2"
            >
              <LayoutDashboardIcon />
              Go to Dashboard
              <ArrowRightIcon />
            </Link>
          )}

          {/* {showReapplyCTA && (
            <Link
              href="/admission"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-[#2f4e40] px-6 py-3.5 font-dm-sans text-sm font-semibold text-[#fbfaf7] shadow-[0_2px_12px_-2px_rgba(47,78,64,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3a5a49] hover:shadow-[0_6px_20px_-4px_rgba(47,78,64,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4e40] focus-visible:ring-offset-2"
            >
              Reapply
              <ArrowRightIcon />
            </Link>
          )} */}

          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-dm-sans text-sm font-semibold text-[#1a1a1a]/45 transition-all duration-200 hover:text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4e40] focus-visible:ring-offset-2"
          >
            <HomeIcon />
            Back to Home
          </Link>
        </div>

        {/* ── Footer ── */}
        <p
          className={`mt-14 font-dm-sans text-xs text-[#1a1a1a]/30 transition-all duration-500 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: `${560 + steps.length * 80}ms` }}
        >
          Questions?{" "}
          <a
            href="mailto:brewandbakeacademy@gmail.com"
            className="underline underline-offset-2 transition-colors duration-150 hover:text-[#2f4e40]"
          >
            brewandbakeacademy@gmail.com
          </a>
          {status === "rejected" && (
            <>
              {" "}
              ·{" "}
              <a
                href="tel:+9779851433332"
                className="underline underline-offset-2 transition-colors duration-150 hover:text-[#2f4e40]"
              >
                +977 9851433332
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
