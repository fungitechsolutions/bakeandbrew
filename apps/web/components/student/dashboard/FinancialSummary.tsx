"use client";

import { TrendingUp, CreditCard, AlertCircle, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { GetStudentFeeSummaryResponse } from "@repo/types";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent: "green" | "brown" | "muted";
}

function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
  const accentMap = {
    green: {
      bg: "bg-[#2f4e40]/8",
      border: "border-[#2f4e40]/15",
      iconBg: "bg-[#2f4e40]/10",
      iconColor: "text-[#2f4e40]",
      valueColor: "text-[#2f4e40]",
    },
    brown: {
      bg: "bg-[#c28a4f]/8",
      border: "border-[#c28a4f]/15",
      iconBg: "bg-[#c28a4f]/10",
      iconColor: "text-[#c28a4f]",
      valueColor: "text-[#c28a4f]",
    },
    muted: {
      bg: "bg-[#1a1a1a]/4",
      border: "border-[#1a1a1a]/10",
      iconBg: "bg-[#1a1a1a]/8",
      iconColor: "text-[#1a1a1a]/50",
      valueColor: "text-[#1a1a1a]",
    },
  } as const;

  const styles = accentMap[accent];

  return (
    <div
      className={`
        relative rounded-xl border p-5 transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md cursor-default
        ${styles.bg} ${styles.border}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#1a1a1a]/45 uppercase tracking-widest font-medium mb-2">
            {label}
          </p>
          <p
            className={`text-2xl font-bold leading-none ${styles.valueColor}`}
            style={{ fontFamily: "var(--font-lora)" }}
          >
            {value}
          </p>
          {sub && (
            <p className="text-xs text-[#1a1a1a]/40 mt-1.5 font-medium">
              {sub}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg shrink-0 ${styles.iconBg}`}>
          <span className={styles.iconColor}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

function formatNPR(amount: number): string {
  return `NPR ${(amount / 100).toLocaleString("en-NP")}`;
}

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(90deg, rgba(26,26,26,0.06) 0%, rgba(26,26,26,0.1) 50%, rgba(26,26,26,0.06) 100%)",
        backgroundSize: "200% 100%",
        animation: "summary-shimmer 1.5s ease-in-out infinite",
      }}
    />
  );
}

function FinancialSummarySkeleton() {
  return (
    <section className="my-7">
      <style>{`
        @keyframes summary-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <Shimmer className="h-4 w-40 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[#1a1a1a]/8 p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Shimmer className="h-2.5 w-20" />
                <Shimmer className="h-7 w-32" />
                <Shimmer className="h-2.5 w-24" />
              </div>
              <Shimmer className="w-9 h-9 rounded-lg shrink-0" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <Shimmer className="h-3 w-28" />
          <Shimmer className="h-3 w-8" />
        </div>
        <Shimmer className="h-2 w-full rounded-full" />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Error state
// ---------------------------------------------------------------------------
function FinancialSummaryError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <section className="my-7">
      <h2
        className="text-base font-semibold text-[#1a1a1a] mb-4 tracking-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Financial Overview
      </h2>
      <div className="rounded-xl border border-red-100 bg-red-50/60 px-5 py-8 flex flex-col items-center text-center gap-3">
        <AlertCircle size={20} className="text-red-400" />
        <div>
          <p className="text-sm font-semibold text-[#1a1a1a] mb-1">
            Couldn&apos;t load financial data
          </p>
          <p className="text-xs text-[#1a1a1a]/45 leading-relaxed max-w-xs">
            {message ?? "Something went wrong fetching your fee summary."}
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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function FinancialSummary() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["student-fee-summary"],
    queryFn: async () => {
      const res = await api.get<GetStudentFeeSummaryResponse>(
        "/portal/student/fee/summary",
      );
      const parsed = res.data;

      if (!parsed.success) {
        throw new Error(parsed.message ?? "Failed to load fee summary");
      }

      return parsed.data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 2,
  });

  if (isPending) return <FinancialSummarySkeleton />;

  if (isError) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return <FinancialSummaryError message={message} onRetry={refetch} />;
  }

  const { totalFee, totalPaid, remaining, coursesCount } = data;
  const paidPercent =
    totalFee > 0 ? Math.min((totalPaid / totalFee) * 100, 100) : 0;

  return (
    <section className="my-7">
      <h2
        className="text-base font-semibold text-[#1a1a1a] mb-4 tracking-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Financial Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <StatCard
          label="Total Fee"
          value={formatNPR(totalFee)}
          sub={`${coursesCount} course${coursesCount !== 1 ? "s" : ""}`}
          icon={<CreditCard size={18} />}
          accent="muted"
        />
        <StatCard
          label="Total Paid"
          value={formatNPR(totalPaid)}
          sub={`${Math.round(paidPercent)}% of total fee`}
          icon={<TrendingUp size={18} />}
          accent="green"
        />
        <StatCard
          label="Remaining Balance"
          value={formatNPR(remaining)}
          sub={remaining === 0 ? "Fully cleared" : "Outstanding"}
          icon={<AlertCircle size={18} />}
          accent={remaining === 0 ? "green" : "brown"}
        />
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-[#1a1a1a]/40 font-medium">
            Payment progress
          </span>
          <span className="text-xs font-semibold text-[#2f4e40]">
            {Math.round(paidPercent)}%
          </span>
        </div>
        <div className="h-2 w-full bg-[#1a1a1a]/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2f4e40] to-[#3a5a49] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${paidPercent}%` }}
          />
        </div>
      </div>
    </section>
  );
}
