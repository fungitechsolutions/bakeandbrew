"use client";

import { GraduationCap, Pencil, Trash2 } from "lucide-react";
import { AddBtn } from "./AddButton";
import { SectionCard } from "./SectionCard";
import { DeleteScholarshipDialog } from "./DeleteScholarshipDialog";
import { useState } from "react";
import { IconBtn } from "./IconButton";
import { ScholarshipFormModal } from "./ScholarshipFormModal";

const MOCK_SCHOLARSHIP: Scholarship | null = {
  id: "sc1",
  studentId: "s1",
  addedBy: "u3",
  addedByName: "Hari Bahadur",
  percent: 25,
  note: "Merit scholarship – scored 90%+ in entrance",
  amount: 375000,
  createdAt: "2025-01-20T11:00:00Z",
};

type Scholarship = {
  id: string;
  studentId: string;
  addedBy: string;
  addedByName: string;
  percent: number;
  note: string | null;
  amount: number; // paisa
  createdAt: string;
};

type ScholarshipFormData = {
  percent: string;
  note: string;
};

export function ScholarshipSection() {
  const [scholarship, setScholarship] = useState<Scholarship | null>(
    MOCK_SCHOLARSHIP,
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = () => {
    setScholarship(null);
    setShowDeleteDialog(false);
  };

  const handleAdd = (data: ScholarshipFormData) => {
    // TODO: replace with real API call + use returned data
    const newScholarship: Scholarship = {
      id: crypto.randomUUID(),
      studentId: "",
      addedBy: "",
      addedByName: "You",
      percent: Number(data.percent),
      note: data.note || null,
      amount: 0,
      createdAt: new Date().toISOString(),
    };
    setScholarship(newScholarship);
    setShowAddModal(false);
  };

  const handleEdit = (data: ScholarshipFormData) => {
    if (!scholarship) return;
    // TODO: replace with real API call + use returned data
    setScholarship({
      ...scholarship,
      percent: Number(data.percent),
      note: data.note || null,
    });
    setShowEditModal(false);
  };

  return (
    <SectionCard title="Scholarship" icon={GraduationCap}>
      {showDeleteDialog && (
        <DeleteScholarshipDialog
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
      {showAddModal && (
        <ScholarshipFormModal
          onSubmit={handleAdd}
          onCancel={() => setShowAddModal(false)}
        />
      )}
      {showEditModal && scholarship && (
        <ScholarshipFormModal
          initial={{
            percent: String(scholarship.percent),
            note: scholarship.note ?? "",
          }}
          onSubmit={handleEdit}
          onCancel={() => setShowEditModal(false)}
        />
      )}

      {scholarship ? (
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-[#2d4a3e]/08 bg-[#f4f1ec]/50 px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-[1.4rem] font-bold text-[#2d4a3e]"
                    style={{ fontFamily: "var(--font-lora)" }}
                  >
                    {scholarship.percent}%
                  </span>
                  <span
                    className="text-[0.78rem] text-[#2d4a3e]/50"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    scholarship
                  </span>
                </div>
                <span
                  className="text-[0.82rem] font-semibold text-[#2d4a3e]/70"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  − NPR {(scholarship.amount / 100).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <IconBtn
                  icon={Pencil}
                  label="Edit"
                  onClick={() => setShowEditModal(true)}
                />
                <IconBtn
                  icon={Trash2}
                  label="Delete"
                  onClick={() => setShowDeleteDialog(true)}
                  variant="danger"
                />
              </div>
            </div>

            {scholarship.note && (
              <p
                className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[0.78rem] italic leading-[1.5] text-amber-700"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {scholarship.note}
              </p>
            )}

            <p
              className="mt-2 text-[0.72rem] text-[#2d4a3e]/40"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Awarded by{" "}
              <span className="font-semibold text-[#2d4a3e]/60">
                {scholarship.addedByName}
              </span>{" "}
              ·{" "}
              {new Date(scholarship.createdAt).toLocaleDateString("en-NP", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d4a3e]/06">
            <GraduationCap
              className="h-5 w-5 text-[#2d4a3e]/30"
              strokeWidth={1.5}
            />
          </div>
          <p
            className="text-center text-[0.85rem] text-[#2d4a3e]/35"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            No scholarship awarded yet.
          </p>
          <AddBtn
            label="Award Scholarship"
            onClick={() => setShowAddModal(true)}
          />
        </div>
      )}
    </SectionCard>
  );
}
