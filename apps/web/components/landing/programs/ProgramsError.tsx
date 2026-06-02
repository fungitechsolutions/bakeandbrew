"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

type ProgramsErrorProps = {
  message?: string;
  onRetry: () => void;
  isRetrying?: boolean;
};

export default function ProgramsError({
  message = "Failed to load programs.",
  onRetry,
  isRetrying = false,
}: ProgramsErrorProps) {
  return (
    <section
      id="programs"
      className="relative w-full overflow-hidden px-6 py-24"
      style={{ background: "#1e3328" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.018' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/15 text-red-300">
          <AlertCircle className="h-5 w-5" />
        </div>
        <h3
          className="mb-2 text-2xl font-semibold text-white"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Unable to load programs
        </h3>
        <p
          className="mb-6 max-w-lg text-sm text-white/65"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {message}
        </p>
        <Button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="gap-2 bg-[var(--brand-brown)] text-white hover:brightness-110"
        >
          <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
          {isRetrying ? "Retrying..." : "Try Again"}
        </Button>
      </div>
    </section>
  );
}
