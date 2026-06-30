import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import {
  ErrorPageShell,
  landingPrimaryButtonClass,
  landingSecondaryButtonClass,
} from "@/components/error-page-shell";

export function CertificateNotFound() {
  return (
    <ErrorPageShell
      eyebrow="Verification"
      title="Certificate not found"
      description="We couldn't find a certificate matching this verification link. Please check the URL or QR code and try again, or contact the academy if you believe this is an error."
      icon={<SearchX size={24} strokeWidth={1.75} />}
      actions={
        <>
          <Link href="/" className={landingPrimaryButtonClass}>
            <Home size={16} strokeWidth={2.5} />
            Back to Home
          </Link>
          <Link href="/#programs" className={landingSecondaryButtonClass}>
            <ArrowLeft size={16} strokeWidth={2.5} />
            View Programs
          </Link>
        </>
      }
    />
  );
}
