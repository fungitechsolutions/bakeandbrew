import Image from "next/image";
import {
  Phone,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  Hash,
  Users,
  User,
  Sparkles,
} from "lucide-react";
import type { StudentDashboardData } from "./types/dashboard";
import { siteInfo } from "@/utils/site-info";

interface StudentHeroProps {
  student: StudentDashboardData;
}

const SHIFT_LABEL: Record<StudentDashboardData["shift"], string> = {
  morning: "Morning",
  day: "Day",
  evening: "Evening",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: StudentDashboardData["status"] }) {
  const map = {
    active: {
      label: "Enrolled & Active",
      cls: "bg-[#2f4e40]/10 text-[#2f4e40] border border-[#2f4e40]/25",
      dot: "bg-[#2f4e40]",
    },
    completed: {
      label: "Completed",
      cls: "bg-[#c28a4f]/12 text-[#c28a4f] border border-[#c28a4f]/30",
      dot: "bg-[#c28a4f]",
    },
  } as const;

  const { label, cls, dot } = map[status];

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.14em] uppercase ${cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dot}`} />
      {label}
    </span>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  variant?: "default" | "highlighted";
}

function InfoCard({ icon, label, value, variant = "default" }: InfoCardProps) {
  const isHighlighted = variant === "highlighted";
  return (
    <div
      className={`
        group relative flex items-start gap-3 rounded-xl p-3.5
        border transition-all duration-200 cursor-default
        ${
          isHighlighted
            ? "bg-[#2f4e40]/[0.05] border-[#2f4e40]/20 hover:border-[#2f4e40]/35 hover:bg-[#2f4e40]/[0.08]"
            : "bg-white/70 border-[#1a1a1a]/[0.07] hover:border-[#c28a4f]/30 hover:bg-white/90"
        }
      `}
      style={{ backdropFilter: "blur(8px)" }}
    >
      <div
        className={`
          mt-0.5 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
          transition-transform duration-200 group-hover:scale-110
          ${
            isHighlighted
              ? "bg-[#2f4e40]/12 text-[#2f4e40]"
              : "bg-[#c28a4f]/10 text-[#c28a4f]"
          }
        `}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-[0.14em] font-semibold mb-0.5">
          {label}
        </p>
        <p className="text-sm text-[#1a1a1a] font-medium leading-snug">
          {value}
        </p>
      </div>
    </div>
  );
}

export function StudentHero({ student }: StudentHeroProps) {
  const initials = student.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "#fbfaf7",
        border: "1px solid rgba(26,26,26,0.08)",
        boxShadow:
          "0 1px 3px rgba(26,26,26,0.06), 0 8px 32px rgba(26,26,26,0.08)",
      }}
    >
      {/* Warm noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }}
      />

      {/* Soft warm radial from top-right */}
      <div
        className="absolute -top-16 -right-16 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(194,138,79,0.08) 0%, transparent 65%)",
        }}
      />

      {/* LEFT GREEN SIDEBAR STRIP */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{
          background:
            "linear-gradient(to bottom, #2f4e40 0%, #3a5a49 60%, rgba(47,78,64,0.3) 100%)",
        }}
      />

      <div className="relative pl-7 md:pl-9">
        {/* IDENTITY SECTION */}
        <div className="px-5 pt-6 pb-5 md:px-7 md:pt-7">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Avatar */}
            <div className="relative shrink-0 self-start">
              <div
                className="w-20 h-20 md:w-[88px] md:h-[88px] rounded-2xl overflow-hidden"
                style={{
                  boxShadow:
                    "0 0 0 3px #fbfaf7, 0 0 0 4px rgba(47,78,64,0.3), 0 8px 24px rgba(26,26,26,0.14)",
                }}
              >
                {student.photoUrl ? (
                  <Image
                    src={student.photoUrl}
                    alt={student.fullName}
                    width={88}
                    height={88}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #e8e4dc 0%, #ddd8ce 100%)",
                    }}
                  >
                    <span
                      className="text-2xl md:text-3xl font-bold text-[#2f4e40]"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {initials}
                    </span>
                  </div>
                )}
              </div>

              {/* Active dot */}
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#fbfaf7]"
                style={{
                  background: "#2f4e40",
                  boxShadow: "0 0 0 1px rgba(47,78,64,0.2)",
                }}
              />
            </div>

            {/* Name block */}
            <div className="flex-1 min-w-0 pt-0.5">
              <StatusBadge status={student.status} />

              <h1
                className="mt-2 text-2xl md:text-[1.85rem] font-bold leading-tight text-[#1a1a1a] tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {student.fullName}
              </h1>

              <p className="mt-1 text-xs font-semibold tracking-[0.1em] uppercase text-[#c28a4f]">
                {siteInfo.company.shortName}
              </p>
            </div>

            {/* Meta pills — top-right */}
            <div className="hidden sm:flex flex-col items-end gap-2 shrink-0 pt-0.5">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono text-[#1a1a1a]/50"
                style={{
                  background: "rgba(26,26,26,0.04)",
                  border: "1px solid rgba(26,26,26,0.08)",
                }}
              >
                <Hash size={11} className="text-[#c28a4f]" />
                REF&nbsp;{student.referenceNo}
              </div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono text-[#1a1a1a]/50"
                style={{
                  background: "rgba(26,26,26,0.04)",
                  border: "1px solid rgba(26,26,26,0.08)",
                }}
              >
                <Sparkles size={11} className="text-[#2f4e40]" />
                FY&nbsp;{student.fiscalYear}
              </div>
            </div>
          </div>

          {/* Mobile meta pills */}
          <div className="flex sm:hidden items-center gap-2 mt-3 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono text-[#1a1a1a]/50"
              style={{
                background: "rgba(26,26,26,0.04)",
                border: "1px solid rgba(26,26,26,0.08)",
              }}
            >
              <Hash size={10} className="text-[#c28a4f]" />
              REF {student.referenceNo}
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono text-[#1a1a1a]/50"
              style={{
                background: "rgba(26,26,26,0.04)",
                border: "1px solid rgba(26,26,26,0.08)",
              }}
            >
              <Sparkles size={10} className="text-[#2f4e40]" />
              FY {student.fiscalYear}
            </span>
          </div>
        </div>

        {/* DIVIDER with label */}
        <div className="mx-5 md:mx-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#1a1a1a]/[0.07]" />
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#1a1a1a]/25">
            Student Details
          </span>
          <div className="h-px flex-1 bg-[#1a1a1a]/[0.07]" />
        </div>

        {/* INFO GRID */}
        <div className="p-5 md:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          <InfoCard
            icon={<Phone size={13} />}
            label="Phone"
            value={student.phone}
          />
          <InfoCard
            icon={<Calendar size={13} />}
            label="Date of Birth"
            value={formatDate(student.dob)}
          />
          <InfoCard
            icon={<User size={13} />}
            label="Gender"
            value={student.gender}
          />
          <InfoCard
            icon={<MapPin size={13} />}
            label="Address"
            value={student.address}
          />
          <InfoCard
            icon={<Clock size={13} />}
            label="Shift"
            value={`${SHIFT_LABEL[student.shift]} · ${student.shiftTime}`}
            variant="highlighted"
          />
          {student.batch && (
            <InfoCard
              icon={<BookOpen size={13} />}
              label="Batch"
              value={student.batch}
              variant="highlighted"
            />
          )}
          <InfoCard
            icon={<Users size={13} />}
            label="Guardian"
            value={`${student.guardianName} · ${student.guardianPhone}`}
          />
          <InfoCard
            icon={<Hash size={13} />}
            label="Enrolled Since"
            value={formatDate(student.createdAt)}
            variant="highlighted"
          />
        </div>
      </div>
    </section>
  );
}
