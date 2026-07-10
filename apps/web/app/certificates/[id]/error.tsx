"use client";

import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";
import {
  ErrorPageShell,
  landingPrimaryButtonClass,
  landingSecondaryButtonClass,
} from "@/components/error-page-shell";

export default function CertificateError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPageShell
      eyebrow="Verification"
      title="Unable to load certificate"
      description="We couldn't retrieve this certificate right now. Please try again, or return home and verify the link you received."
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
