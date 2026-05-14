"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { InstructorProfileModal } from "./InstructorProfileModal";
import { Instructor } from "@/utils/mock";
import { InstructorProfileDrawer } from "./InstructorProfileDrawer";

interface SectionLabelProps {
  children: React.ReactNode;
}

// ── SectionLabel (replace with your actual import) ───────────────────────────
function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-black/40">
      {children}
    </p>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function InstructorSection({
  course,
}: {
  course: { instructor: Instructor; color: string };
}) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <div className="mx-auto max-w-5xl">
        <SectionLabel>Your Instructor</SectionLabel>
        <div className="mt-10 grid grid-cols-1 items-center gap-12 sm:grid-cols-[220px_1fr]">
          {/* Avatar Container */}
          <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
            <div className="relative h-36 w-36 overflow-hidden rounded-2xl sm:h-44 sm:w-44">
              {course.instructor.image ? (
                <Image
                  src={course.instructor.image}
                  alt={`Portrait of ${course.instructor.name}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 144px, 176px"
                  priority
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    backgroundColor: course.instructor.imagePlaceholder,
                    opacity: 0.25,
                  }}
                  aria-hidden
                />
              )}
            </div>
            <div>
              <p
                className="text-[1.15rem] font-bold"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "var(--brand-ink, #1a1a1a)",
                }}
              >
                {course.instructor.name}
              </p>
              <p className="mt-1 text-[0.82rem] text-black/45">
                {course.instructor.title}
              </p>
            </div>

            {/* ── View Profile button ── */}
            {course.instructor.hasProfileCard && (
              <button
                onClick={() => setShowProfile(true)}
                className="group flex items-center gap-2 rounded-full border px-4 py-2 text-[0.8rem] font-medium transition-all duration-200"
                style={{
                  borderColor: "var(--brand-green, #2f4e40)",
                  color: "var(--brand-green, #2f4e40)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--brand-green, #2f4e40)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--brand-green, #2f4e40)";
                }}
              >
                View Instructor Profile
              </button>
            )}
          </div>

          {/* Bio */}
          <div>
            <p
              className="mb-6 text-[1rem] leading-[1.85] text-black/60"
              style={{ maxWidth: "60ch" }}
            >
              {course.instructor.bio}
            </p>
            <div className="flex items-center gap-3">
              <BookOpen
                className="h-4 w-4"
                style={{ color: "var(--brand-green, #2f4e40)" }}
                strokeWidth={1.75}
              />
              <span className="text-[0.875rem] text-black/55">
                <strong style={{ color: "var(--brand-ink, #1a1a1a)" }}>
                  {course.instructor.yearsExp} years
                </strong>{" "}
                of industry experience
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showProfile && (
        <InstructorProfileDrawer
          instructor={course.instructor}
          accentColor={course.color}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}
