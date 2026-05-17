import { Pencil, Trash2 } from "lucide-react";
import { IconBtn } from "./IconButton";
import { StudentDiscountResponse } from "@repo/types";

type Discount = Extract<
  StudentDiscountResponse,
  { success: true }
>["data"][number];
export function DiscountRow({
  discount,
  onEdit,
  onDelete,
}: {
  discount: Discount;
  onEdit: (d: Discount) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-[#2d4a3e]/08 bg-[#f4f1ec]/50 px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-[#e8552a]/10 px-2 py-0.5 text-[0.72rem] font-semibold text-[#e8552a]">
            {discount.type}
          </span>
          <span
            className="text-[0.88rem] font-bold text-[#2d4a3e]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {discount.percent}%
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <IconBtn
            icon={Pencil}
            label="Edit"
            onClick={() => onEdit(discount)}
          />
          <IconBtn
            icon={Trash2}
            label="Delete"
            onClick={() => onDelete(discount.id)}
            variant="danger"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span
          className="text-[0.78rem] text-[#2d4a3e]/50"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          − NPR {(discount.amount / 100).toLocaleString()}
        </span>
        <span
          className="text-[0.72rem] text-[#2d4a3e]/40"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          by {discount.addedByName}
        </span>
      </div>
      {discount.note && (
        <p
          className="text-[0.75rem] italic text-[#2d4a3e]/40"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {discount.note}
        </p>
      )}
    </div>
  );
}
