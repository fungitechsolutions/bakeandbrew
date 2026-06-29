import Image from "next/image";
import { siteInfo } from "@/utils/site-info";
import {
  landingEyebrowClass,
  landingPrimaryButtonClass,
  landingSecondaryButtonClass,
  landingSectionBodyClass,
  landingSectionTitleClass,
} from "@/components/landing/landing-styles";

type ErrorPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  watermark?: string;
  icon: React.ReactNode;
  actions: React.ReactNode;
};

export function ErrorPageShell({
  eyebrow,
  title,
  description,
  watermark,
  icon,
  actions,
}: ErrorPageShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-(--brand-cream) px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(47,78,64,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(47,78,64,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "rgba(194,138,79,0.12)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 left-0 h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{ background: "rgba(47,78,64,0.08)" }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-xl">
        {watermark ? (
          <p
            className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 select-none font-[family-name:var(--font-playfair)] text-[clamp(5rem,18vw,8rem)] font-extrabold leading-none text-[rgba(47,78,64,0.05)]"
            aria-hidden
          >
            {watermark}
          </p>
        ) : null}

        <div className="relative p-0 text-center sm:p-2">
          <div className="mb-6 flex flex-col items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center overflow-hidden">
              <Image
                src={
                  siteInfo.assets.greenBrownNoBG ?? siteInfo.assets.whiteLogoNoBG
                }
                alt=""
                width={64}
                height={64}
                aria-hidden
              />
            </span>
            <div className="text-(--brand-green)" aria-hidden>
              {icon}
            </div>
          </div>

          <span className={`${landingEyebrowClass} mb-3 inline-block`}>
            {eyebrow}
          </span>
          <h1 className={`${landingSectionTitleClass} mb-4 text-[clamp(1.75rem,4vw,2.25rem)]`}>
            {title}
          </h1>
          <p className={`${landingSectionBodyClass} mb-8`}>{description}</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {actions}
          </div>
        </div>
      </div>
    </main>
  );
}

export { landingPrimaryButtonClass, landingSecondaryButtonClass };
