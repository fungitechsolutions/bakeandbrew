"use client";

import {
  BookOpen,
  AlertCircle,
  RefreshCw,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GetStudentCoursesResponse } from "@repo/types";
import api from "@/lib/axios";
import Link from "next/link";

type CourseItem = Extract<
  GetStudentCoursesResponse,
  { success: true }
>["data"][number];

function formatNPR(amount: number): string {
  return `NPR ${amount.toLocaleString("en-NP")}`;
}

function CourseCard({ course }: { course: CourseItem }) {
  return (
    <div className="flex items-center justify-between gap-3.5 p-4 rounded-xl border border-[#1a1a1a]/8 bg-white hover:border-[#2f4e40]/25 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-[#2f4e40]/8 flex items-center justify-center">
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
            {formatNPR(course.feeAtEnrollment / 100)} enrolled fee
          </p>
        </div>
      </div>

      <Link
        href={`/courses/${course.slug}`}
        className="p-1.5 rounded-lg text-[#1a1a1a]/30 hover:text-[#2f4e40] hover:bg-[#2f4e40]/8 transition-all duration-150 shrink-0"
        aria-label={`View ${course.name}`}
      >
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(90deg, rgba(26,26,26,0.06) 0%, rgba(26,26,26,0.1) 50%, rgba(26,26,26,0.06) 100%)",
        backgroundSize: "200% 100%",
        animation: "courses-shimmer 1.5s ease-in-out infinite",
      }}
    />
  );
}

function EnrolledCoursesSkeleton() {
  return (
    <section>
      <style>{`
        @keyframes courses-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div className="flex items-center justify-between mb-4">
        <Shimmer className="h-4 w-36" />
        <Shimmer className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 p-4 rounded-xl border border-[#1a1a1a]/8 bg-white"
          >
            <Shimmer className="w-10 h-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Shimmer className="h-4 w-48" />
              <Shimmer className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EnrolledCoursesError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <section>
      <h2
        className="text-base font-semibold text-[#1a1a1a] mb-4 tracking-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Enrolled Courses
      </h2>
      <div className="rounded-xl border border-red-100 bg-red-50/60 px-5 py-8 flex flex-col items-center text-center gap-3">
        <AlertCircle size={20} className="text-red-400" />
        <div>
          <p className="text-sm font-semibold text-[#1a1a1a] mb-1">
            Couldn&apos;t load courses
          </p>
          <p className="text-xs text-[#1a1a1a]/45 leading-relaxed max-w-xs">
            {message ?? "Something went wrong fetching your enrolled courses."}
          </p>
        </div>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#2f4e40] bg-[#2f4e40]/8 border border-[#2f4e40]/20 hover:bg-[#2f4e40]/14 transition-all duration-150 active:scale-95"
        >
          <RefreshCw size={13} />
          Try again
        </button>
      </div>
    </section>
  );
}

function EnrolledCoursesEmpty() {
  return (
    <div className="rounded-xl border border-[#1a1a1a]/8 bg-white px-5 py-10 flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a]/5 flex items-center justify-center">
        <GraduationCap size={22} className="text-[#1a1a1a]/25" />
      </div>
      <div>
        <p
          className="text-sm font-semibold text-[#1a1a1a]/40 mb-1"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          No courses enrolled
        </p>
        <p className="text-xs text-[#1a1a1a]/30 leading-relaxed max-w-[200px]">
          Your enrolled courses will appear here once confirmed.
        </p>
      </div>
    </div>
  );
}

export function EnrolledCourses() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["student-courses"],
    queryFn: async () => {
      const res = await api.get<GetStudentCoursesResponse>(
        "/portal/student/courses",
      );
      const parsed = res.data;

      if (!parsed.success) {
        throw new Error(parsed.message ?? "Failed to load courses");
      }

      return parsed.data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 10, // 10 min — enrollments rarely change mid-session
  });

  if (isPending) return <EnrolledCoursesSkeleton />;

  if (isError) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return <EnrolledCoursesError message={message} onRetry={refetch} />;
  }

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
          {data.length} {data.length === 1 ? "course" : "courses"}
        </span>
      </div>

      {data.length === 0 ? (
        <EnrolledCoursesEmpty />
      ) : (
        <div className="flex flex-col gap-2.5">
          {data.map((course) => (
            <CourseCard key={`${course.slug}`} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}
