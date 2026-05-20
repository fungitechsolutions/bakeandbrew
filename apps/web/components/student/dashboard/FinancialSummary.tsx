import { TrendingUp, CreditCard, AlertCircle } from "lucide-react";
import type { Course, Payment } from "./types/dashboard";

interface FinancialSummaryProps {
  courses: Course[];
  payments: Payment[];
}

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
  return `NPR ${amount.toLocaleString("en-NP")}`;
}

export function FinancialSummary({ courses, payments }: FinancialSummaryProps) {
  const totalFee = courses.reduce((sum, c) => sum + c.feeAtEnrollment, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = totalFee - totalPaid;
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
          sub={`${courses.length} course${courses.length !== 1 ? "s" : ""}`}
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
