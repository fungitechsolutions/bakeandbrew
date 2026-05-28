"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchOutstandingStudents } from "./lib/api";
import type {
  OutstandingFilters,
  OutstandingResponse,
  APIResponse,
} from "./types/outstanding";
import { OutstandingSummaryCard } from "./OutstandingSummaryCard";
import { StudentTableRow, StudentTableSkeleton } from "./StudentTableRow";
import { Pagination } from "./OutstandingPagination";
import { ErrorState } from "./OustandingError";
import { EmptyState } from "./OustandingEmpty";
import { OutstandingFiltersBar } from "./OutstandingFiltersBar";
import Link from "next/link";

function parseFilters(searchParams: URLSearchParams): OutstandingFilters {
  return {
    page: Math.max(1, parseInt(searchParams.get("page") ?? "1", 10)),
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
    search: searchParams.get("search") ?? "",
  };
}

export function OutstandingStudentsView() {
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams);

  const { data, isPending, isError, refetch } = useQuery<
    APIResponse<OutstandingResponse>
  >({
    queryKey: ["outstanding-students", filters],
    queryFn: () => fetchOutstandingStudents(filters),
    staleTime: 30000,
  });

  const meta = data?.meta;
  const students = data?.data?.students ?? [];
  const totalOutstandingFees = data?.data?.totalOutstandingFees ?? 0;
  const isEmpty =
    !isPending && !isError && meta !== undefined && meta.total === 0;

  return (
    <div className="mx-auto px-6 pt-8 pb-16 max-md:px-4 max-md:pt-5 max-md:pb-12">
      {/* Header */}
      <header className="flex items-start justify-between mb-7 gap-4 flex-wrap">
        <div>
          <h1 className="font-[var(--font-playfair)] text-[32px] font-bold text-[#1a1a1a] m-0 mb-1 tracking-[-0.02em] max-md:text-2xl">
            Outstanding Fees
          </h1>
          <p className="font-[var(--font-dm-sans)] text-sm text-[#9e9589] m-0">
            Students with pending fee balances
          </p>
        </div>
        {!isPending && !isError && meta && meta.total > 0 && (
          <span className="self-center px-3.5 py-1.5 bg-[#f0f7f3] text-[#2f4e40] rounded-[20px] font-[var(--font-dm-sans)] text-[13px] font-semibold whitespace-nowrap">
            {meta.total} students
          </span>
        )}
      </header>

      <OutstandingSummaryCard
        totalOutstandingFees={totalOutstandingFees}
        totalStudents={meta?.total ?? 0}
        isLoading={isPending}
      />

      <OutstandingFiltersBar isPending={isPending} />

      {/* Table card */}
      <div className="bg-white border border-[#e8e3da] rounded-[14px] overflow-hidden">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop table */}
            <div className="overflow-x-auto max-md:hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-5 py-3.5 text-left font-[var(--font-dm-sans)] text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9e9589] bg-[#faf8f4] border-b border-[#e8e3da] whitespace-nowrap">
                      Student
                    </th>
                    <th className="px-5 py-3.5 text-left font-[var(--font-dm-sans)] text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9e9589] bg-[#faf8f4] border-b border-[#e8e3da] whitespace-nowrap">
                      Course Fee
                    </th>
                    <th className="px-5 py-3.5 text-left font-[var(--font-dm-sans)] text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9e9589] bg-[#faf8f4] border-b border-[#e8e3da] whitespace-nowrap">
                      Paid
                    </th>
                    <th className="px-5 py-3.5 text-left font-[var(--font-dm-sans)] text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9e9589] bg-[#faf8f4] border-b border-[#e8e3da] whitespace-nowrap">
                      Discounts
                    </th>
                    <th className="px-5 py-3.5 text-left font-[var(--font-dm-sans)] text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9e9589] bg-[#faf8f4] border-b border-[#e8e3da] whitespace-nowrap">
                      Scholarship
                    </th>
                    <th className="px-5 py-3.5 text-left font-[var(--font-dm-sans)] text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9e9589] bg-[#faf8f4] border-b border-[#e8e3da] whitespace-nowrap">
                      Outstanding
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isPending ? (
                    <StudentTableSkeleton />
                  ) : (
                    students.map((student) => (
                      <StudentTableRow key={student.userId} student={student} />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="hidden max-md:block">
              {isPending
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 border-b border-[#f0ede8]">
                      {/* Skeleton top row */}
                      <div className="flex gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#e8e3da] shrink-0 animate-[shimmer_1.5s_infinite]" />
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="h-3.5 w-2/5 bg-[#e8e3da] rounded animate-[shimmer_1.5s_infinite]" />
                          <div className="h-3.5 w-2/5 bg-[#e8e3da] rounded animate-[shimmer_1.5s_infinite]" />
                          <div className="h-3.5 w-2/5 bg-[#e8e3da] rounded animate-[shimmer_1.5s_infinite]" />
                          <div className="h-3 w-3/5 bg-[#e8e3da] rounded animate-[shimmer_1.5s_infinite]" />
                        </div>
                      </div>
                      {/* Skeleton amounts */}
                      <div className="flex flex-col gap-2">
                        <div className="h-3 w-1/2 bg-[#e8e3da] rounded animate-[shimmer_1.5s_infinite]" />
                        <div className="h-3 w-1/2 bg-[#e8e3da] rounded animate-[shimmer_1.5s_infinite]" />
                        <div className="h-3 w-1/2 bg-[#e8e3da] rounded animate-[shimmer_1.5s_infinite]" />
                        <div className="h-3 w-1/2 bg-[#e8e3da] rounded animate-[shimmer_1.5s_infinite]" />
                        <div className="h-6 w-[35%] bg-[#e8e3da] rounded-[20px] animate-[shimmer_1.5s_infinite]" />
                      </div>
                    </div>
                  ))
                : students.map((student) => (
                    <Link
                      href={`/admin/students/${student.userId}`}
                      key={student.userId}
                      className="block p-4 border-b border-[#f0ede8] last:border-b-0 transition-colors duration-[120ms] hover:bg-[#f9f7f3]"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#2f4e40] text-[#c28a4f] font-[var(--font-dm-sans)] text-[13px] font-bold flex items-center justify-center shrink-0">
                          {student.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <div className="font-[var(--font-dm-sans)] text-sm font-semibold text-[#1a1a1a]">
                            {student.name}
                          </div>
                          <div className="font-[var(--font-dm-sans)] text-xs text-[#9e9589] mt-0.5">
                            {student.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 pl-[52px]">
                        <div className="flex justify-between items-center">
                          <span className="font-[var(--font-dm-sans)] text-xs text-[#9e9589]">
                            Course Fee
                          </span>
                          <span className="font-[var(--font-dm-sans)] text-[13px] font-medium text-[#4a4540] tabular-nums">
                            {new Intl.NumberFormat("en-NP", {
                              style: "currency",
                              currency: "NPR",
                              minimumFractionDigits: 0,
                            }).format(student.totalCourseFee / 100)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-[var(--font-dm-sans)] text-xs text-[#9e9589]">
                            Paid
                          </span>
                          <span className="font-[var(--font-dm-sans)] text-[13px] font-medium text-[#2f4e40] tabular-nums">
                            {new Intl.NumberFormat("en-NP", {
                              style: "currency",
                              currency: "NPR",
                              minimumFractionDigits: 0,
                            }).format(student.totalPaid / 100)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-[var(--font-dm-sans)] text-xs text-[#9e9589]">
                            Discounts
                          </span>
                          <span className="font-[var(--font-dm-sans)] text-[13px] font-medium text-[#2f4e40] tabular-nums">
                            {new Intl.NumberFormat("en-NP", {
                              style: "currency",
                              currency: "NPR",
                              minimumFractionDigits: 0,
                            }).format(student.totalDiscount / 100)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-[var(--font-dm-sans)] text-xs text-[#9e9589]">
                            Scholarship
                          </span>
                          <span className="font-[var(--font-dm-sans)] text-[13px] font-medium text-[#2f4e40] tabular-nums">
                            {new Intl.NumberFormat("en-NP", {
                              style: "currency",
                              currency: "NPR",
                              minimumFractionDigits: 0,
                            }).format(student.totalScholarship / 100)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-[var(--font-dm-sans)] text-xs text-[#9e9589]">
                            Outstanding
                          </span>
                          <span className="font-[var(--font-dm-sans)] text-[13px] font-bold text-[#b91c1c] tabular-nums">
                            {new Intl.NumberFormat("en-NP", {
                              style: "currency",
                              currency: "NPR",
                              minimumFractionDigits: 0,
                            }).format(student.outstanding / 100)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="border-t border-[#f0ede8]">
                <Pagination
                  page={filters.page}
                  totalPages={meta.totalPages}
                  isDisabled={isPending}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
