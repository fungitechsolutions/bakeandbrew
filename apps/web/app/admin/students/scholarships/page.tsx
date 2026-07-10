export const dynamic = "force-dynamic";

import { Suspense } from "react";
import type { Metadata } from "next";
import { StudentScholarshipsView } from "@/modules/admin/students/scholarships/StudentScholarshipsView";
import { StudentFinanceListPageFallback } from "@/modules/admin/students/shared/StudentFinanceListPageFallback";

export const metadata: Metadata = {
  title: "Student Scholarships | Admin",
  description: "All student scholarships",
};

export default function StudentScholarshipsPage() {
  return (
    <Suspense
      fallback={
        <StudentFinanceListPageFallback
          title="Student Scholarships"
          description="All scholarships awarded across students — filter by date or search by student details."
          columnLabels={["Student", "Percent", "Amount", "Note", "Date"]}
        />
      }
    >
      <StudentScholarshipsView />
    </Suspense>
  );
}
