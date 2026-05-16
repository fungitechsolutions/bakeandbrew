"use client";

import { useState } from "react";
import { SectionCard } from "./SectionCard";
import { DeleteDiscountDialog } from "./DeleteDiscountDialog";
import { AddBtn } from "./AddButton";
import { DiscountRow } from "./DiscountRow";
import { Percent } from "lucide-react";
import { DiscountFormModal } from "./DiscountFormModal";

const MOCK_DISCOUNTS: Discount[] = [
  {
    id: "d1",
    studentId: "s1",
    addedBy: "u1",
    addedByName: "Sita Sharma",
    type: "Sibling",
    percent: 10,
    note: "Elder sibling already enrolled",
    amount: 150000,
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "d2",
    studentId: "s1",
    addedBy: "u2",
    addedByName: "Ram Thapa",
    type: "Early Bird",
    percent: 5,
    note: "Enrolled before deadline",
    amount: 75000,
    createdAt: "2025-01-16T09:00:00Z",
  },
  {
    id: "d3",
    studentId: "s1",
    addedBy: "u1",
    addedByName: "Sita Sharma",
    type: "Referral",
    percent: 3,
    note: null,
    amount: 45000,
    createdAt: "2025-02-01T14:15:00Z",
  },
];
type Discount = {
  id: string;
  studentId: string;
  addedBy: string;
  addedByName: string;
  type: string;
  percent: number;
  note: string | null;
  amount: number;
  createdAt: string;
};

type DiscountFormData = {
  type: string;
  percent: string;
  note: string;
};

export function DiscountSection() {
  const [discounts, setDiscounts] = useState<Discount[]>(MOCK_DISCOUNTS);
  const [deleteTarget, setDeleteTarget] = useState<Discount | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Discount | null>(null);

  const handleDelete = (id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
    setDeleteTarget(null);
  };

  const handleAdd = (data: DiscountFormData) => {
    // TODO: replace with real API call + use returned data
    const newDiscount: Discount = {
      id: crypto.randomUUID(),
      studentId: "",
      addedBy: "",
      addedByName: "You",
      type: data.type,
      percent: Number(data.percent),
      note: data.note || null,
      amount: 0,
      createdAt: new Date().toISOString(),
    };
    setDiscounts((prev) => [...prev, newDiscount]);
    setShowAddModal(false);
  };

  const handleEdit = (data: DiscountFormData) => {
    if (!editTarget) return;
    // TODO: replace with real API call + use returned data
    setDiscounts((prev) =>
      prev.map((d) =>
        d.id === editTarget.id
          ? {
              ...d,
              type: data.type,
              percent: Number(data.percent),
              note: data.note || null,
            }
          : d,
      ),
    );
    setEditTarget(null);
  };

  return (
    <SectionCard title="Discounts" icon={Percent}>
      {deleteTarget && (
        <DeleteDiscountDialog
          discount={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {showAddModal && (
        <DiscountFormModal
          onSubmit={handleAdd}
          onCancel={() => setShowAddModal(false)}
        />
      )}
      {editTarget && (
        <DiscountFormModal
          initial={{
            type: editTarget.type,
            percent: String(editTarget.percent),
            note: editTarget.note ?? "",
          }}
          onSubmit={handleEdit}
          onCancel={() => setEditTarget(null)}
        />
      )}

      <div className="mb-3 flex items-center justify-between">
        <p
          className="text-[0.82rem] text-[#2d4a3e]/50"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {discounts.length} discount{discounts.length !== 1 ? "s" : ""}
        </p>
        <AddBtn label="Add" onClick={() => setShowAddModal(true)} />
      </div>

      {discounts.length === 0 ? (
        <p
          className="py-6 text-center text-[0.85rem] text-[#2d4a3e]/35"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          No discounts applied.
        </p>
      ) : (
        <div className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#2d4a3e]/20 scrollbar-track-transparent">
          {discounts.map((d) => (
            <DiscountRow
              key={d.id}
              discount={d}
              onEdit={() => setEditTarget(d)}
              onDelete={() => setDeleteTarget(d)}
            />
          ))}
        </div>
      )}

      {discounts.length > 0 && (
        <div className="mt-3 flex items-center justify-between border-t border-[#2d4a3e]/08 pt-3">
          <span
            className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#2d4a3e]/40"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Total Saved
          </span>
          <span
            className="text-[0.9rem] font-bold text-[#e8552a]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            − NPR{" "}
            {discounts
              .reduce((sum, d) => sum + d.amount / 100, 0)
              .toLocaleString()}
          </span>
        </div>
      )}
    </SectionCard>
  );
}
