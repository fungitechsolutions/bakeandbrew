"use client";

import { useState } from "react";
import { ModalShell } from "./shared/ModalShell";
import { GraduationCap } from "lucide-react";
import { FormField } from "./shared/FormField";
import {
  APIError,
  StudentScholarshipInput,
  studentScholarshipMutationSchema,
} from "@repo/types";
import z from "zod";
import { mapFieldErrors } from "@/utils/api";
import { FieldError } from "@/components/ui/field";

type ScholarshipFormData = {
  percent: string;
  note: string;
};

const inputCls =
  "w-full rounded-xl border border-[#2d4a3e]/15 bg-[#f4f1ec]/60 px-3 py-2.5 text-[0.88rem] font-medium text-[#2d4a3e] outline-none placeholder:text-[#2d4a3e]/25 transition-colors focus:border-[#2d4a3e]/40 focus:ring-2 focus:ring-[#2d4a3e]/08";

export function ScholarshipFormModal({
  initial,
  onSubmit,
  isPending,
  onCancel,
}: {
  initial?: StudentScholarshipInput;
  onSubmit: (data: StudentScholarshipInput) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState<ScholarshipFormData>({
    percent: initial?.percent.toString() ?? "",
    note: initial?.note ?? "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ScholarshipFormData, string>>
  >({});

  const set =
    (k: keyof ScholarshipFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const isEdit = !!initial;

  const handleSubmit = async () => {
    const validate = studentScholarshipMutationSchema.safeParse({
      ...form,
      percent: Number(form.percent),
    });
    if (!validate.success) {
      const tree = z.treeifyError(validate.error).properties;
      setErrors({
        percent: tree?.percent?.errors[0],
        note: tree?.note?.errors[0],
      });
      return;
    }
    try {
      await onSubmit({ ...form, percent: Number(form.percent) });
    } catch (err) {
      const error = err as APIError;
      if (error.errors?.length) {
        setErrors(mapFieldErrors(error));
      }
    }
  };

  return (
    <ModalShell
      title={isEdit ? "Edit Scholarship" : "Award Scholarship"}
      icon={GraduationCap}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? "Save Changes" : "Award Scholarship"}
      submitting={isPending}
    >
      <FormField label="Percent" required hint="Must be between 0 and 100">
        <div className="relative">
          <input
            className={inputCls + " pr-8"}
            style={{ fontFamily: "var(--font-dm-sans)" }}
            placeholder="e.g. 25"
            type="number"
            min={0.01}
            max={100}
            step="any"
            value={form.percent}
            onChange={set("percent")}
            autoFocus
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[0.85rem] font-semibold text-[#2d4a3e]/40">
            %
          </span>
        </div>
        {errors.percent && <FieldError>{errors.percent}</FieldError>}
      </FormField>

      <FormField label="Note" hint="Optional — max 100 characters">
        <textarea
          className={inputCls + " resize-none"}
          style={{ fontFamily: "var(--font-dm-sans)" }}
          placeholder="Reason for awarding scholarship…"
          maxLength={100}
          rows={2}
          value={form.note}
          onChange={set("note")}
        />
        {errors.note && <FieldError>{errors.note}</FieldError>}
      </FormField>
    </ModalShell>
  );
}
