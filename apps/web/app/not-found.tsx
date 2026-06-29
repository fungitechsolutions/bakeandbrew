import Link from "next/link";
import { ArrowLeft, Home, MessageCircle } from "lucide-react";
import {
  ErrorPageShell,
  landingPrimaryButtonClass,
  landingSecondaryButtonClass,
} from "@/components/error-page-shell";

export default function NotFound() {
  return (
    <ErrorPageShell
      watermark="404"
      eyebrow="Page not found"
      title="We couldn't find that page"
      description="The link may be broken, or the page may have been moved. Head back home or send us a message — we're happy to help."
      icon={<Home size={24} strokeWidth={1.75} />}
      actions={
        <>
          <Link href="/" className={landingPrimaryButtonClass}>
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back to Home
          </Link>
          <Link href="/#inquiry" className={landingSecondaryButtonClass}>
            <MessageCircle size={16} strokeWidth={2.5} />
            Contact Us
          </Link>
        </>
      }
    />
  );
}
