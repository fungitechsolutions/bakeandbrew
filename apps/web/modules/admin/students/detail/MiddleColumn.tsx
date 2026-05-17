"use client";

import { useState } from "react";
import { StudentDetail, StudentPaymentDetails } from "@repo/types";
import {
  CalendarDays,
  Clock,
  Hash,
  MapPin,
  Mail,
  Phone,
  User,
  GraduationCap,
  Users,
  CreditCard,
  Plus,
  Pencil,
  X,
  Check,
} from "lucide-react";
import { InfoRow } from "./InfoRow";
import { SectionCard } from "./shared/SectionCard";

// ─── Types ────────────────────────────────────────────────────────────────────

type Student = Extract<StudentDetail, { success: true }>["data"];

type Payment = Extract<
  StudentPaymentDetails,
  { success: true }
>["data"][number];

type PaymentRowProps = {
  payment: {
    id: string | number;
    amount: number;
    addedAt: string;
    remarks?: string | null;
    addedByName?: string;
    paymentMode?: string | null;
  };
  student: {
    referenceNo: string;
    fullName: string;
    phone: string;
    fiscalYear: string;
  };
  receiptNo: number;
};

// ─── Form field types ─────────────────────────────────────────────────────────

type PersonalInfoForm = {
  fullName: string;
  dob: string;
  gender: "male" | "female" | "other";
  phone: string;
  source: "facebook" | "instagram" | "tiktok" | "referral" | "inperson";
  shift: "morning" | "afternoon" | "evening" | "";
  shiftTime: string;
  address: string;
  batch: string;
};

type GuardianForm = {
  guardianName: string;
  guardianPhone: string;
};

// ─── Shared input primitives ──────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl border border-[#2d4a3e]/15 bg-[#f4f1ec]/60 px-3 py-2 text-[0.88rem] font-medium text-[#2d4a3e] outline-none placeholder:text-[#2d4a3e]/25 transition-colors focus:border-[#2d4a3e]/40 focus:ring-2 focus:ring-[#2d4a3e]/08";

const selectCls =
  "w-full rounded-xl border border-[#2d4a3e]/15 bg-[#f4f1ec]/60 px-3 py-2 text-[0.88rem] font-medium text-[#2d4a3e] outline-none transition-colors focus:border-[#2d4a3e]/40 focus:ring-2 focus:ring-[#2d4a3e]/08 appearance-none cursor-pointer";

function EditField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#2d4a3e]/40"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Section edit toolbar ─────────────────────────────────────────────────────

function EditToolbar({
  onSave,
  onCancel,
  saving,
}: {
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onCancel}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2d4a3e]/12 text-[#2d4a3e]/40 transition-all hover:bg-[#f4f1ec] hover:text-[#2d4a3e]"
        aria-label="Cancel"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="flex h-7 items-center gap-1.5 rounded-lg bg-[#2d4a3e] px-3 text-[0.75rem] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
        style={{ fontFamily: "var(--font-dm-sans)" }}
        aria-label="Save"
      >
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

function EditIconBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#2d4a3e]/30 transition-all hover:bg-[#2d4a3e]/06 hover:text-[#2d4a3e]"
      aria-label="Edit"
    >
      <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  );
}

// ─── Personal Info section ────────────────────────────────────────────────────

