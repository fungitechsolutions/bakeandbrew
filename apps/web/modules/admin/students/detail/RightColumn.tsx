import { StudentDetail, StudentEnrolledCourses } from "@repo/types";
import { SectionCard } from "./SectionCard";
import { AlertCircle, BookOpen, Hash } from "lucide-react";

type Student = Extract<StudentDetail, { success: true }>["data"];
type Course = Extract<
  StudentEnrolledCourses,
  { success: true }
>["data"][number];

export function RightColumn({
  courses,
  totalFee,
  student,
}: {
  courses: Course[];
  totalFee: number;
  student: Student;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Courses */}
      <SectionCard title="Enrolled Courses" icon={BookOpen}>
        <div className="flex flex-col gap-3">
          {courses.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-[#2d4a3e]/08 bg-[#f4f1ec]/50 px-4 py-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-[#e8552a]" />
                <span
                  className="text-[0.9rem] font-medium text-[#2d4a3e]"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {c.name}
                </span>
              </div>
              <span
                className="text-[0.82rem] font-semibold text-[#2d4a3e]"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                NPR {(c.feeAtEnrollment / 100).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between border-t border-[#2d4a3e]/08 pt-3">
            <span
              className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#2d4a3e]/50"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Total
            </span>
            <span
              className="text-[0.95rem] font-bold text-[#2d4a3e]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              NPR {totalFee.toLocaleString()}
            </span>
          </div>
        </div>
      </SectionCard>

      {/* Enrollment meta */}
      <SectionCard title="Enrollment Details" icon={Hash}>
        <div className="flex flex-col gap-3">
          {[
            { label: "Fiscal Year", value: student.fiscalYear },
            { label: "Serial No", value: `#${student.serialNo}` },
            {
              label: "Enrolled On",
              value: new Date(student.createdAt).toLocaleDateString("en-NP", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span
                className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#2d4a3e]/40"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {label}
              </span>
              <span
                className="text-[0.88rem] font-medium text-[#2d4a3e]"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Notes */}
      {student.notes && (
        <SectionCard title="Admin Notes" icon={AlertCircle}>
          <p
            className="rounded-xl bg-amber-50 px-4 py-3 text-[0.85rem] leading-[1.6] text-amber-800"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {student.notes}
          </p>
        </SectionCard>
      )}
    </div>
  );
}
