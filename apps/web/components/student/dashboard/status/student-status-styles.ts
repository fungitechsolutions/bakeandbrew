import {
  landingEyebrowClass,
  landingPrimaryButtonClass,
  landingSecondaryButtonClass,
  landingSectionBodyClass,
  landingSectionTitleClass,
} from "@/components/landing/landing-styles";

export const studentStatusEyebrowClass = landingEyebrowClass;
export const studentStatusTitleClass = landingSectionTitleClass;
export const studentStatusBodyClass = landingSectionBodyClass;
export const studentStatusShellClass = "relative mx-auto w-full max-w-3xl";
export const studentStatusPrimaryBtnClass = landingPrimaryButtonClass;
export const studentStatusSecondaryBtnClass = `${landingSecondaryButtonClass} border-[rgba(47,78,64,0.18)]`;

export const studentStatusBadgeClass =
  "inline-flex items-center gap-2 border px-3 py-1.5 font-[family-name:var(--font-dm-sans)] text-[0.68rem] font-bold uppercase tracking-[0.14em]";

export const studentStatusBentoClass =
  "border border-[rgba(47,78,64,0.1)] bg-white p-5 transition-shadow duration-200 hover:shadow-[0_8px_32px_rgba(47,78,64,0.06)]";

export const studentStatusHighlightCardClass =
  "relative overflow-hidden border border-[rgba(47,78,64,0.12)] bg-white p-6 sm:p-8 shadow-[0_16px_48px_rgba(47,78,64,0.07)]";
