import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, Clock, FileText } from "lucide-react";
import { siteInfo } from "@/utils/site-info";

// ---------------------------------------------------------------------------
// Step indicator — shows the student where onboarding sits in the journey
// ---------------------------------------------------------------------------
const STEPS = [
  { icon: <GraduationCap size={15} />, label: "Sign Up", done: true },
  {
    icon: <FileText size={15} />,
    label: "Admission Form",
    done: false,
    active: true,
  },
  { icon: <Clock size={15} />, label: "Under Review", done: false },
];

function StepIndicator() {
  return (
    <div className="flex items-center gap-0 w-full max-w-sm mx-auto">
      {STEPS.map((step, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          {/* Node */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div
              className={`
                w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold
                transition-all duration-300
                ${
                  step.done
                    ? "bg-[#2f4e40] text-white shadow-md shadow-[#2f4e40]/20"
                    : step.active
                      ? "bg-[#c28a4f] text-white shadow-md shadow-[#c28a4f]/25 ring-4 ring-[#c28a4f]/15"
                      : "bg-[#1a1a1a]/6 text-[#1a1a1a]/30"
                }
              `}
            >
              {step.icon}
            </div>
            <span
              className={`text-[10px] font-semibold tracking-wide whitespace-nowrap ${
                step.done
                  ? "text-[#2f4e40]"
                  : step.active
                    ? "text-[#c28a4f]"
                    : "text-[#1a1a1a]/30"
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line */}
          {i < STEPS.length - 1 && (
            <div className="flex-1 mx-2 mb-5">
              <div
                className={`h-0.5 w-full rounded-full transition-all duration-500 ${
                  step.done ? "bg-[#2f4e40]/40" : "bg-[#1a1a1a]/8"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// What happens next — sets expectations so they don't feel lost
// ---------------------------------------------------------------------------
const NEXT_STEPS = [
  {
    number: "01",
    title: "Fill the admission form",
    desc: "Takes about 5 minutes. Have your personal details and guardian info ready.",
  },
  {
    number: "02",
    title: "Wait for review",
    desc: "Our team reviews your application and activates your account, usually within one business day.",
  },
  {
    number: "03",
    title: "Access your dashboard",
    desc: "Once approved, your full dashboard — courses, payments, and schedule — unlocks.",
  },
];

export default function OnboardingPage() {
  return (
    <div
      className="min-h-screen  flex flex-col"
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      {/* Subtle top bar */}
      <header className="border-b border-[#1a1a1a]/6 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Image
            src={siteInfo.assets.noBGLogo}
            alt={siteInfo.company.shortName}
            width={100}
            height={100}
            className="object-contain"
          />
          {/* <span
            className="text-sm font-semibold text-[#1a1a1a]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {siteInfo.company.shortName}
          </span> */}
        </div>
        <span className="text-xs text-[#1a1a1a]/35 font-medium">
          {siteInfo.contact.officeHours}
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Step indicator */}
          <div className="mb-10">
            <StepIndicator />
          </div>

          {/* Card */}
          <div
            className="relative overflow-hidden rounded-2xl bg-white"
            style={{
              border: "1px solid rgba(26,26,26,0.08)",
              boxShadow:
                "0 1px 3px rgba(26,26,26,0.06), 0 12px 40px rgba(26,26,26,0.09)",
            }}
          >
            {/* Top accent */}
            <div
              className="h-1 w-full"
              style={{
                background:
                  "linear-gradient(to right, #2f4e40, #c28a4f, #2f4e40)",
              }}
            />

            {/* Decorative radial */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(194,138,79,0.07) 0%, transparent 70%)",
              }}
            />

            <div className="relative p-8">
              {/* Icon + heading */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(47,78,64,0.08)" }}
                >
                  <FileText size={22} className="text-[#2f4e40]" />
                </div>
                <div>
                  <h1
                    className="text-xl font-bold text-[#1a1a1a] leading-tight mb-1"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Complete your admission
                  </h1>
                  <p className="text-sm text-[#1a1a1a]/50 leading-relaxed">
                    Your account is created but we need a few more details to
                    set up your student profile.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#1a1a1a]/6 mb-6" />

              {/* What happens next */}
              <div className="space-y-4 mb-8">
                {NEXT_STEPS.map((step) => (
                  <div key={step.number} className="flex items-start gap-4">
                    <span
                      className="shrink-0 text-xs font-black text-[#c28a4f] mt-0.5 w-6 text-right"
                      style={{ fontFamily: "var(--font-lora)" }}
                    >
                      {step.number}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1a1a1a] mb-0.5">
                        {step.title}
                      </p>
                      <p className="text-xs text-[#1a1a1a]/45 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/admission"
                className="group flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-[#2f4e40]/20 active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, #2f4e40 0%, #3a5a49 100%)",
                }}
              >
                Fill Admission Form
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          {/* Help note */}
          <p className="text-center text-xs text-[#1a1a1a]/35 mt-6 leading-relaxed">
            Need help?{" "}
            <a
              href={`tel:${siteInfo.contact.phone}`}
              className="text-[#2f4e40] font-semibold hover:underline"
            >
              {siteInfo.contact.phone}
            </a>{" "}
            or{" "}
            <a
              href={`mailto:${siteInfo.contact.email}`}
              className="text-[#2f4e40] font-semibold hover:underline"
            >
              {siteInfo.contact.email}
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a]/6 px-6 py-4 text-center">
        <p className="text-xs text-[#1a1a1a]/30">
          {siteInfo.company.name} &nbsp;·&nbsp; PAN {siteInfo.company.panNo}
        </p>
      </footer>
    </div>
  );
}
