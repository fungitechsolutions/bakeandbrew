import {
  landingEyebrowClass,
  landingPrimaryButtonClass,
  landingSecondaryButtonClass,
} from "@/components/landing/landing-styles";

export const admissionEyebrowClass = landingEyebrowClass;

export const admissionTitleClass =
  "font-[family-name:var(--font-playfair)] text-[clamp(2rem,4.5vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.02em]";

export const admissionLabelClass =
  "font-[family-name:var(--font-dm-sans)] text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[rgba(47,78,64,0.55)]";

export const admissionHintClass =
  "font-[family-name:var(--font-dm-sans)] text-[0.78rem] text-[rgba(47,78,64,0.45)]";

export const admissionErrorClass =
  "font-[family-name:var(--font-dm-sans)] text-[0.78rem] text-red-600";

export const admissionInputClass =
  "w-full border border-[rgba(47,78,64,0.14)] bg-white py-3 pl-10 pr-4 font-[family-name:var(--font-dm-sans)] text-[0.92rem] text-(--brand-green) outline-none transition-colors duration-200 placeholder:text-[rgba(47,78,64,0.32)] focus:border-(--brand-brown) focus:ring-2 focus:ring-[rgba(194,138,79,0.1)] disabled:cursor-not-allowed disabled:border-[rgba(47,78,64,0.1)] disabled:bg-[#f4f1ec] disabled:text-[rgba(47,78,64,0.45)]";

export const admissionBoxInputClass = admissionInputClass;

export const admissionInputNormalBorder = "border-[rgba(47,78,64,0.14)]";

export const admissionInputErrorBorder =
  "border-red-400 ring-2 ring-red-100";

export const admissionWizardShellClass =
  "overflow-hidden border border-[rgba(47,78,64,0.12)] bg-white shadow-[0_12px_48px_rgba(47,78,64,0.08)] lg:flex lg:min-h-[min(720px,calc(100vh-10rem))]";

export const admissionPrimaryBtnClass = landingPrimaryButtonClass;

export const admissionSecondaryBtnClass = `${landingSecondaryButtonClass} border-[rgba(47,78,64,0.18)]`;

export const admissionSegmentBaseClass =
  "flex-1 min-w-0 px-3 py-3 font-[family-name:var(--font-dm-sans)] text-[0.84rem] font-medium transition-all duration-200 text-center";

export const admissionSegmentActiveClass =
  "bg-(--brand-green) text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]";

export const admissionSegmentInactiveClass =
  "bg-[#f4f1ec] text-[rgba(47,78,64,0.55)] hover:bg-[rgba(194,138,79,0.1)] hover:text-(--brand-green)";

export const admissionCourseCardBaseClass =
  "group relative flex w-full items-start gap-3 border p-4 text-left transition-all duration-200";

export const admissionCourseCardActiveClass =
  "border-(--brand-brown) bg-[rgba(194,138,79,0.06)] shadow-[0_4px_20px_rgba(194,138,79,0.12)]";

export const admissionCourseCardInactiveClass =
  "border-[rgba(47,78,64,0.12)] bg-white hover:border-[rgba(194,138,79,0.35)] hover:bg-[rgba(47,78,64,0.02)]";

export const admissionReviewPanelClass =
  "overflow-hidden border border-[rgba(47,78,64,0.1)] bg-[#faf9f6]";

export const admissionCalloutClass =
  "border-l-[3px] border-(--brand-brown) bg-[rgba(194,138,79,0.06)] px-4 py-3.5 font-[family-name:var(--font-dm-sans)] text-[0.84rem] leading-[1.65] text-[rgba(47,78,64,0.62)]";

export const admissionSidePanelClass =
  "relative flex flex-col justify-between overflow-hidden bg-(--brand-green) text-white";

export const admissionPhotoDropClass =
  "flex cursor-pointer items-center gap-4 border border-dashed border-[rgba(47,78,64,0.18)] bg-[rgba(47,78,64,0.02)] p-4 transition-colors hover:border-(--brand-brown) hover:bg-[rgba(194,138,79,0.04)]";
