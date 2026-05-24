"use client";

import api from "@/lib/axios";
import { GetStudentPortalScholarshipResponse } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { Award, RefreshCw, AlertCircle } from "lucide-react";

interface ScholarshipItem {
  percent: number;
  amount: number;
  note: string | null;
  createdAt: string;
}

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

function ScholarshipSkeleton() {
  return (
    <div>
      <style>{shimmerKeyframes}</style>
      <Shimmer className="h-4 w-36 mb-4" />
      <div className="p-5 rounded-xl border border-[#1a1a1a]/8 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <Shimmer className="h-4 w-28" />
          <Shimmer className="h-7 w-16 rounded-full" />
        </div>
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-32" />
      </div>
    </div>
  );
}

function ScholarshipEmpty() {
  return (
    <div className="rounded-xl border border-[#1a1a1a]/8 bg-white px-5 py-10 flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a]/5 flex items-center justify-center">
        <Award size={22} className="text-[#1a1a1a]/25" />
      </div>
      <div>
        <p
          className="text-sm font-semibold text-[#1a1a1a]/40 mb-1"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          No scholarship awarded
        </p>
        <p className="text-xs text-[#1a1a1a]/30 leading-relaxed max-w-[200px]">
          A scholarship awarded to your account will appear here.
        </p>
      </div>
    </div>
  );
}

function ScholarshipCard({ scholarship }: { scholarship: ScholarshipItem }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border p-5"
      style={{
        background: "linear-gradient(135deg, #f6f9f7 0%, #eef4f0 100%)",
        borderColor: "rgba(47,78,64,0.2)",
        boxShadow: "0 2px 12px rgba(47,78,64,0.08)",
      }}
    >
      {/* Subtle top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background:
            "linear-gradient(to right, transparent, #2f4e40, transparent)",
          opacity: 0.4,
        }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-[#2f4e40]/12 flex items-center justify-center mt-0.5">
            <Award size={18} className="text-[#2f4e40]" />
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-bold text-[#2f4e40] leading-snug"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Merit Scholarship
            </p>
            {scholarship.note && (
              <p className="text-xs text-[#1a1a1a]/50 mt-0.5 leading-snug">
                {scholarship.note}
              </p>
            )}
            <p className="text-xs text-[#1a1a1a]/35 mt-1.5">
              Awarded {formatDate(scholarship.createdAt)}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right space-y-1.5">
          <p
            className="text-base font-bold text-[#2f4e40]"
            style={{ fontFamily: "var(--font-lora)" }}
          >
            {formatNPR(scholarship.amount / 100)}
          </p>
          <span className="inline-block text-xs font-bold text-[#2f4e40] bg-[#2f4e40]/10 px-2.5 py-0.5 rounded-full border border-[#2f4e40]/20">
            {scholarship.percent}% awarded
          </span>
        </div>
      </div>
    </div>
  );
}

export function Scholarship() {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: ["student-portal-scholarship"],
    queryFn: async () => {
      const res = await api.get<GetStudentPortalScholarshipResponse>(
        "/portal/student/scholarship",
      );
      const parsed = res.data;
      if (!parsed.success) throw new Error(parsed.message);
      return parsed.data;
    },
  });

  if (isPending) return <ScholarshipSkeleton />;

  if (isError) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong fetching your scholarship details.";
    return (
      <SectionError title="Scholarship" message={message} onRetry={refetch} />
    );
  }

  return (
    <section>
      <h2
        className="text-base font-semibold text-[#1a1a1a] mb-4 tracking-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Scholarship
      </h2>

      {data ? <ScholarshipCard scholarship={data} /> : <ScholarshipEmpty />}
    </section>
  );
}
