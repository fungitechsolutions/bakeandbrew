"use client";

import { useState } from "react";
import { SectionCard } from "./shared/SectionCard";
import { EditToolbar } from "./shared/EditToolBar";
import { EditIconBtn } from "./shared/EditIconButton";
import { cn } from "@/lib/utils";
import {
  APIError,
  APIResponse,
  StudentDetail,
  updateStudentPersonalInfoInputSchema,
} from "@repo/types";
import {
  CalendarDays,
  Clock,
  GraduationCap,
  Hash,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { inputCls, selectCls } from "./shared/utils";
import { InfoRow } from "./InfoRow";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  UpdateStudentPersonalInfo,
  UpdateStudentPersonalInfoResponse,
} from "@repo/types/admin/students/personal-info";
import api from "@/lib/axios";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { mapFieldErrors } from "@/utils/api";
import { FieldError } from "@/components/ui/field";
import { useRouter } from "next/navigation";

type Student = Extract<StudentDetail, { success: true }>["data"];

type PersonalInfoForm = {
  fullName: string;
  dob: string;
  gender: "male" | "female" | "other";
  phone: string;
  source: "facebook" | "instagram" | "tiktok" | "referral" | "inperson";
  shift: "morning" | "day" | "evening";
  shiftTime: string;
  address: string;
  batch: string;
};

function EditField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
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

export function PersonalInfoSection({ student }: { student: Student }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PersonalInfoForm>({
    fullName: student.fullName,
    dob: new Date(student.dob).toISOString().split("T")[0],
    gender: student.gender,
    phone: student.phone,
    source: student.source,
    shift: student.shift,
    shiftTime: student.shiftTime ?? "",
    address: student.address,
    batch: student?.batch ?? "",
  });
  const [errors, setErrors] =
    useState<Partial<Record<keyof PersonalInfoForm, string>>>();
  const router = useRouter();

  const set =
    <K extends keyof PersonalInfoForm>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const { mutateAsync } = useMutation<
    UpdateStudentPersonalInfoResponse,
    AxiosError<APIError>,
    UpdateStudentPersonalInfo
  >({
    mutationFn: async (data: UpdateStudentPersonalInfo) => {
      const res = await api.put(
        `/admin/students/${student.id}/info/personal`,
        data,
      );
      return res.data;
    },
    onSuccess: (result) => {
      toast.success(result.message);
      router.refresh();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as APIResponse;
        if (data.errors) {
          console.log("errors: ", data.errors);
          setErrors(mapFieldErrors(data));
        }
      }
      toast.error(error.message);
    },
  });

  const handleSave = async () => {
    setSaving(true);
    console.log("batch: ", form.batch);
    const validateFields = updateStudentPersonalInfoInputSchema.safeParse(form);
    if (!validateFields.success) {
      setSaving(false);
      const tree = z.treeifyError(validateFields.error).properties;
      console.log("error: ", tree);
      setErrors({
        fullName: tree?.fullName?.errors[0],
        dob: tree?.dob?.errors[0],
        gender: tree?.gender?.errors[0],
        phone: tree?.phone?.errors[0],
        shift: tree?.shift?.errors[0],
        shiftTime: tree?.shiftTime?.errors[0],
        address: tree?.address?.errors[0],
        batch: tree?.batch?.errors[0],
        source: tree?.source?.errors[0],
      });

      return;
    }
    try {
      await mutateAsync(form);
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
    setErrors({});
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
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <EditField label="Full Name">
            <input
              className={inputCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.fullName}
              onChange={set("fullName")}
              placeholder="Full name"
            />
            {errors?.fullName && <FieldError>{errors.fullName}</FieldError>}
          </EditField>

          <EditField label="Date of Birth">
            <input
              type="date"
              className={inputCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.dob}
              onChange={set("dob")}
            />
            {errors?.dob && <FieldError>{errors.dob}</FieldError>}
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
            {errors?.gender && <FieldError>{errors.gender}</FieldError>}
          </EditField>

          <EditField label="Phone">
            <input
              className={inputCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.phone}
              onChange={set("phone")}
              placeholder="Phone number"
            />
            {errors?.phone && <FieldError>{errors.phone}</FieldError>}
          </EditField>

          {/* Email */}
          <EditField label="Email">
            <div className="flex min-w-0 items-center gap-1.5 rounded-xl border border-[#2d4a3e]/08 bg-[#2d4a3e]/04 px-3 py-2">
              <Mail
                className="h-3.5 w-3.5 flex-shrink-0 text-[#2d4a3e]/25"
                strokeWidth={2}
              />
              <span
                className="min-w-0 truncate text-[0.88rem] text-[#2d4a3e]/40"
                style={{ fontFamily: "var(--font-dm-sans)" }}
                title={student.email ?? "Not provided"}
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
            {errors?.source && <FieldError>{errors.source}</FieldError>}
          </EditField>

          <EditField label="Shift">
            <select
              className={selectCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.shift}
              onChange={set("shift")}
            >
              <option value="morning">Morning</option>
              <option value="day">Day</option>
              <option value="evening">Evening</option>
            </select>
            {errors?.shift && <FieldError>{errors.shift}</FieldError>}
          </EditField>

          <EditField label="Shift Time">
            <input
              className={inputCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.shiftTime}
              onChange={set("shiftTime")}
              placeholder="e.g. 6:00 AM – 8:00 AM"
            />
            {errors?.shiftTime && <FieldError>{errors.shiftTime}</FieldError>}
          </EditField>

          <EditField label="Batch">
            <input
              className={inputCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.batch}
              onChange={set("batch")}
              placeholder="Batch name or number"
            />
            {errors?.batch && <FieldError>{errors.batch}</FieldError>}
          </EditField>

          {/* Address spans full width — typically longer text */}
          <EditField label="Address" className="lg:col-span-2">
            <input
              className={inputCls}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              value={form.address}
              onChange={set("address")}
              placeholder="Full address"
            />
            {errors?.address && <FieldError>{errors.address}</FieldError>}
          </EditField>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
          {/* Email: pass a truncate/title prop if InfoRow supports it, or wrap it */}
          <InfoRow
            label="Email"
            value={student.email ?? "Not provided"}
            icon={Mail}
            truncate={true}
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
          {/* Address spans full width in view mode too */}
          <InfoRow
            label="Address"
            value={student.address}
            icon={MapPin}
            className="lg:col-span-2"
          />
        </div>
      )}
    </SectionCard>
  );
}
