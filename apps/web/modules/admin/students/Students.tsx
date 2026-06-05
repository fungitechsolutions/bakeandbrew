"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  GraduationCap,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { ListStudent } from "@repo/types";
import { StudentsError } from "./StudentError";
import { cn } from "@/lib/utils";
import { useDebounce } from "../analytics/hooks/useDebounce";
import { StudentCard } from "./StudentCard";
import { useStudentBatches } from "@/hooks/queries/admin/students/useStudentBtaches";

type Status = "pending" | "active" | "completed" | "rejected";

const COURSES = ["Barista", "Bakery", "Bartending", "Sushi"] as const;
const SHIFTS = ["morning", "day", "evening"] as const;
const BATCHES = ["1", "2", "3"] as const;

const STATUS_META: Record<
  Status,
  { label: string; dot: string; classes: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
  },
  active: {
    label: "Active",
    dot: "bg-emerald-400",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  completed: {
    label: "Completed",
    dot: "bg-blue-400",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-red-400",
    classes: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function StudentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  // Read from search params
  const statusFilter = (searchParams.get("status") ?? "all") as Status | "all";
  const courseFilter = searchParams.get("course") ?? "all";
  const shiftFilter = searchParams.get("shift") ?? "all";
  const batchFilter = searchParams.get("batch") ?? "all";
  const page = Number(searchParams.get("page") ?? "1");

  const debouncedSearch = useDebounce(searchInput, 400);

  // Search params updater
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === "" || val === "all") {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });
      if (!("page" in updates)) params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, pathname, router],
  );

  useEffect(() => {
    updateParams({ q: debouncedSearch });
  }, [debouncedSearch]);

  const handleStatus = (v: Status | "all") => updateParams({ status: v });
  const handleCourse = (v: string) => updateParams({ course: v });
  const handlePage = (p: number) => updateParams({ page: String(p) });
  const handleShift = (v: string) => updateParams({ shift: v });
  const handleBatch = (v: string) => updateParams({ batch: v });
  const clearFilters = () => {
    setSearchInput("");
    updateParams({
      status: null,
      course: null,
      q: null,
      shift: null,
      batch: null,
    });
  };

  const {
    data: batchesData,
    isPending: isBatchesPending,
    isError: isBatchesError,
    error: batchesError,
    refetch: refetchBatches,
  } = useStudentBatches();

  const batches = batchesData?.batches ?? [];
  const showBatchFilter =
    !isBatchesPending && !isBatchesError && batches.length > 0;

  const { data, isPending, refetch, isError } = useQuery({
    queryKey: [
      "admin-list-students",
      page,
      statusFilter,
      courseFilter,
      shiftFilter,
      batchFilter,
      debouncedSearch,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (courseFilter !== "all") params.set("course", courseFilter);
      if (shiftFilter !== "all") params.set("shift", shiftFilter);
      if (batchFilter !== "all") params.set("batch", batchFilter);

      const res = await api.get<ListStudent>(
        `/admin/students?${params.toString()}`,
      );
      return res.data;
    },
  });

  const isSuccess = data?.success === true;
  const students = isSuccess ? data.data : [];
  const totalStudents = isSuccess ? data.meta.total : 0;
  const totalPages = isSuccess ? data.meta.totalPages : 0;

  const activeFilterCount = [
    statusFilter !== "all",
    courseFilter !== "all",
    shiftFilter !== "all",
    batchFilter !== "all",
    searchInput !== "",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-(--brand-cream) px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-8xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              className="text-[2rem] font-bold leading-tight text-[#2d4a3e]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Students
            </h1>
            <p
              className="mt-0.5 text-[0.82rem] text-[#2d4a3e]/45"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {isPending ? (
                <span className="inline-block h-3 w-32 animate-pulse bg-[#2d4a3e]/08" />
              ) : (
                <>
                  {students.length} of {totalStudents} student
                  {totalStudents !== 1 ? "s" : ""}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="inline-flex items-center gap-1.5 border border-[#2d4a3e]/15 bg-white px-3 py-1.5 text-[0.75rem] font-medium text-[#2d4a3e]/50"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              <GraduationCap className="h-3.5 w-3.5" strokeWidth={1.75} />
              {isPending ? "—" : `${totalStudents} enrolled`}
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 flex flex-col gap-3">
          {/* Search bar */}
          <div className="flex items-stretch gap-0 border border-[#2d4a3e]/12 bg-white">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2d4a3e]/30"
                strokeWidth={1.75}
              />
              <input
                type="text"
                placeholder="Search by name, reference or phone…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-full w-full border-0 bg-transparent py-3.5 pl-11 pr-4 text-[0.88rem] text-[#2d4a3e] outline-none placeholder:text-[#2d4a3e]/30 focus:ring-0"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2d4a3e]/30 hover:text-[#2d4a3e]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex items-center border-l border-[#2d4a3e]/10 px-4">
              <SlidersHorizontal
                className="h-4 w-4 text-[#2d4a3e]/35"
                strokeWidth={1.75}
              />
              {activeFilterCount > 0 && (
                <span className="ml-1.5 flex h-4 w-4 items-center justify-center bg-[#e8552a] text-[0.58rem] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </div>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => handleStatus(e.target.value as Status | "all")}
                className={cn(
                  "appearance-none cursor-pointer border py-1.5 pl-3 pr-7 text-[0.75rem] font-semibold uppercase tracking-wide outline-none transition-all",
                  statusFilter !== "all"
                    ? "border-[#2d4a3e] bg-[#2d4a3e] text-white"
                    : "border-[#2d4a3e]/15 bg-white text-[#2d4a3e]/55 hover:border-[#2d4a3e]/30 hover:text-[#2d4a3e]",
                )}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                <option value="all">All statuses</option>
                {(Object.keys(STATUS_META) as Status[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={cn(
                  "pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2",
                  statusFilter !== "all"
                    ? "text-white/70"
                    : "text-[#2d4a3e]/35",
                )}
              />
            </div>

            {/* Course */}
            <div className="relative">
              <select
                value={courseFilter}
                onChange={(e) => handleCourse(e.target.value)}
                className={cn(
                  "appearance-none cursor-pointer border py-1.5 pl-3 pr-7 text-[0.75rem] font-semibold uppercase tracking-wide outline-none transition-all",
                  courseFilter !== "all"
                    ? "border-[#2d4a3e] bg-[#2d4a3e] text-white"
                    : "border-[#2d4a3e]/15 bg-white text-[#2d4a3e]/55 hover:border-[#2d4a3e]/30 hover:text-[#2d4a3e]",
                )}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                <option value="all">All courses</option>
                {COURSES.map((c) => (
                  <option key={c} value={c.toLowerCase()}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={cn(
                  "pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2",
                  courseFilter !== "all"
                    ? "text-white/70"
                    : "text-[#2d4a3e]/35",
                )}
              />
            </div>

            {/* Shift */}
            <div className="relative">
              <select
                value={shiftFilter}
                onChange={(e) => handleShift(e.target.value)}
                className={cn(
                  "appearance-none cursor-pointer border py-1.5 pl-3 pr-7 text-[0.75rem] font-semibold uppercase tracking-wide outline-none transition-all",
                  shiftFilter !== "all"
                    ? "border-[#2d4a3e] bg-[#2d4a3e] text-white"
                    : "border-[#2d4a3e]/15 bg-white text-[#2d4a3e]/55 hover:border-[#2d4a3e]/30 hover:text-[#2d4a3e]",
                )}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                <option value="all">All shifts</option>
                {SHIFTS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={cn(
                  "pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2",
                  shiftFilter !== "all" ? "text-white/70" : "text-[#2d4a3e]/35",
                )}
              />
            </div>

            {/* Batch */}
            {isBatchesPending ? (
              <div
                className="h-[30px] w-[7.5rem] animate-pulse border border-[#2d4a3e]/15 bg-[#2d4a3e]/06"
                aria-label="Loading batches"
              />
            ) : isBatchesError ? (
              <button
                type="button"
                onClick={() => refetchBatches()}
                title={
                  batchesError instanceof Error
                    ? batchesError.message
                    : "Failed to load batches"
                }
                className="border border-red-200 bg-red-50 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-wide text-red-600 transition-colors hover:bg-red-100"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Batches failed · Retry
              </button>
            ) : showBatchFilter ? (
              <div className="relative">
                <select
                  value={batchFilter}
                  onChange={(e) => handleBatch(e.target.value)}
                  className={cn(
                    "appearance-none cursor-pointer border py-1.5 pl-3 pr-7 text-[0.75rem] font-semibold uppercase tracking-wide outline-none transition-all",
                    batchFilter !== "all"
                      ? "border-[#2d4a3e] bg-[#2d4a3e] text-white"
                      : "border-[#2d4a3e]/15 bg-white text-[#2d4a3e]/55 hover:border-[#2d4a3e]/30 hover:text-[#2d4a3e]",
                  )}
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  <option value="all">All batches</option>
                  {batches.map((b, idx) => (
                    <option key={`${b}-${idx}`} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={cn(
                    "pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2",
                    batchFilter !== "all"
                      ? "text-white/70"
                      : "text-[#2d4a3e]/35",
                  )}
                />
              </div>
            ) : null}

            {/* Clear all */}
            {activeFilterCount > 0 && (
              <>
                <div className="h-5 w-px bg-[#2d4a3e]/15" />
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-[0.72rem] font-medium text-[#e8552a] underline-offset-2 hover:underline"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  <X className="h-3 w-3" />
                  Clear all
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Cards Grid ───────────────────────────────────────────────────── */}
        {isPending ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden border border-[#2d4a3e]/10 bg-white"
              >
                <div className="h-0.5 w-full animate-pulse bg-[#2d4a3e]/08" />
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-36 animate-pulse bg-[#2d4a3e]/08" />
                      <div className="h-3 w-24 animate-pulse bg-[#2d4a3e]/06" />
                    </div>
                    <div className="h-5 w-16 animate-pulse rounded-full bg-[#2d4a3e]/08" />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 shrink-0 animate-pulse bg-[#2d4a3e]/06" />
                    <div className="h-3 w-28 animate-pulse bg-[#2d4a3e]/08" />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-5 w-14 animate-pulse bg-[#2d4a3e]/06" />
                    <div className="h-5 w-16 animate-pulse bg-[#2d4a3e]/06" />
                  </div>
                </div>
                <div className="h-10 animate-pulse border-t border-[#2d4a3e]/08 bg-[#2d4a3e]/04" />
              </div>
            ))}
          </div>
        ) : isError || !isSuccess ? (
          <StudentsError
            error={
              isError
                ? {
                    message: "Unable to reach the server.",
                    code: "NETWORK_ERROR",
                  }
                : {
                    message: !data.success
                      ? data.message
                      : "Something went wrong",
                    code: !data.success ? data.code : "SOMETHING_WENT_WRONG",
                  }
            }
            onRetry={refetch}
            variant="list"
          />
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-[#2d4a3e]/10 bg-white py-24">
            <GraduationCap
              className="mb-4 h-10 w-10 text-[#2d4a3e]/20"
              strokeWidth={1.25}
            />
            <p
              className="text-[0.9rem] font-semibold text-[#2d4a3e]/40"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              No students match your filters
            </p>
            <button
              onClick={clearFilters}
              className="mt-3 text-[0.8rem] font-medium text-[#e8552a] underline-offset-2 hover:underline"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}

        {/* ── Pagination ───────────────────────────────────────────────────── */}
        {!isPending && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p
              className="text-[0.78rem] text-[#2d4a3e]/40"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Page {page} of {totalPages} · {totalStudents} total
            </p>

            <div className="flex items-center gap-0">
              <button
                onClick={() => handlePage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center border border-[#2d4a3e]/15 bg-white text-[#2d4a3e] transition-colors hover:bg-[#2d4a3e]/05 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                    acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="-ml-px flex h-8 w-8 items-center justify-center border border-[#2d4a3e]/15 bg-white text-[0.78rem] text-[#2d4a3e]/35"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => handlePage(p as number)}
                      className={cn(
                        "-ml-px flex h-8 w-8 items-center justify-center border text-[0.78rem] font-semibold transition-colors",
                        page === p
                          ? "border-[#2d4a3e] bg-[#2d4a3e] text-white"
                          : "border-[#2d4a3e]/15 bg-white text-[#2d4a3e] hover:bg-[#2d4a3e]/05",
                      )}
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {p}
                    </button>
                  ),
                )}

              <button
                onClick={() => handlePage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="-ml-px flex h-8 w-8 items-center justify-center border border-[#2d4a3e]/15 bg-white text-[#2d4a3e] transition-colors hover:bg-[#2d4a3e]/05 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
