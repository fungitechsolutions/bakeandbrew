"use client";

import Link from "next/link";

interface PendingErrorProps {
  message: string;
  reset: () => void;
}

function RefreshIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
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

export default function PendingError({ message, reset }: PendingErrorProps) {
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

      {/* Left accent rule — muted, error state */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-6 top-0 z-0 w-px sm:left-10 lg:left-16"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(26,26,26,0.08) 20%, rgba(26,26,26,0.08) 80%, transparent)",
        }}
      />

      <div className="relative z-10 w-full max-w-xl">
        {/* Eyebrow */}
        <div className="mb-10 flex items-center gap-3">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#1a1a1a]/20" />
          <span className="font-dm-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/35">
            Something went wrong
          </span>
          <div className="h-px w-8 shrink-0 bg-[#1a1a1a]/10" />
        </div>

        {/* Headline */}
        <h1 className="font-playfair text-4xl font-bold leading-[1.1] text-[#1a1a1a] sm:text-5xl">
          Couldn&apos;t load your{" "}
          <span className="text-[#c28a4f]">status.</span>
        </h1>

        {/* Sub copy */}
        <p className="mt-5 max-w-md font-lora text-base leading-[1.8] text-[#1a1a1a]/55 italic sm:text-[17px]">
          We had trouble fetching your application status. This is usually
          temporary — try again in a moment.
        </p>

        {/* Error detail (only in dev or when message is safe) */}
        <p className="mt-4 font-dm-sans text-xs text-[#1a1a1a]/30 max-w-sm leading-relaxed">
          {message}
        </p>

        {/* Divider */}
        <div className="mt-10 mb-10 h-px w-full bg-[#1a1a1a]/10" />

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-[#c28a4f] px-5 py-3 font-dm-sans text-sm font-semibold text-white transition-all duration-200 hover:bg-[#b07a42] hover:shadow-lg hover:shadow-[#c28a4f]/20 active:scale-[0.98]"
          >
            <RefreshIcon />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 font-dm-sans text-sm font-semibold text-[#1a1a1a]/45 transition-colors duration-200 hover:text-[#1a1a1a]"
          >
            <HomeIcon />
            Back to Home
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-14 font-dm-sans text-xs text-[#1a1a1a]/28">
          Persisting issue?{" "}
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
