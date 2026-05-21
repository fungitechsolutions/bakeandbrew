"use client";

import { StudentDetail, StudentPaymentDetails } from "@repo/types";
import { CreditCard, Plus } from "lucide-react";

import { SectionCard } from "./shared/SectionCard";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { GuardianSection } from "./GuardianSection";

type Student = Extract<StudentDetail, { success: true }>["data"];

type Payment = Extract<
  StudentPaymentDetails,
  { success: true }
>["data"][number];

type PaymentRowProps = {
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
};

export function MiddleColumn({
  student,
  payments,
  setShowPaymentModal,
  PaymentRow,
  balanceDue,
}: {
  student: Student;
  payments: Payment[];
  setShowPaymentModal: (v: boolean) => void;
  PaymentRow: React.ComponentType<PaymentRowProps>;
  balanceDue: number;
}) {
  return (
    <div className="flex flex-col  gap-5">
      <PersonalInfoSection student={student} />
      <GuardianSection student={student} />

      {/* Payments */}
      <SectionCard title="Payment History" icon={CreditCard}>
        <div className="mb-4 flex items-center justify-between">
          <p
            className="text-[0.82rem] text-[#2d4a3e]/50"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {payments.length} payment{payments.length !== 1 ? "s" : ""} recorded
          </p>
          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={balanceDue <= 0}
            className="
                inline-flex items-center gap-1.5 rounded-xl
                px-4 py-2 text-[0.85rem] font-semibold text-white
                transition-all
                bg-[#2d4a3e]
                hover:-translate-y-0.5
                hover:shadow-[0_4px_16px_rgba(45,74,62,0.25)]

                disabled:cursor-not-allowed
                disabled:bg-[#94a39c]
                disabled:text-white/80
                disabled:hover:translate-y-0
                disabled:hover:shadow-none
                disabled:opacity-70
  "
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            {balanceDue <= 0 ? "Balance Cleared" : "Add Payment"}
          </button>
        </div>
        {payments.length === 0 ? (
          <p
            className="py-6 text-center text-[0.85rem] text-[#2d4a3e]/35"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            No payments recorded yet.
          </p>
        ) : (
          <div className="flex max-h-88 flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#2d4a3e]/20 scrollbar-track-transparent">
            {[...payments].reverse().map((p, reversedIdx) => {
              const originalIdx = payments.length - 1 - reversedIdx;
              return (
                <PaymentRow
                  key={p.id}
                  payment={{
                    id: p.id,
                    amount: p.amount,
                    addedAt:
                      p.addedAt instanceof Date
                        ? p.addedAt.toISOString()
                        : String(p.addedAt),
                    remarks: p.remarks,
                    addedByName: p.addedByName,
                    paymentMode: p.paymentMode,
                  }}
                  student={student}
                  receiptNo={originalIdx + 1}
                />
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
