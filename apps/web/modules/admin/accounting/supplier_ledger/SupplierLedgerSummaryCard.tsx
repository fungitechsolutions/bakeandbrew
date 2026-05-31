import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRs } from "../bank-ledger/format";
import { SupplierLedgerSummary } from "@repo/types";

interface SupplierLedgerSummaryCardsProps {
  summary: SupplierLedgerSummary | null;
  loading?: boolean;
}

export function SupplierLedgerSummaryCards({
  summary,
  loading = false,
}: SupplierLedgerSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border p-5"
            style={{ borderColor: "#e5e0d6", backgroundColor: "#fff" }}
          >
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-7 w-36" />
          </div>
        ))}
      </div>
    );
  }

  const balance = summary?.outstanding ?? 0;
  const isOverpaid = balance < 0;

  const cards = [
    {
      label: "Total Purchased (Cr)",
      value: summary ? formatRs(summary.totalCr) : "Rs. 0.00",
      icon: TrendingUp,
      accent: "#16a34a",
      bg: "#f0fdf4",
      border: "#bbf7d0",
    },
    {
      label: "Total Paid (Dr)",
      value: summary ? formatRs(summary.totalDr) : "Rs. 0.00",
      icon: TrendingDown,
      accent: "#dc2626",
      bg: "#fef2f2",
      border: "#fecaca",
    },
    {
      label: isOverpaid ? "Overpaid" : "Payable Balance",
      value: summary ? formatRs(Math.abs(balance)) : "Rs. 0.00",
      icon: Wallet,
      accent: isOverpaid ? "#dc2626" : "var(--brand-brown)",
      bg: "#fdf6ec",
      border: "#f0d9b8",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-xl border p-5 flex items-start gap-4"
            style={{ backgroundColor: card.bg, borderColor: card.border }}
          >
            <div
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor: card.bg,
                border: `1.5px solid ${card.border}`,
              }}
            >
              <Icon size={18} style={{ color: card.accent }} />
            </div>
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: "#6b7280" }}
              >
                {card.label}
              </p>
              <p
                className="mt-1 text-xl font-bold tabular-nums"
                style={{ color: card.accent }}
              >
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
