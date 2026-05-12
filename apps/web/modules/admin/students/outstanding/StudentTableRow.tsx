"use client";

import type { OutstandingStudent } from "./types/outstanding";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function OutstandingBadge({ amount }: { amount: number }) {
  const level = amount > 50000 ? "high" : amount > 20000 ? "mid" : "low";

  const levelClass = {
    high: "bg-[#fef2f2] text-[#b91c1c]",
    mid: "bg-[#fffbeb] text-[#92400e]",
    low: "bg-[#f0fdf4] text-[#166534]",
  }[level];

  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-[20px] font-[var(--font-dm-sans)] text-[13px] font-semibold ${levelClass}`}
    >
      {formatCurrency(amount)}
    </span>
  );
}

export function StudentTableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i}>
          <td className="px-5 py-4 border-b border-[#f0ede8]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e8e3da] shrink-0 animate-[shimmer_1.5s_infinite]" />
              <div className="flex flex-col gap-1.5">
                <div
                  className="w-[120px] h-3.5 bg-[#e8e3da] rounded animate-[shimmer_1.5s_infinite]"
                  style={{ animationDelay: `${i * 0.08}s` }}
                />
                <div
                  className="w-[160px] h-3 bg-[#e8e3da] rounded animate-[shimmer_1.5s_infinite]"
                  style={{ animationDelay: `${i * 0.08}s` }}
                />
              </div>
            </div>
          </td>
          <td className="px-5 py-4 border-b border-[#f0ede8]">
            <div
              className="w-20 h-3.5 bg-[#e8e3da] rounded animate-[shimmer_1.5s_infinite]"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          </td>
          <td className="px-5 py-4 border-b border-[#f0ede8]">
            <div
              className="w-20 h-3.5 bg-[#e8e3da] rounded animate-[shimmer_1.5s_infinite]"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          </td>
          <td className="px-5 py-4 border-b border-[#f0ede8]">
            <div
              className="w-[90px] h-[26px] bg-[#e8e3da] rounded-[20px] animate-[shimmer_1.5s_infinite]"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          </td>
        </tr>
      ))}
    </>
  );
}

interface StudentTableRowProps {
  student: OutstandingStudent;
}

export function StudentTableRow({ student }: StudentTableRowProps) {
  const progressPct =
    student.totalCourseFee > 0
      ? Math.min((student.totalPaid / student.totalCourseFee) * 100, 100)
      : 0;

  const tdClass =
    "px-5 py-4 border-b border-[#f0ede8] align-middle group-last:border-b-0";

  return (
    <tr className="group transition-colors duration-[120ms] hover:bg-[#f9f7f3]">
      <td className={tdClass}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2f4e40] text-[#c28a4f] font-[var(--font-dm-sans)] text-[13px] font-bold flex items-center justify-center shrink-0 tracking-[0.04em]">
            {getInitials(student.name)}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-[var(--font-dm-sans)] text-sm font-semibold text-[#1a1a1a] whitespace-nowrap">
              {student.name}
            </span>
            <span className="font-[var(--font-dm-sans)] text-xs text-[#9e9589]">
              {student.email}
            </span>
          </div>
        </div>
      </td>
      <td className={tdClass}>
        <span className="font-[var(--font-dm-sans)] text-sm text-[#4a4540] tabular-nums">
          {formatCurrency(student.totalCourseFee / 100)}
        </span>
      </td>
      <td className={tdClass}>
        <div className="flex flex-col gap-1.5">
          <span className="font-[var(--font-dm-sans)] text-sm font-medium text-[#2f4e40] tabular-nums">
            {formatCurrency(student.totalPaid / 100)}
          </span>
          <div className="w-20 h-1 bg-[#e8e3da] rounded-sm overflow-hidden">
            <div
              className="h-full bg-[#2f4e40] rounded-sm transition-[width] duration-300 ease-in-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </td>
      <td className={tdClass}>
        <OutstandingBadge amount={student.outstanding / 100} />
      </td>
    </tr>
  );
}
