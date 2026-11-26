import type { CourseChangeSummary } from "@repo/types";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField } from "./shared/FormField";
import { inputCls } from "./shared/utils";
import { detailLabelClass, detailValueClass } from "./detail-styles";
import { formatNpr } from "../shared/student-utils";

export const COURSE_CHANGE_CONFIRMATION = "CONFIRM";

const amountClass =
  "font-(family-name:--font-dm-sans) text-sm font-semibold tabular-nums text-(--brand-green)";

function rupees(paisa: number) {
  return formatNpr(paisa / 100);
}

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={detailLabelClass}>{label}</span>
      <span className={cn(amountClass, accent && "text-[#9a3412]")}>
        {value}
      </span>
    </div>
  );
}

// The second step of a course change for a student with payments, discounts
// or a scholarship: shows what carries over (worked out by the server) and asks
// the admin to type the confirmation word.
export function CourseChangeConfirmation({
  summary,
  reason,
  onReasonChange,
  confirmText,
  onConfirmTextChange,
  onBack,
  disabled,
}: {
  summary: CourseChangeSummary;
  reason: string;
  onReasonChange: (value: string) => void;
  confirmText: string;
  onConfirmTextChange: (value: string) => void;
  onBack: () => void;
  disabled?: boolean;
}) {
  const changedAdjustments = summary.adjustments.filter(
    (adj) => adj.oldAmount !== adj.newAmount,
  );

  return (
    <>
      <div className="flex flex-col gap-1">
        <span className={detailLabelClass}>Courses</span>
        <p className={detailValueClass}>
          {summary.oldCourses.map((c) => c.name).join(", ")} →{" "}
          {summary.newCourses.map((c) => c.name).join(", ")}
        </p>
        <button
          type="button"
          onClick={onBack}
          disabled={disabled}
          className="self-start font-(family-name:--font-dm-sans) text-xs font-semibold text-(--brand-brown) underline-offset-2 hover:underline disabled:opacity-50"
        >
          Change selection
        </button>
      </div>

      <div className="flex flex-col gap-2 border-t border-[rgba(47,78,64,0.12)] pt-3">
        <SummaryRow
          label="Total fee"
          value={`${rupees(summary.oldTotalFee)} → ${rupees(summary.newTotalFee)}`}
        />
        <SummaryRow
          label="Paid (carried forward)"
          value={rupees(summary.totalPaid)}
        />
        {summary.adjustments.map((adj, i) => (
          <SummaryRow
            key={`${adj.kind}-${i}`}
            label={
              adj.kind === "scholarship"
                ? "Scholarship"
                : `Discount: ${adj.label}`
            }
            value={
              adj.oldAmount === adj.newAmount
                ? rupees(adj.newAmount)
                : `${rupees(adj.oldAmount)} → ${rupees(adj.newAmount)}`
            }
          />
        ))}
        {summary.excessAmount > 0 ? (
          <SummaryRow
            label="Overpaid"
            value={rupees(summary.excessAmount)}
            accent
          />
        ) : (
          <SummaryRow label="Balance due" value={rupees(summary.balanceDue)} />
        )}
      </div>

      {changedAdjustments.length > 0 ? (
        <p className="font-(family-name:--font-dm-sans) text-xs text-[rgba(47,78,64,0.55)]">
          Percent discounts and the scholarship are rescaled to the new fee.
          Adjustments can&apos;t exceed what is left to pay, so they shrink
          (newest first) when the new fee is lower.
        </p>
      ) : null}

      {summary.excessAmount > 0 ? (
        <div
          role="alert"
          className="flex gap-2.5 border border-amber-200 bg-amber-50 px-3 py-2.5 font-(family-name:--font-dm-sans) text-xs leading-relaxed text-amber-900"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            The student has paid {rupees(summary.excessAmount)} more than the
            new fee. This is recorded as owed back to them (refund or credit) in
            the course change history and the admin notes.
          </span>
        </div>
      ) : null}

      <FormField label="Reason" hint="Optional, saved with the change history.">
        <textarea
          className={cn(inputCls, "resize-none")}
          rows={2}
          maxLength={500}
          placeholder="e.g. Picked the wrong course at admission"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          disabled={disabled}
        />
      </FormField>

      {summary.requiresConfirmation ? (
        <FormField
          label={`Type ${COURSE_CHANGE_CONFIRMATION} to change the course`}
          required
        >
          <input
            className={inputCls}
            value={confirmText}
            onChange={(e) => onConfirmTextChange(e.target.value)}
            placeholder={COURSE_CHANGE_CONFIRMATION}
            autoComplete="off"
            spellCheck={false}
            disabled={disabled}
            aria-label={`Type ${COURSE_CHANGE_CONFIRMATION} to confirm`}
          />
        </FormField>
      ) : null}
    </>
  );
}
