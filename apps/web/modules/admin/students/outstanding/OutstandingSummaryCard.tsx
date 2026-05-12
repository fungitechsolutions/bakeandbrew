"use client";

interface OutstandingSummaryCardProps {
  totalOutstandingFees: number;
  totalStudents: number;
  isLoading?: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function OutstandingSummaryCard({
  totalOutstandingFees,
  totalStudents,
  isLoading,
}: OutstandingSummaryCardProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6 max-[480px]:grid-cols-1">
      {/* Primary card */}
      <div className="rounded-[14px] px-7 py-6 relative overflow-hidden bg-[#2f4e40] text-[#fbfaf7] max-[480px]:px-5 max-[480px]:py-5">
        <div className="font-[var(--font-dm-sans)] text-[11px] font-semibold tracking-[0.1em] uppercase opacity-70 mb-2">
          Total Outstanding
        </div>
        {isLoading ? (
          <div className="h-9 w-40 mb-1 rounded-[6px] bg-white/15 animate-[shimmer_1.5s_infinite]" />
        ) : (
          <div className="font-[var(--font-playfair)] text-[28px] font-bold tracking-[-0.02em] mb-1 text-[#c28a4f] max-[480px]:text-[22px]">
            {formatCurrency(totalOutstandingFees / 100)}
          </div>
        )}
        <div className="font-[var(--font-dm-sans)] text-xs opacity-60">
          Across all active students
        </div>
      </div>

      {/* Secondary card */}
      <div className="rounded-[14px] px-7 py-6 relative overflow-hidden bg-white border border-[#e8e3da] text-[#1a1a1a] max-[480px]:px-5 max-[480px]:py-5">
        <div className="font-[var(--font-dm-sans)] text-[11px] font-semibold tracking-[0.1em] uppercase opacity-70 mb-2">
          Students with Dues
        </div>
        {isLoading ? (
          <div className="h-[52px] w-20 mb-1 rounded-[6px] bg-[#e8e3da] animate-[shimmer_1.5s_infinite]" />
        ) : (
          <div className="font-[var(--font-playfair)] text-[42px] font-bold tracking-[-0.03em] text-[#2f4e40] mb-1 max-[480px]:text-[32px]">
            {totalStudents}
          </div>
        )}
        <div className="font-[var(--font-dm-sans)] text-xs opacity-60">
          Pending clearance
        </div>
      </div>
    </div>
  );
}
