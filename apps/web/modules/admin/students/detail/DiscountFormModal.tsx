"use client";

import { useState } from "react";
import { ModalShell } from "./shared/ModalShell";
import { PercentIcon } from "lucide-react";
import { FormField } from "./shared/FormField";

export type DiscountFormData = {
  type: string;
  percent: string;
  note: string;
};

const inputCls =
  "w-full rounded-xl border border-[#2d4a3e]/15 bg-[#f4f1ec]/60 px-3 py-2.5 text-[0.88rem] font-medium text-[#2d4a3e] outline-none placeholder:text-[#2d4a3e]/25 transition-colors focus:border-[#2d4a3e]/40 focus:ring-2 focus:ring-[#2d4a3e]/08";

export function DiscountFormModal({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: DiscountFormData;
  onSubmit: (data: DiscountFormData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<DiscountFormData>(
    initial ?? { type: "", percent: "", note: "" },
  );
  const [submitting, setSubmitting] = useState(false);

  const set =
    (k: keyof DiscountFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const isEdit = !!initial;

  const valid =
    form.type.trim().length > 0 &&
    form.percent.trim().length > 0 &&
    Number(form.percent) > 0;

  const handleSubmit = () => {
    if (!valid) return;
    setSubmitting(true);
    // TODO: call your API here, then call onSubmit with the result
    onSubmit(form);
  };

  return (
    <ModalShell
      title={isEdit ? "Edit Discount" : "Add Discount"}
      icon={PercentIcon}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? "Save Changes" : "Add Discount"}
      submitting={submitting}
    >
      <FormField label="Discount Type" required>
        <input
          className={inputCls}
          style={{ fontFamily: "var(--font-dm-sans)" }}
          placeholder="e.g. Sibling, Early Bird, Referral"
          maxLength={50}
          value={form.type}
          onChange={set("type")}
          autoFocus
        />
      </FormField>

      <FormField label="Percent" required hint="Must be greater than 0">
        <div className="relative">
          <input
            className={inputCls + " pr-8"}
            style={{ fontFamily: "var(--font-dm-sans)" }}
            placeholder="e.g. 10"
            type="number"
            min={0.01}
            step="any"
            value={form.percent}
            onChange={set("percent")}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[0.85rem] font-semibold text-[#2d4a3e]/40">
            %
          </span>
        </div>
      </FormField>

      <FormField label="Note" hint="Optional — max 100 characters">
        <textarea
          className={inputCls + " resize-none"}
          style={{ fontFamily: "var(--font-dm-sans)" }}
          placeholder="Any additional context…"
          maxLength={100}
          rows={2}
          value={form.note}
          onChange={set("note")}
        />
      </FormField>
    </ModalShell>
  );
}
