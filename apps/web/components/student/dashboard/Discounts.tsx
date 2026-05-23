"use client";

import api from "@/lib/axios";
import { GetStudentDiscountsResponse } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, BadgePercent, RefreshCw, Tag } from "lucide-react";

function formatNPR(amount: number): string {
  return `NPR ${amount.toLocaleString("en-NP")}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(90deg, rgba(26,26,26,0.06) 0%, rgba(26,26,26,0.1) 50%, rgba(26,26,26,0.06) 100%)",
        backgroundSize: "200% 100%",
        animation: "ds-shimmer 1.5s ease-in-out infinite",
      }}
    />
  );
}

const shimmerKeyframes = `
  @keyframes ds-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
interface DiscountItem {
  id: string;
  type: string;
  percent: number;
  amount: number;
  note: string | null;
  createdAt: string;
}

function DiscountsSkeleton() {
  return (
    <div>
      <style>{shimmerKeyframes}</style>
      <Shimmer className="h-4 w-32 mb-4" />
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-[#1a1a1a]/8 bg-white space-y-2"
          >
            <div className="flex items-center justify-between">
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-6 w-20 rounded-full" />
            </div>
            <Shimmer className="h-3 w-48" />
            <Shimmer className="h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DiscountsEmpty() {
  return (
    <div className="rounded-xl border border-[#1a1a1a]/8 bg-white px-5 py-10 flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a]/5 flex items-center justify-center">
        <BadgePercent size={22} className="text-[#1a1a1a]/25" />
      </div>
      <div>
        <p
          className="text-sm font-semibold text-[#1a1a1a]/40 mb-1"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          No discounts applied
        </p>
        <p className="text-xs text-[#1a1a1a]/30 leading-relaxed max-w-[200px]">
          Any discounts added to your account will appear here.
        </p>
      </div>
    </div>
  );
}

function DiscountRow({ discount }: { discount: DiscountItem }) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-[#1a1a1a]/8 bg-white hover:border-[#c28a4f]/25 hover:shadow-sm transition-all duration-200">
      <div className="flex items-start gap-3 min-w-0">
        <div className="shrink-0 w-9 h-9 rounded-lg bg-[#c28a4f]/8 flex items-center justify-center mt-0.5">
          <Tag size={15} className="text-[#c28a4f]" />
        </div>
        <div className="min-w-0">
          <p
            className="text-sm font-semibold text-[#1a1a1a] leading-snug"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {discount.type}
          </p>
          {discount.note && (
            <p className="text-xs text-[#1a1a1a]/40 mt-0.5 leading-snug">
              {discount.note}
            </p>
          )}
          <p className="text-xs text-[#1a1a1a]/30 mt-1">
            {formatDate(discount.createdAt)}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-right space-y-1">
        <p
          className="text-sm font-bold text-[#c28a4f]"
          style={{ fontFamily: "var(--font-lora)" }}
        >
          {formatNPR(discount.amount)}
        </p>
        <span className="inline-block text-xs font-semibold text-[#c28a4f] bg-[#c28a4f]/8 px-2 py-0.5 rounded-full border border-[#c28a4f]/15">
          {discount.percent}% off
        </span>
      </div>
    </div>
  );
}

function SectionError({
  title,
  message,
  onRetry,
}: {
  title: string;
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div>
      <p
        className="text-base font-semibold text-[#1a1a1a] mb-4 tracking-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </p>
      <div className="rounded-xl border border-red-100 bg-red-50/60 px-5 py-8 flex flex-col items-center text-center gap-3">
        <AlertCircle size={20} className="text-red-400" />
        <div>
          <p className="text-sm font-semibold text-[#1a1a1a] mb-1">
            Couldn&apos;t load data
          </p>
          <p className="text-xs text-[#1a1a1a]/45 leading-relaxed max-w-xs">
            {message ?? "Something went wrong. Please try again."}
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
    </div>
  );
}

export function Discounts() {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: ["student-portal-discounts"],
    queryFn: async () => {
      const res = await api.get<GetStudentDiscountsResponse>(
        "/portal/student/discounts",
      );
      const parsed = res.data;
      if (!parsed.success) throw new Error(parsed.message);
      return parsed.data;
    },
  });

  if (isPending) return <DiscountsSkeleton />;

  if (isError) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong fetching your discounts.";
    return (
      <SectionError title="Discounts" message={message} onRetry={refetch} />
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-base font-semibold text-[#1a1a1a] tracking-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Discounts
        </h2>
        {data.length > 0 && (
          <span className="text-xs font-semibold text-[#c28a4f] bg-[#c28a4f]/8 px-2.5 py-1 rounded-full border border-[#c28a4f]/15">
            {formatNPR(data.reduce((s, d) => s + d.amount, 0))} saved
          </span>
        )}
      </div>

      {data.length === 0 ? (
        <DiscountsEmpty />
      ) : (
        <div className="flex flex-col gap-2.5">
          {data.map((d) => (
            <DiscountRow key={d.id} discount={d} />
          ))}
        </div>
      )}
    </section>
  );
}
