import Link from "next/link";
import { AdminPageLayout } from "@/components/admin/admin-page-layout";
import { StudentDateFilters } from "./StudentDateFilters";
import { StudentFinanceSummary } from "./StudentFinanceSummary";
import {
  StudentFinanceMobileSkeleton,
  StudentFinanceTableSkeleton,
} from "./StudentFinanceTableSkeleton";
import { adminSecondaryButtonClass, adminTableClass } from "@/components/admin/admin-styles";

const thClass =
  "px-5 py-3.5 text-left font-(family-name:--font-dm-sans) text-[10px] font-semibold uppercase tracking-widest text-[rgba(47,78,64,0.45)] bg-[rgba(47,78,64,0.03)] border-b border-[rgba(47,78,64,0.12)] whitespace-nowrap";

type StudentFinanceListPageFallbackProps = {
  title: string;
  description: string;
  columnCount?: number;
  columnLabels?: string[];
};

export function StudentFinanceListPageFallback({
  title,
  description,
  columnCount = 5,
  columnLabels = ["Student", "Amount", "Details", "Note", "Date"],
}: StudentFinanceListPageFallbackProps) {
  return (
    <AdminPageLayout
      title={title}
      description={description}
      maxWidth="wide"
      action={
        <Link href="/admin/students" className={adminSecondaryButtonClass}>
          All Students
        </Link>
      }
    >
      <StudentFinanceSummary
        isLoading
        primaryLabel="Loading"
        primaryValue=""
        primaryHint="Fetching summary"
        secondaryLabel="Records"
        secondaryValue=""
        secondaryHint="Please wait"
      />

      <StudentDateFilters isPending />

      <div className="overflow-hidden border border-[rgba(47,78,64,0.18)] bg-white">
        <div className="overflow-x-auto max-md:hidden">
          <table className={adminTableClass}>
            <thead>
              <tr>
                {columnLabels.slice(0, columnCount).map((label) => (
                  <th key={label} className={thClass}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <StudentFinanceTableSkeleton columns={columnCount} />
            </tbody>
          </table>
        </div>
        <div className="hidden max-md:block">
          <StudentFinanceMobileSkeleton />
        </div>
      </div>
    </AdminPageLayout>
  );
}
