"use client";

import {
  Banknote,
  Smartphone,
  Building2,
  FileText,
  Wallet,
  CreditCard,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GetStudentPaymentsResponse } from "@repo/types";
import api from "@/lib/axios";

type PaymentItem = Extract<
  GetStudentPaymentsResponse,
  { success: true }
>["data"][number];

const PAYMENT_MODE_META: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  cash: { label: "Cash", icon: <Banknote size={14} /> },
  esewa: { label: "eSewa", icon: <Smartphone size={14} /> },
  khalti: { label: "Khalti", icon: <Smartphone size={14} /> },
  bank_transfer: { label: "Bank Transfer", icon: <Building2 size={14} /> },
  cheque: { label: "Cheque", icon: <FileText size={14} /> },
};

function getPaymentModeMeta(mode: string) {
  return (
    PAYMENT_MODE_META[mode] ?? {
      label: mode,
      icon: <CreditCard size={14} />,
    }
  );
}

function formatNPR(amount: number): string {
  return `NPR ${amount.toLocaleString("en-NP")}`;
}

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-NP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    time: d.toLocaleTimeString("en-NP", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function PaymentRow({
  payment,
  index,
}: {
  payment: PaymentItem;
  index: number;
}) {
  const { date, time } = formatDateTime(payment.addedAt);
  const mode = getPaymentModeMeta(payment.paymentMode);

  return (
    <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[2.5rem_1fr_auto] items-center gap-4 p-4 hover:bg-[#1a1a1a]/[0.02] transition-colors duration-150">
      {/* Index badge */}
      <div className="hidden sm:flex w-8 h-8 rounded-lg bg-[#1a1a1a]/5 items-center justify-center shrink-0">
        <span className="text-xs font-bold text-[#1a1a1a]/30">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Details */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1a1a1a]/50 bg-[#1a1a1a]/5 px-2 py-0.5 rounded-full">
            {mode.icon}
            {mode.label}
          </span>
          {payment.remarks && (
            <span className="text-xs text-[#1a1a1a]/35 truncate max-w-[160px]">
              {payment.remarks}
            </span>
          )}
        </div>
        <p className="text-xs text-[#1a1a1a]/35 font-medium">
          {date}&nbsp;·&nbsp;{time}
        </p>
      </div>

      {/* Amount */}
      <p
        className="text-sm font-bold text-[#2f4e40] text-right shrink-0"
        style={{ fontFamily: "var(--font-lora)" }}
      >
        {formatNPR(payment.amount / 100)}
      </p>
    </div>
  );
}

function EmptyPayments() {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a]/5 flex items-center justify-center mb-4">
        <Wallet size={24} className="text-[#1a1a1a]/25" />
      </div>
      <p
        className="text-sm font-semibold text-[#1a1a1a]/40 mb-1"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        No payments recorded
      </p>
      <p className="text-xs text-[#1a1a1a]/30 max-w-[220px] leading-relaxed">
        Payments added by the administration will appear here once processed.
      </p>
    </div>
  );
}

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(90deg, rgba(26,26,26,0.06) 0%, rgba(26,26,26,0.1) 50%, rgba(26,26,26,0.06) 100%)",
        backgroundSize: "200% 100%",
        animation: "payments-shimmer 1.5s ease-in-out infinite",
      }}
    />
  );
}

function PaymentHistorySkeleton() {
  return (
    <section className="my-7">
      <style>{`
        @keyframes payments-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div className="flex items-center justify-between mb-4">
        <Shimmer className="h-4 w-36" />
        <Shimmer className="h-6 w-28 rounded-full" />
      </div>
      <div className="rounded-xl border border-[#1a1a1a]/8 bg-white overflow-hidden divide-y divide-[#1a1a1a]/5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 p-4"
          >
            <Shimmer className="w-8 h-8 rounded-lg hidden sm:block" />
            <div className="space-y-1.5">
              <Shimmer className="h-5 w-24 rounded-full" />
              <Shimmer className="h-3 w-40" />
            </div>
            <Shimmer className="h-4 w-24" />
          </div>
        ))}
      </div>
    </section>
  );
}

function PaymentHistoryError({
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
        Payment History
      </h2>
      <div className="rounded-xl border border-red-100 bg-red-50/60 px-5 py-8 flex flex-col items-center text-center gap-3">
        <AlertCircle size={20} className="text-red-400" />
        <div>
          <p className="text-sm font-semibold text-[#1a1a1a] mb-1">
            Couldn&apos;t load payment history
          </p>
          <p className="text-xs text-[#1a1a1a]/45 leading-relaxed max-w-xs">
            {message ?? "Something went wrong fetching your payments."}
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

export function PaymentHistory() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["student-payments"],
    queryFn: async () => {
      const res = await api.get<GetStudentPaymentsResponse>(
        "/portal/student/payments",
      );
      const parsed = res.data;

      if (!parsed.success) {
        throw new Error(parsed.message ?? "Failed to load payments");
      }

      return parsed.data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 2,
  });

  if (isPending) return <PaymentHistorySkeleton />;

  if (isError) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return <PaymentHistoryError message={message} onRetry={refetch} />;
  }

  const sorted = [...data].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  );
  const total = data.reduce((sum, p) => sum + p.amount, 0);

  return (
    <section className="my-7">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-base font-semibold text-[#1a1a1a] tracking-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Payment History
        </h2>
        {data.length > 0 && (
          <span className="text-xs font-semibold text-[#2f4e40] bg-[#2f4e40]/8 px-2.5 py-1 rounded-full border border-[#2f4e40]/15">
            {formatNPR(total / 100)} total
          </span>
        )}
      </div>

      <div className="rounded-xl border border-[#1a1a1a]/8 bg-white overflow-hidden">
        {data.length === 0 ? (
          <EmptyPayments />
        ) : (
          <div className="divide-y divide-[#1a1a1a]/5">
            {sorted.map((payment, i) => (
              <PaymentRow key={payment.id} payment={payment} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
