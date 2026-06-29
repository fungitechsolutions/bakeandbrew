/** Shared landing shell — matches hero `container` width (96rem / 1536px). */
export const landingContainerClass = "relative mx-auto w-full max-w-landing";

/** Gallery uses the same shell as hero and other landing sections. */
export const galleryContainerClass =
  "relative mx-auto w-full max-w-landing px-6";

export const landingEyebrowClass =
  "font-[family-name:var(--font-dm-sans)] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-(--brand-brown)";

export const landingSectionTitleClass =
  "font-[family-name:var(--font-playfair)] text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.15] text-(--brand-green)";

export const landingSectionBodyClass =
  "font-[family-name:var(--font-dm-sans)] text-[0.95rem] leading-[1.75] text-[rgba(47,78,64,0.6)]";

export const landingCardClass =
  "border border-[rgba(47,78,64,0.12)] bg-white p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(47,78,64,0.08)]";

export const landingInputClass =
  "w-full border border-[rgba(47,78,64,0.18)] bg-white px-4 py-3 font-[family-name:var(--font-dm-sans)] text-sm text-(--brand-ink) outline-none transition-colors focus:border-(--brand-green) focus:ring-2 focus:ring-[rgba(47,78,64,0.08)]";

export const landingPrimaryButtonClass =
  "inline-flex items-center justify-center gap-2 border border-(--brand-brown) bg-(--brand-brown) px-6 py-3 font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105";

export const landingSecondaryButtonClass =
  "inline-flex items-center justify-center gap-2 border border-[rgba(47,78,64,0.2)] bg-white px-5 py-2.5 font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-(--brand-green) transition-colors hover:bg-[rgba(47,78,64,0.04)]";

export const landingNavLinkClass =
  "relative font-[family-name:var(--font-dm-sans)] text-[0.9rem] font-medium tracking-[0.02em] text-[rgba(26,26,26,0.6)] transition-colors duration-200 hover:text-(--brand-green) after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-(--brand-brown) after:transition-[width] after:duration-300 hover:after:w-full";

export const landingDarkSectionClass =
  "relative w-full overflow-hidden px-6 py-24 bg-(--brand-green)";

export const landingCreamSectionClass =
  "bg-(--brand-cream) px-6 py-24";

export const landingMutedSectionClass =
  "bg-[#f4f1ec] px-6 py-24";
