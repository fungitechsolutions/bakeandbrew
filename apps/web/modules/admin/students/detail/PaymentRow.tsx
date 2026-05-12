import { CheckCircle2, Printer } from "lucide-react";
import { usePrintReceipt } from "./PrintReceipt";

export function PaymentRow({
  payment,
  student,
  receiptNo,
}: {
  payment: {
    id: string | number;
    amount: number;
    addedAt: string;
    remarks?: string | null;
    addedByName?: string;
    paymentMode?: string | null;
  };
  student: {
    referenceNo: string;
    fullName: string;
    phone: string;
    fiscalYear: string;
  };
  receiptNo: number;
}) {
  const { handlePrintReceipt } = usePrintReceipt({
    student,
    payment,
    receiptNo,
  });

  return (
    <div className="flex items-center justify-between rounded-xl border border-[#2d4a3e]/08 bg-[#f4f1ec]/50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-500" strokeWidth={2} />
        </div>
        <div>
          <p
            className="text-[0.88rem] font-medium text-[#2d4a3e]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            NPR {(payment.amount / 100).toLocaleString()}
          </p>
          <p
            className="text-[0.75rem] text-[#2d4a3e]/45"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {payment.remarks ?? "Payment"}
            {payment.paymentMode ? ` · ${payment.paymentMode}` : ""}
            {" · "}
            {new Date(payment.addedAt).toLocaleDateString("en-NP", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="text-[0.72rem] text-[#2d4a3e]/35"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          by {payment.addedByName}
        </span>

        {/* ── Print Receipt button ── */}
        <button
          onClick={handlePrintReceipt}
          title="Print receipt"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2d4a3e]/12 bg-white text-[#2d4a3e]/50 transition-all hover:border-[#2d4a3e]/25 hover:text-[#2d4a3e]"
        >
          <Printer className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
