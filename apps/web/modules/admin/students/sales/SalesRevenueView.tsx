"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchSalesRevenue } from "./lib/api";
import type { APIResponse, SalesFilters, SalesResponse } from "./types/sales";
import { SalesTableRow, SalesTableSkeleton } from "./SalesTableRow";
import { Pagination } from "./SalesPagination";
import { EmptyState, ErrorState } from "./EmptyState";
import { SalesSummaryCard } from "./SalesSummaryCard";
import { SalesFiltersBar } from "./SalesFiltersBar";
import Link from "next/link";

function parseFilters(searchParams: URLSearchParams): SalesFilters {
  return {
    page: Math.max(1, parseInt(searchParams.get("page") ?? "1", 10)),
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
    // search: searchParams.get("search") ?? "",
  };
}

export function SalesRevenueView() {
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams);

  const { data, isPending, isError, refetch } = useQuery<
    APIResponse<SalesResponse>
  >({
    queryKey: ["sales-revenue", filters],
    queryFn: () => fetchSalesRevenue(filters),
    staleTime: 30000,
  });

  const meta = data?.meta;
  const students = data?.data?.students ?? [];
  const totalCollected = data?.data?.totalSalesFees ?? 0;
  const isEmpty =
    !isPending && !isError && meta !== undefined && meta.total === 0;

  return (
    <div className=" mx-auto px-6 pt-8 pb-16 max-[768px]:px-4 max-[768px]:pt-5 max-[768px]:pb-12">
      {/* Header */}
      <header className="flex items-start justify-between mb-7 gap-4 flex-wrap">
        <div>
          <h1 className="font-playfair text-[32px] max-[768px]:text-2xl font-bold text-[#1a1a1a] m-0 mb-1 tracking-[-0.02em]">
            Sales Revenue
          </h1>
          <p className="font-dm-sans text-sm text-[#9e9589] m-0">
            Fee collections across all students
          </p>
        </div>
        {!isPending && !isError && meta && meta.total > 0 && (
          <span className="px-[14px] py-1.5 bg-[#f0f7f3] text-[#2f4e40] rounded-[20px] font-dm-sans text-[13px] font-semibold whitespace-nowrap self-center">
            {meta.total} students
          </span>
        )}
      </header>

      <SalesSummaryCard
        totalCollected={totalCollected / 100}
        totalStudents={meta?.total ?? 0}
        isLoading={isPending}
      />
      {!isPending && <SalesFiltersBar isPending={isPending} />}

      {/* Table card */}
      <div className="bg-white border border-[#e8e3da] rounded-[14px] overflow-hidden">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop table — hidden on mobile */}
            <div className="overflow-x-auto max-[768px]:hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-5 py-[14px] text-left font-dm-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9e9589] bg-[#faf8f4] border-b border-[#e8e3da] whitespace-nowrap">
                      Student
                    </th>
                    <th className="px-5 py-[14px] text-right font-dm-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9e9589] bg-[#faf8f4] border-b border-[#e8e3da] whitespace-nowrap">
                      Course Fee
                    </th>
                    <th className="px-5 py-[14px] text-right font-dm-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9e9589] bg-[#faf8f4] border-b border-[#e8e3da] whitespace-nowrap">
                      Collected
                    </th>
                    <th className="px-5 py-[14px] text-right font-dm-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9e9589] bg-[#faf8f4] border-b border-[#e8e3da] whitespace-nowrap">
                      Discounts
                    </th>
                    <th className="px-5 py-[14px] text-right font-dm-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9e9589] bg-[#faf8f4] border-b border-[#e8e3da] whitespace-nowrap">
                      Scholarship
                    </th>
                    <th className="px-5 py-[14px] text-right font-dm-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9e9589] bg-[#faf8f4] border-b border-[#e8e3da] whitespace-nowrap">
                      Remaining
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isPending ? (
                    <SalesTableSkeleton />
                  ) : (
                    students.map((student) => (
                      <SalesTableRow key={student.userId} student={student} />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards — hidden on desktop */}
            <div className="hidden max-[768px]:block">
              {isPending
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 border-b border-[#f0ede8]">
                      <div className="flex gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#e8e3da] shrink-0 animate-shimmer" />
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="h-[14px] w-[20%] bg-[#e8e3da] rounded-[4px] animate-shimmer" />
                          <div className="h-[14px] w-[10%] bg-[#e8e3da] rounded-[4px] animate-shimmer" />
                          <div className="h-[14px] w-[10%] bg-[#e8e3da] rounded-[4px] animate-shimmer" />
                          <div className="h-3 w-[60%] bg-[#e8e3da] rounded-[4px] animate-shimmer" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="h-3 w-[50%] bg-[#e8e3da] rounded-[4px] animate-shimmer" />
                        <div className="h-3 w-[50%] bg-[#e8e3da] rounded-[4px] animate-shimmer" />
                        <div className="h-3 w-[50%] bg-[#e8e3da] rounded-[4px] animate-shimmer" />
                        <div className="h-[22px] w-[35%] bg-[#e8e3da] rounded-[20px] animate-shimmer" />
                        <div className="h-[22px] w-[35%] bg-[#e8e3da] rounded-[20px] animate-shimmer" />
                      </div>
                    </div>
                  ))
                : students.map((student) => {
                    const pct =
                      student.totalCourseFee > 0
                        ? Math.min(
                            (student.totalPaid / student.totalCourseFee) * 100,
                            100,
                          )
                        : 0;
                    const fmt = (n: number) =>
                      new Intl.NumberFormat("en-NP", {
                        style: "currency",
                        currency: "NPR",
                        minimumFractionDigits: 0,
                      }).format(n / 100);

                    return (
                      <Link
                        href={`/admin/students/${student.studentId}`}
                        key={student.userId}
                        className="block p-4 border-b  border-[#f0ede8] last:border-b-0 transition-[background] duration-[120ms] hover:bg-[#f9f7f3]"
                      >
                        {/* Card header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-[#2f4e40] text-[#c28a4f] font-dm-sans text-[13px] font-bold flex items-center justify-center shrink-0">
                            {student.name
                              .split(" ")
                              .slice(0, 2)
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-dm-sans text-sm font-semibold text-[#1a1a1a]">
                              {student.name}
                            </div>
                            <div className="font-dm-sans text-xs text-[#9e9589] mt-0.5">
                              {student.email}
                            </div>
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="pl-[52px]">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-dm-sans text-xs text-[#9e9589]">
                              Course Fee
                            </span>
                            <span className="font-dm-sans text-[13px] font-medium text-[#4a4540] tabular-nums">
                              {fmt(student.totalCourseFee)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-dm-sans text-xs text-[#9e9589]">
                              Collected
                            </span>
                            <span className="font-dm-sans text-[13px] font-medium text-[#2f4e40] tabular-nums">
                              {fmt(student.totalPaid)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-dm-sans text-xs text-[#9e9589]">
                              Discounts
                            </span>
                            <span className="font-dm-sans text-[13px] font-medium text-[#2f4e40] tabular-nums">
                              {fmt(student.totalDiscount)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-dm-sans text-xs text-[#9e9589]">
                              Scholarship
                            </span>
                            <span className="font-dm-sans text-[13px] font-medium text-[#2f4e40] tabular-nums">
                              {fmt(student.totalScholarship)}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full h-1 bg-[#e8e3da] rounded-[2px] overflow-hidden mb-2">
                            <div
                              className="h-full bg-[#c28a4f] rounded-[2px]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="font-dm-sans text-xs text-[#9e9589]">
                              Remaining
                            </span>
                            <span
                              className={`font-dm-sans text-[13px] tabular-nums ${
                                student.outstanding <= 0
                                  ? "text-[#166534] font-semibold"
                                  : "text-[#b91c1c] font-bold"
                              }`}
                            >
                              {student.outstanding <= 0
                                ? "Cleared"
                                : fmt(student.outstanding)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
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
