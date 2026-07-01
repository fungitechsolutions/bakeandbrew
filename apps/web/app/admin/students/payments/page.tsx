export const dynamic = "force-dynamic";

import { Suspense } from "react";
import type { Metadata } from "next";
import { StudentPaymentsView } from "@/modules/admin/students/payments/StudentPaymentsView";
import { StudentFinanceListPageFallback } from "@/modules/admin/students/shared/StudentFinanceListPageFallback";

export const metadata: Metadata = {
  title: "Student Payments | Admin",
  description: "All student fee payments",
};

export default function StudentPaymentsPage() {
  return (
    <Suspense
      fallback={
        <StudentFinanceListPageFallback
          title="Student Payments"
          description="All fee payments across students — filter by date or search by name, email, or reference."
          columnLabels={["Student", "Amount", "Mode", "Remarks", "Date"]}
        />
      }
    >
      <StudentPaymentsView />
    </Suspense>
  );
}
