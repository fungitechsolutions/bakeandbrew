"use client";

import { History } from "lucide-react";
import { useStudentCourseChanges } from "@/hooks/queries/admin/students/useStudentCourseChanges";
import { SectionCard } from "./shared/SectionCard";
import {
  detailInsetClass,
  detailLabelClass,
  detailValueClass,
} from "./detail-styles";
import { formatNpr } from "../shared/student-utils";

const metaClass =
  "font-(family-name:--font-dm-sans) text-xs text-[rgba(47,78,64,0.55)]";

function rupees(paisa: number) {
  return formatNpr(paisa / 100);
}

// Lists a student's course changes, newest first. Hidden while there are none
// (or the list can't be loaded): it's background for the fee, not an action.
export function CourseChangeHistory({ studentId }: { studentId: string }) {
  const { data } = useStudentCourseChanges(studentId);
  const changes = data?.success ? data.data : [];
  if (!changes.length) return null;

  return (
    <SectionCard title="Course Changes" icon={History}>
      <ul className="flex flex-col gap-2">
        {changes.map((change) => (
          <li
            key={change.id}
            className={`flex flex-col gap-1.5 px-4 py-3 ${detailInsetClass}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className={detailLabelClass}>
                {new Date(change.createdAt).toLocaleDateString("en-NP", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className={metaClass}>by {change.changedByName}</span>
            </div>
            <p className={detailValueClass}>
              {change.oldCourses.map((c) => c.name).join(", ")} →{" "}
              {change.newCourses.map((c) => c.name).join(", ")}
            </p>
            <p className={metaClass}>
              Fee {rupees(change.oldTotalFee)} → {rupees(change.newTotalFee)} ·
              Paid {rupees(change.totalPaid)}
              {change.oldAdjustments !== change.newAdjustments
                ? ` · Adjustments ${rupees(change.oldAdjustments)} → ${rupees(change.newAdjustments)}`
                : ""}
            </p>
            {change.excessAmount > 0 ? (
              <p className="font-(family-name:--font-dm-sans) text-xs font-semibold text-[#9a3412]">
                Overpaid {rupees(change.excessAmount)} (refund or credit due)
              </p>
            ) : null}
            {change.reason ? (
              <p className={`${metaClass} italic`}>“{change.reason}”</p>
            ) : null}
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
