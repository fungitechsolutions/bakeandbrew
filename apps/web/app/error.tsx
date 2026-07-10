"use client";

import Link from "next/link";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";
import {
  ErrorPageShell,
  landingPrimaryButtonClass,
  landingSecondaryButtonClass,
} from "@/components/error-page-shell";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPageShell
      eyebrow="Something went wrong"
      title="Please try again"
      description="We ran into an unexpected issue. You can retry, or return home and continue from there."
      icon={<RefreshCw size={24} strokeWidth={1.75} />}
      actions={
        <>
          <button
            type="button"
            onClick={reset}
            className={landingPrimaryButtonClass}
          >
            <RefreshCw size={16} strokeWidth={2.5} />
            Try Again
          </button>
          <Link href="/" className={landingSecondaryButtonClass}>
            <Home size={16} strokeWidth={2.5} />
            Back to Home
          </Link>
        </>
      }
    />
  );
}
