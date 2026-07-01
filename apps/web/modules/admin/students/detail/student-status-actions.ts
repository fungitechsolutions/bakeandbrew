import type { Status } from "./StudentDetail";

export function canPerformStudentActions(status: Status): boolean {
  return status === "active" || status === "completed";
}

export const STUDENT_STATUS_ACTION_TOOLTIP =
  "Set the student status to Active or Completed to use this action.";

export const STUDENT_BALANCE_CLEARED_TOOLTIP =
  "Balance is already cleared. New scholarships and discounts cannot be added.";

export function canAddStudentFinanceAdjustments(
  status: Status,
  balanceDue: number,
): boolean {
  return canPerformStudentActions(status) && balanceDue > 0;
}

export function getStudentFinanceAdjustmentDisabledTooltip(
  status: Status,
  balanceDue: number,
): string | undefined {
  if (!canPerformStudentActions(status)) return STUDENT_STATUS_ACTION_TOOLTIP;
  if (balanceDue <= 0) return STUDENT_BALANCE_CLEARED_TOOLTIP;
  return undefined;
}
