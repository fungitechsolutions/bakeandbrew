"use client";

import { useRouter } from "next/navigation";
import type { DiscountListItem } from "../shared/student-finance-list-types";
import { StudentFinanceStudentCell } from "../shared/StudentFinanceStudentCell";
import {
  formatFinanceDate,
  formatFinancePercent,
} from "../shared/student-finance-list-utils";
import { formatNpr } from "../shared/student-utils";

const tdClass =
  "border-b border-[rgba(47,78,64,0.1)] px-5 py-4 align-middle whitespace-nowrap group-last:border-b-0";

function formatDiscountType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export function DiscountTableRow({ discount }: { discount: DiscountListItem }) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(`/admin/students/${discount.studentId}`)}
      className="group cursor-pointer transition-colors hover:bg-[rgba(47,78,64,0.03)]"
    >
      <td className={tdClass}>
        <StudentFinanceStudentCell
          fullName={discount.fullName}
          email={discount.email}
          referenceNo={discount.referenceNo}
        />
      </td>
      <td className={tdClass}>
        <span className="font-(family-name:--font-dm-sans) text-sm text-[rgba(47,78,64,0.75)]">
          {formatDiscountType(discount.type)}
        </span>
      </td>
      <td className={`${tdClass} text-right`}>
        <span className="font-(family-name:--font-dm-sans) text-sm tabular-nums text-[rgba(47,78,64,0.75)]">
          {formatFinancePercent(discount.percent)}
        </span>
      </td>
      <td className={`${tdClass} text-right`}>
        <span className="font-(family-name:--font-dm-sans) text-sm font-semibold tabular-nums text-(--brand-ink)">
          {formatNpr(discount.amount / 100)}
        </span>
      </td>
      <td className={`${tdClass} max-w-[200px]`}>
        <span
          className="block truncate font-(family-name:--font-dm-sans) text-sm text-[rgba(47,78,64,0.6)]"
          title={discount.note ?? undefined}
        >
          {discount.note?.trim() || "—"}
        </span>
      </td>
      <td className={tdClass}>
        <span className="font-(family-name:--font-dm-sans) text-sm text-[rgba(47,78,64,0.65)]">
          {formatFinanceDate(discount.createdAt)}
        </span>
      </td>
    </tr>
  );
}
