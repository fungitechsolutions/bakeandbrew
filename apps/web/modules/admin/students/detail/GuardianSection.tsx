"use client";

import { useState } from "react";
import { SectionCard } from "./shared/SectionCard";
import { EditToolbar } from "./shared/EditToolBar";
import { StudentDetail } from "@repo/types";
import { EditIconBtn } from "./shared/EditIconButton";
import { EditField } from "./shared/EditField";
import { inputCls } from "./shared/utils";
import { InfoRow } from "./InfoRow";
import { Phone, User, Users } from "lucide-react";

type Student = Extract<StudentDetail, { success: true }>["data"];

type GuardianForm = {
  guardianName: string;
  guardianPhone: string;
};
export function GuardianSection({ student }: { student: Student }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<GuardianForm>({
    guardianName: student.guardianName,
    guardianPhone: student.guardianPhone,
  });

  const set =
    <K extends keyof GuardianForm>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: await yourApiCall(form)
      console.log("PATCH guardian info", form);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
    });
    setEditing(false);
  };

  return (
    <SectionCard
      title="Guardian Information"
      icon={Users}
      action={
        editing ? (
          <EditToolbar
            onSave={handleSave}
            onCancel={handleCancel}
            saving={saving}
          />
        ) : (
          <EditIconBtn onClick={() => setEditing(true)} />
        )
      }
    >
      {editing ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <EditField label="Guardian Name">
            <input
              className={inputCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.guardianName}
              onChange={set("guardianName")}
              placeholder="Guardian's full name"
              autoFocus
            />
          </EditField>

          <EditField label="Guardian Phone">
            <input
              className={inputCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.guardianPhone}
              onChange={set("guardianPhone")}
              placeholder="Guardian's phone number"
            />
          </EditField>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow
            label="Guardian Name"
            value={student.guardianName}
            icon={User}
          />
          <InfoRow
            label="Guardian Phone"
            value={student.guardianPhone}
            icon={Phone}
          />
        </div>
      )}
    </SectionCard>
  );
}
