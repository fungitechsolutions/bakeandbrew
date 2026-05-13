"use client";

interface SalesSummaryCardProps {
  totalCollected: number;
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

export function SalesSummaryCard({
  totalCollected,
  totalStudents,
  isLoading,
}: SalesSummaryCardProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6 max-[480px]:grid-cols-1">
      {/* Primary card */}
      <div className="rounded-[14px] px-7 py-6 relative overflow-hidden bg-[#2f4e40] text-[#fbfaf7] max-[480px]:px-5 max-[480px]:py-5">
        <div className="font-dm-sans text-[11px] font-semibold tracking-[0.1em] uppercase opacity-70 mb-2">
          Total Collected
        </div>
        {isLoading ? (
          <div className="rounded-[6px] animate-shimmer bg-white/15 h-9 w-40 mb-1" />
        ) : (
          <div className="font-playfair text-[28px] max-[480px]:text-[22px] font-bold tracking-[-0.02em] mb-1 text-[#c28a4f]">
            {formatCurrency(totalCollected)}
          </div>
        )}
        <div className="font-dm-sans text-xs opacity-60">
          Revenue from all active students
        </div>
      </div>

      {/* Secondary card */}
      <div className="rounded-[14px] px-7 py-6 relative overflow-hidden bg-white border border-[#e8e3da] text-[#1a1a1a] max-[480px]:px-5 max-[480px]:py-5">
        <div className="font-dm-sans text-[11px] font-semibold tracking-[0.1em] uppercase opacity-70 mb-2">
          Total Students
        </div>
        {isLoading ? (
          <div className="rounded-[6px] animate-shimmer bg-[#e8e3da] h-[52px] w-20 mb-1" />
        ) : (
          <div className="font-playfair text-[42px] max-[480px]:text-[32px] font-bold tracking-[-0.03em] text-[#2f4e40] mb-1">
            {totalStudents}
          </div>
        )}
        <div className="font-dm-sans text-xs opacity-60">
          Active &amp; completed
        </div>
      </div>
    </div>
  );
}