function PersonalInfoSection({ student }: { student: Student }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PersonalInfoForm>({
    fullName: student.fullName,
    dob: new Date(student.dob).toISOString().split("T")[0],
    gender: student.gender,
    phone: student.phone,
    source: student.source,
    shift: student.shift ?? "",
    shiftTime: student.shiftTime ?? "",
    address: student.address,
    batch: student?.batch ?? "",
  });

  const set =
    <K extends keyof PersonalInfoForm>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: await yourApiCall({ ...form, shift: form.shift || undefined })
      console.log("PATCH personal info", form);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      fullName: student.fullName,
      dob: new Date(student.dob).toISOString().split("T")[0],
      gender: student.gender,
      phone: student.phone,
      source: student.source,
      shift: student.shift ?? "",
      shiftTime: student.shiftTime ?? "",
      address: student.address,
      batch: student.batch ?? "",
    });
    setEditing(false);
  };

  return (
    <SectionCard
      title="Personal Information"
      icon={User}
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
          <EditField label="Full Name">
            <input
              className={inputCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.fullName}
              onChange={set("fullName")}
              placeholder="Full name"
            />
          </EditField>

          <EditField label="Date of Birth">
            <input
              type="date"
              className={inputCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.dob}
              onChange={set("dob")}
            />
          </EditField>

          <EditField label="Gender">
            <select
              className={selectCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.gender}
              onChange={set("gender")}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </EditField>

          <EditField label="Phone">
            <input
              className={inputCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.phone}
              onChange={set("phone")}
              placeholder="Phone number"
            />
          </EditField>

          {/* Email — read-only */}
          <EditField label="Email">
            <div className="flex items-center gap-1.5 rounded-xl border border-[#2d4a3e]/08 bg-[#2d4a3e]/04 px-3 py-2">
              <Mail
                className="h-3.5 w-3.5 flex-shrink-0 text-[#2d4a3e]/25"
                strokeWidth={2}
              />
              <span
                className="text-[0.88rem] text-[#2d4a3e]/40"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {student.email ?? "Not provided"}
              </span>
            </div>
          </EditField>

          <EditField label="Source">
            <select
              className={selectCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.source}
              onChange={set("source")}
            >
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="referral">Referral</option>
              <option value="inperson">In Person</option>
            </select>
          </EditField>

          <EditField label="Shift">
            <select
              className={selectCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.shift}
              onChange={set("shift")}
            >
              <option value="">— None —</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </EditField>

          <EditField label="Shift Time">
            <input
              className={inputCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.shiftTime}
              onChange={set("shiftTime")}
              placeholder="e.g. 6:00 AM – 8:00 AM"
            />
          </EditField>

          <EditField label="Batch">
            <input
              className={inputCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.batch}
              onChange={set("batch")}
              placeholder="Batch name or number"
            />
          </EditField>

          <EditField label="Address">
            <input
              className={inputCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.address}
              onChange={set("address")}
              placeholder="Full address"
            />
          </EditField>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow label="Full Name" value={student.fullName} icon={User} />
          <InfoRow
            label="Date of Birth"
            value={new Date(student.dob).toLocaleDateString("en-NP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            icon={CalendarDays}
          />
          <InfoRow label="Gender" value={student.gender} icon={User} />
          <InfoRow label="Phone" value={student.phone} icon={Phone} />
          <InfoRow
            label="Email"
            value={student.email ?? "Not provided"}
            icon={Mail}
          />
          <InfoRow label="Source" value={student.source} icon={Hash} />
          <InfoRow label="Shift" value={student.shift ?? "—"} icon={Clock} />
          <InfoRow
            label="Shift Time"
            value={student.shiftTime ?? "—"}
            icon={Clock}
          />
          <InfoRow
            label="Batch"
            value={student.batch ?? "—"}
            icon={GraduationCap}
          />
          <InfoRow label="Address" value={student.address} icon={MapPin} />
        </div>
      )}
    </SectionCard>
  );
}

// ─── Guardian section ─────────────────────────────────────────────────────────

function GuardianSection({ student }: { student: Student }) {
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

// ─── MiddleColumn ─────────────────────────────────────────────────────────────

export function MiddleColumn({
  student,
  payments,
  setShowPaymentModal,
  PaymentRow,
}: {
  student: Student;
  payments: Payment[];
  setShowPaymentModal: (v: boolean) => void;
  PaymentRow: React.ComponentType<PaymentRowProps>;
}) {
  return (
    <div className="flex flex-col gap-5">
      <PersonalInfoSection student={student} />
      <GuardianSection student={student} />

      {/* Payments */}
      <SectionCard title="Payment History" icon={CreditCard}>
        <div className="mb-4 flex items-center justify-between">
          <p
            className="text-[0.82rem] text-[#2d4a3e]/50"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {payments.length} payment{payments.length !== 1 ? "s" : ""} recorded
          </p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2d4a3e] px-3 py-1.5 text-[0.78rem] font-semibold text-white transition-all hover:opacity-90"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            <Plus className="h-3 w-3" strokeWidth={2.5} />
            Add
          </button>
        </div>
        {payments.length === 0 ? (
          <p
            className="py-6 text-center text-[0.85rem] text-[#2d4a3e]/35"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            No payments recorded yet.
          </p>
        ) : (
          <div className="flex max-h-88 flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#2d4a3e]/20 scrollbar-track-transparent">
            {[...payments].reverse().map((p, reversedIdx) => {
              const originalIdx = payments.length - 1 - reversedIdx;
              return (
                <PaymentRow
                  key={p.id}
                  payment={{
                    id: p.id,
                    amount: p.amount,
                    addedAt:
                      p.addedAt instanceof Date
                        ? p.addedAt.toISOString()
                        : String(p.addedAt),
                    remarks: p.remarks,
                    addedByName: p.addedByName,
                    paymentMode: p.paymentMode,
                  }}
                  student={student}
                  receiptNo={originalIdx + 1}
                />
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
