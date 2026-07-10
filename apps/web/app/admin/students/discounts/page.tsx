export const dynamic = "force-dynamic";

import { Suspense } from "react";
import type { Metadata } from "next";
import { StudentDiscountsView } from "@/modules/admin/students/discounts/StudentDiscountsView";
import { StudentFinanceListPageFallback } from "@/modules/admin/students/shared/StudentFinanceListPageFallback";

export const metadata: Metadata = {
  title: "Student Discounts | Admin",
  description: "All student discounts",
};

export default function StudentDiscountsPage() {
  return (
    <Suspense
      fallback={
        <StudentFinanceListPageFallback
          title="Student Discounts"
          description="All discounts applied across students — filter by date or search by student details."
          columnCount={6}
          columnLabels={["Student", "Type", "Percent", "Amount", "Note", "Date"]}
        />
      }
    >
      <StudentDiscountsView />
    </Suspense>
  );
}
