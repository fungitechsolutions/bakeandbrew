"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Briefcase, Sparkles } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface InstructorExperience {
  role: string;
  place: string;
  period?: string;
}

export interface InstructorProfile {
  headline: string;
  experience: InstructorExperience[];
  expertise: string[];
}

export interface Instructor {
  name: string;
  title: string;
  bio: string;
  yearsExp: number;
  imagePlaceholder: string;
  image?: string;
  hasProfileCard?: boolean;
  profile?: InstructorProfile;
}

// ─── Drawer ───────────────────────────────────────────────────────────────────
export function InstructorProfileDrawer({
  instructor,
  accentColor = "#2f4e40",
  onClose,
}: {
  instructor: Instructor;
  accentColor?: string;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Trigger enter animation after mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Animate out then call onClose
  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 320); // match transition duration
  };

  // Escape key + body scroll lock
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const { profile } = instructor;

  return (
    <>
      {/* Global transition styles injected once */}
      <style>{`
        .drawer-overlay {
          transition: opacity 320ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .drawer-panel {
          transition: transform 320ms cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-label={`${instructor.name} profile`}
        className="drawer-overlay fixed inset-0 z-[100]"
        style={{
          backgroundColor: "rgba(10,10,10,0.55)",
          backdropFilter: "blur(4px)",
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Drawer panel */}
        <div
          className="drawer-panel absolute right-0 top-0 h-full flex flex-col overflow-hidden shadow-2xl w-full sm:w-[480px]"
          style={{
            backgroundColor: "#faf9f6",
            transform: visible ? "translateX(0)" : "translateX(100%)",
          }}
          // Stop clicks inside drawer from hitting overlay
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Coloured header ── */}
          <div
            className="relative flex flex-row items-end flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: accentColor }}
          >
            {/* Decorative blobs */}
            <div
              className="pointer-events-none absolute -top-8 -right-8 h-36 w-36 rounded-full opacity-10"
              style={{ backgroundColor: "#fff" }}
            />
            <div
              className="pointer-events-none absolute bottom-0 right-16 h-20 w-20 rounded-full opacity-10"
              style={{ backgroundColor: "#fff", transform: "translateY(50%)" }}
            />

            {/* Photo */}
            <div
              className="relative flex-shrink-0"
              style={{ width: 120, height: 152 }}
            >
              {instructor.image ? (
                <Image
                  src={instructor.image}
                  alt={`Portrait of ${instructor.name}`}
                  fill
                  className="object-cover object-top"
                  sizes="120px"
                  priority
                />
              ) : (
                <div
                  className="h-full w-full opacity-40"
                  style={{ backgroundColor: instructor.imagePlaceholder }}
                />
              )}
            </div>

            {/* Name / title / badge */}
            <div className="flex flex-1 flex-col justify-end px-5 pb-5 pt-8 min-w-0">
              {profile?.headline && (
                <p
                  className="mb-0.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] truncate"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {profile.headline}
                </p>
              )}
              <h2
                className="text-[1.15rem] font-bold leading-snug text-white"
                style={{ fontFamily: "var(--font-playfair, Georgia, serif)" }}
              >
                {instructor.name}
              </h2>
              <p
                className="mt-0.5 text-[0.72rem] leading-snug"
                style={{ color: "rgba(255,255,255,0.58)" }}
              >
                {instructor.title}
              </p>
              <div
                className="mt-3 inline-flex w-fit items-center rounded-full px-2.5 py-1"
                style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
              >
                <span className="text-[0.65rem] font-semibold text-white">
                  {instructor.yearsExp} yrs experience
                </span>
              </div>
            </div>

            {/* Close button — inside header */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-70"
              style={{ backgroundColor: "rgba(0,0,0,0.22)" }}
              aria-label="Close profile"
            >
              <X className="h-4 w-4 text-white" strokeWidth={2.5} />
            </button>
          </div>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Bio */}
            <div className="px-6 py-6 sm:px-8">
              <p
                className="text-[0.9rem] leading-[1.85]"
                style={{ color: "rgba(0,0,0,0.58)" }}
              >
                {instructor.bio}
              </p>
            </div>

            {/* Experience */}
            {profile?.experience && profile.experience.length > 0 && (
              <>
                <div
                  className="mx-6 h-px sm:mx-8"
                  style={{ backgroundColor: "rgba(0,0,0,0.07)" }}
                />
                <div className="px-6 py-6 sm:px-8">
                  <div className="mb-4 flex items-center gap-2">
                    <Briefcase
                      className="h-3.5 w-3.5 flex-shrink-0"
                      style={{ color: accentColor }}
                      strokeWidth={1.75}
                    />
                    <p
                      className="text-[0.62rem] font-bold uppercase tracking-[0.18em]"
                      style={{ color: "rgba(0,0,0,0.35)" }}
                    >
                      Experience
                    </p>
                  </div>

                  {/* Timeline */}
                  <div className="relative pl-5">
                    <div
                      className="absolute left-[7px] top-2 bottom-2 w-px"
                      style={{ backgroundColor: `${accentColor}28` }}
                    />
                    <div className="flex flex-col gap-5">
                      {profile.experience.map((exp, i) => (
                        <div key={i} className="relative">
                          <div
                            className="absolute -left-5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white"
                            style={{ backgroundColor: accentColor }}
                          />
                          <p
                            className="text-[0.84rem] font-semibold leading-tight"
                            style={{ color: "#1a1a1a" }}
                          >
                            {exp.role}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span
                              className="text-[0.76rem]"
                              style={{ color: "rgba(0,0,0,0.45)" }}
                            >
                              {exp.place}
                            </span>
                            {exp.period && (
                              <span
                                className="rounded px-1.5 py-0.5 text-[0.62rem] font-medium"
                                style={{
                                  backgroundColor: `${accentColor}14`,
                                  color: accentColor,
                                }}
                              >
                                {exp.period}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Expertise */}
            {profile?.expertise && profile.expertise.length > 0 && (
              <>
                <div
                  className="mx-6 h-px sm:mx-8"
                  style={{ backgroundColor: "rgba(0,0,0,0.07)" }}
                />
                <div className="px-6 py-6 sm:px-8">
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles
                      className="h-3.5 w-3.5 flex-shrink-0"
                      style={{ color: accentColor }}
                      strokeWidth={1.75}
                    />
                    <p
                      className="text-[0.62rem] font-bold uppercase tracking-[0.18em]"
                      style={{ color: "rgba(0,0,0,0.35)" }}
                    >
                      Core Expertise
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.expertise.map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-full px-3 py-1.5 text-[0.74rem] font-medium"
                        style={{
                          backgroundColor: `${accentColor}12`,
                          color: accentColor,
                          border: `1px solid ${accentColor}25`,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="h-10" />
          </div>
        </div>
      </div>
    </>
  );
}
