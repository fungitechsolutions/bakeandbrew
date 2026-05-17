"use client";

import { Spinner } from "@/components/ui/spinner";
import { StudentDiscountResponse } from "@repo/types";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type Discount = Extract<
  StudentDiscountResponse,
  { success: true }
>["data"][number];
export function DeleteDiscountDialog({
  discount,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  discount: Discount;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  const [input, setInput] = useState("");
  const ready = input === "DELETE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
      <div
        className="mx-4 w-full max-w-sm rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#2d4a3e]/08 px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
            <Trash2 className="h-4 w-4 text-red-500" strokeWidth={2} />
          </div>
          <h2
            className="text-[0.92rem] font-semibold text-[#2d4a3e]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Remove Discount
          </h2>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p
            className="mb-1 text-[0.85rem] leading-[1.6] text-[#2d4a3e]/70"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            You are about to remove the{" "}
            <span className="font-semibold text-[#2d4a3e]">
              {discount.type}
            </span>{" "}
            discount of{" "}
            <span className="font-semibold text-[#e8552a]">
              {discount.percent}%
            </span>{" "}
            (− NPR {(discount.amount / 100).toLocaleString()}). This action
            cannot be undone.
          </p>

          <p
            className="mb-2 mt-4 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#2d4a3e]/50"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Type{" "}
            <span className="font-bold text-red-500 normal-case tracking-normal">
              DELETE
            </span>{" "}
            to confirm
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="DELETE"
            className="w-full rounded-xl border border-[#2d4a3e]/15 bg-[#f4f1ec]/60 px-3 py-2.5 text-[0.88rem] font-medium text-[#2d4a3e] outline-none placeholder:text-[#2d4a3e]/25 focus:border-red-300 focus:ring-2 focus:ring-red-100"
            style={{ fontFamily: "var(--font-dm-sans)" }}
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-[#2d4a3e]/08 px-5 py-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-[#2d4a3e]/12 px-4 py-2 text-[0.82rem] font-medium text-[#2d4a3e]/60 transition-colors hover:bg-[#f4f1ec]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!ready || isDeleting}
            className="rounded-xl bg-red-500 px-4 py-2 text-[0.82rem] font-semibold text-white transition-all hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40 flex items-center gap-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {isDeleting ? (
              <>
                <Spinner />
                Removing...
              </>
            ) : (
              " Remove Discount"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
