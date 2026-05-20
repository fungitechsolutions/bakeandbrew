import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import type { Course } from "./types/dashboard";

interface EnrolledCoursesProps {
  courses: Course[];
}

function formatNPR(amount: number): string {
  return `NPR ${amount.toLocaleString("en-NP")}`;
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="group flex items-center justify-between gap-4 p-4 rounded-xl border border-[#1a1a1a]/8 bg-white hover:border-[#2f4e40]/25 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-[#2f4e40]/8 flex items-center justify-center transition-colors duration-200 group-hover:bg-[#2f4e40]/15">
          <BookOpen size={18} className="text-[#2f4e40]" />
        </div>
        <div className="min-w-0">
          <p
            className="text-sm font-semibold text-[#1a1a1a] leading-snug truncate"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {course.name}
          </p>
          <p className="text-xs text-[#1a1a1a]/40 mt-0.5 font-medium">
            {formatNPR(course.feeAtEnrollment)} enrolled fee
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {course.isActive && (
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-[#2f4e40] bg-[#2f4e40]/8 px-2.5 py-1 rounded-full border border-[#2f4e40]/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2f4e40]" />
            Active
          </span>
        )}
        <Link
          href={`/courses/${course.slug}`}
          className="p-1.5 rounded-lg text-[#1a1a1a]/30 hover:text-[#2f4e40] hover:bg-[#2f4e40]/8 transition-all duration-150"
          aria-label={`View ${course.name}`}
        >
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export function EnrolledCourses({ courses }: EnrolledCoursesProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-base font-semibold text-[#1a1a1a] tracking-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Enrolled Courses
        </h2>
        <span className="text-xs text-[#1a1a1a]/40 font-medium bg-[#1a1a1a]/5 px-2.5 py-1 rounded-full">
          {courses.length} {courses.length === 1 ? "course" : "courses"}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
