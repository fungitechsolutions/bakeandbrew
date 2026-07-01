"use client";

import { AlertCircle, Inbox } from "lucide-react";
import { adminPrimaryButtonClass } from "@/components/admin/admin-styles";

export function StudentFinanceListError({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="mb-1 grid h-20 w-20 place-items-center bg-red-50 text-[#9a3412]">
        <AlertCircle size={36} strokeWidth={1.5} />
      </div>
      <h3 className="font-(family-name:--font-lora) text-xl font-bold text-(--brand-ink)">
        {title}
      </h3>
      <p className="max-w-sm font-(family-name:--font-dm-sans) text-sm text-[rgba(47,78,64,0.55)]">
        {description}
      </p>
      {onRetry ? (
        <button type="button" className={adminPrimaryButtonClass} onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function StudentFinanceListEmpty({
  title = "No records found",
  description,
}: {
  title?: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="mb-1 grid h-20 w-20 place-items-center bg-[rgba(47,78,64,0.06)] text-(--brand-green)">
        <Inbox size={40} strokeWidth={1.25} />
      </div>
      <h3 className="font-(family-name:--font-lora) text-xl font-bold text-(--brand-ink)">
        {title}
      </h3>
      <p className="max-w-sm font-(family-name:--font-dm-sans) text-sm text-[rgba(47,78,64,0.55)]">
        {description}
      </p>
    </div>
  );
}
