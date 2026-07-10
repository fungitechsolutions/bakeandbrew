"use client";

import { StudentInitialsAvatar } from "./StudentInitialsAvatar";

type StudentFinanceStudentCellProps = {
  fullName: string;
  email: string;
  referenceNo?: string;
};

export function StudentFinanceStudentCell({
  fullName,
  email,
  referenceNo,
}: StudentFinanceStudentCellProps) {
  return (
    <div className="flex items-center gap-3">
      <StudentInitialsAvatar name={fullName} />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-(family-name:--font-dm-sans) text-sm font-semibold text-(--brand-ink)">
          {fullName}
        </span>
        <span className="truncate font-(family-name:--font-dm-sans) text-xs text-[rgba(47,78,64,0.5)]">
          {email}
        </span>
        {referenceNo ? (
          <span className="font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-wider text-[rgba(47,78,64,0.35)]">
            {referenceNo}
          </span>
        ) : null}
      </div>
    </div>
  );
}
