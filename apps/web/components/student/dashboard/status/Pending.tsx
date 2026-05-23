"use client";

import api from "@/lib/axios";
import { GetStudentPendingOverviewResponse } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import PendingLoading from "./PendingLoading";
import PendingError from "./PendingError";

interface TimelineStep {
  label: string;
  description: string;
  done: boolean;
  active: boolean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

interface TimelineItemProps extends TimelineStep {
  step: number;
  isLast: boolean;
  delay: number;
  visible: boolean;
}

function TimelineItem({
  step,
  label,
  description,
  done,
  active,
  isLast,
  delay,
  visible,
}: TimelineItemProps) {
  return (
    <div
      className={`grid grid-cols-[2.5rem_1fr] gap-x-5 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Left: dot + connector */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <div className="relative flex-shrink-0">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300 ${
              done
                ? "border-[#c28a4f] bg-[#c28a4f]"
                : active
                  ? "border-[#c28a4f] bg-[#fbfaf7]"
                  : "border-[#1a1a1a]/15 bg-[#fbfaf7]"
            }`}
          >
            {done ? (
              <span className="text-white">
                <CheckIcon />
              </span>
            ) : (
              <span
                className={`font-dm-sans text-xs font-bold ${
                  active ? "text-[#c28a4f]" : "text-[#1a1a1a]/25"
                }`}
              >
                {step}
              </span>
            )}
          </div>

          {/* Ping on active */}
          {active && (
            <span className="absolute inset-0 animate-ping rounded-full border border-[#c28a4f]/35" />
          )}
        </div>

        {/* Connector line */}
        {!isLast && (
          <div
            className={`mt-1 w-px flex-1 ${
              done ? "bg-[#c28a4f]/30" : "bg-[#1a1a1a]/8"
            }`}
            style={{ minHeight: "2rem" }}
          />
        )}
      </div>

      {/* Right: text */}
      <div className={`pb-8 pt-0.5 ${isLast ? "pb-0" : ""}`}>
        <p
          className={`font-dm-sans text-[13px] font-bold uppercase tracking-[0.09em] ${
            done
              ? "text-[#c28a4f]"
              : active
                ? "text-[#1a1a1a]"
                : "text-[#1a1a1a]/28"
          }`}
        >
          {label}
          {active && (
            <span className="ml-2.5 inline-flex items-center rounded-full bg-[#c28a4f]/12 px-2 py-0.5 text-[10px] font-bold tracking-widest text-[#c28a4f]">
              Now
            </span>
          )}
        </p>
        <p
          className={`mt-1.5 font-dm-sans text-sm leading-relaxed ${
            active ? "text-[#1a1a1a]/52" : "text-[#1a1a1a]/28"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

export default function PendingStatus() {
  const [mounted, setMounted] = useState<boolean>(false);

  const { data, isPending, isError, refetch, error } = useQuery({
    queryKey: ["student-portal-pending"],
    queryFn: async () => {
      const res = await api.get<GetStudentPendingOverviewResponse>(
        "/portal/student/pending-overview",
      );
      const parsed = res.data;
      if (!parsed.success)
        throw new Error(parsed.message ?? "Something went wrong");
      return parsed.data;
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  if (isPending) return <PendingLoading />;
  if (isError) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return <PendingError message={message} reset={refetch} />;
  }

  const firstName = data.fullName.split(" ")[0] ?? "Student";

  const steps: (TimelineStep & { step: number; isLast: boolean })[] = [
    {
      step: 1,
      label: "Application Submitted",
      description: `Received on ${formatDate(data.submittedAt)}.`,
      done: true,
      active: false,
      isLast: false,
    },
    {
      step: 2,
      label: "Under Review",
      description:
        "Our admissions team is carefully evaluating your application. This typically takes 2–3 business days.",
      done: false,
      active: true,
      isLast: false,
    },
    {
      step: 3,
      label: "Decision Communicated",
      description:
        "We'll notify you via email and phone once a decision has been made.",
      done: false,
      active: false,
      isLast: false,
    },
    {
      step: 4,
      label: "Orientation & Onboarding",
      description:
        "Successful applicants receive batch details, schedule, and onboarding materials.",
      done: false,
      active: false,
      isLast: true,
    },
  ];

  return (
    <div className="flex min-h-screen w-full items-start justify-center  px-6 py-20 sm:px-10 lg:px-16">
      {/* Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.028]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Left accent rule */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-6 top-0 z-0 w-px sm:left-10 lg:left-16"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(194,138,79,0.2) 20%, rgba(194,138,79,0.2) 80%, transparent)",
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
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c28a4f] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c28a4f]" />
          </span>
          <span className="font-dm-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#c28a4f]">
            Application Pending
          </span>
          <div className="h-px w-8 flex-shrink-0 bg-[#c28a4f]/22" />
        </div>

        {/* ── Headline ── */}
        <h1
          className={`font-playfair text-4xl font-bold leading-[1.1] text-[#1a1a1a] transition-all duration-500 sm:text-5xl lg:text-[3.25rem] ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
          style={{ transitionDelay: "80ms" }}
        >
          Hang tight, <span className="text-[#c28a4f]">{firstName}.</span>
        </h1>

        {/* ── Sub copy ── */}
        <p
          className={`mt-5 max-w-md font-lora text-base leading-[1.8] text-[#1a1a1a]/55 italic transition-all duration-500 sm:text-[17px] ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "160ms" }}
        >
          Your application is in our hands and currently under review. We
          appreciate your patience — good things take a little time.
        </p>

        {/* ── Submitted meta ── */}
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
          <span className="font-dm-sans text-sm font-medium text-[#1a1a1a]/55">
            {formatDate(data.submittedAt)}
          </span>
        </div>

        {/* ── Divider ── */}
        <div
          className={`mb-10 mt-10 h-px origin-left bg-[#c28a4f]/18 transition-all duration-700 ${
            mounted ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
          }`}
          style={{ transitionDelay: "320ms" }}
        />

        {/* ── Section label ── */}
        <p
          className={`mb-8 font-dm-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/28 transition-all duration-500 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "380ms" }}
        >
          Your progress
        </p>

        {/* ── Timeline ── */}
        <div>
          {steps.map((step, i) => (
            <TimelineItem
              key={step.step}
              {...step}
              delay={440 + i * 80}
              visible={mounted}
            />
          ))}
        </div>

        {/* ── Inbox nudge ── */}
        <p
          className={`mt-2 font-dm-sans text-sm text-[#1a1a1a]/38 transition-all duration-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
          style={{ transitionDelay: "760ms" }}
        >
          Keep an eye on your inbox — we&apos;ll reach out once a decision is
          made.
        </p>

        {/* ── CTA ── */}
        <div
          className={`mt-10 transition-all duration-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "840ms" }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-dm-sans text-sm font-semibold text-[#1a1a1a]/45 transition-all duration-200 hover:text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c28a4f] focus-visible:ring-offset-2"
          >
            <HomeIcon />
            Back to Home
          </Link>
        </div>

        {/* ── Footer ── */}
        <p
          className={`mt-14 font-dm-sans text-xs text-[#1a1a1a]/28 transition-all duration-500 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "920ms" }}
        >
          Questions about your application?{" "}
          <a
            href="mailto:brewandbakeacademy@gmail.com"
            className="underline underline-offset-2 transition-colors duration-150 hover:text-[#c28a4f]"
          >
            brewandbakeacademy@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
