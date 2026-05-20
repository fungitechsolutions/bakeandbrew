"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Status } from "./StudentDetail";
import { updateStudentStatusSchema } from "@repo/types";
import z from "zod";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatusMeta {
  label: string;
  classes: string;
  dotClass: string;
  ringClass: string;
}

interface StatusEditorProps {
  current: Status;
  onUpdate: (next: Status, rejectionReason?: string) => Promise<void> | void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_META: Record<Status, StatusMeta> = {
  pending: {
    label: "Pending",
    classes: "text-amber-700",
    dotClass: "bg-amber-400",
    ringClass: "ring-amber-300",
  },
  active: {
    label: "Active",
    classes: "text-green-700",
    dotClass: "bg-green-400",
    ringClass: "ring-green-300",
  },
  completed: {
    label: "Completed",
    classes: "text-blue-700",
    dotClass: "bg-blue-400",
    ringClass: "ring-blue-300",
  },
  rejected: {
    label: "Rejected",
    classes: "text-red-700",
    dotClass: "bg-red-400",
    ringClass: "ring-red-300",
  },
};

const ALL_STATUSES = Object.keys(STATUS_META) as Status[];

// ─── Component ────────────────────────────────────────────────────────────────

export function StatusEditor({ current, onUpdate }: StatusEditorProps) {
  const [selected, setSelected] = useState<Status>(current);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const isDirty = selected !== current;
  const isRejected = selected === "rejected";
  // Prevent update if rejected but no reason given
  const isUpdateDisabled =
    loading || (isRejected && rejectionReason.trim() === "");

  const handleUpdate = async () => {
    setLoading(true);

    const validateFields = updateStudentStatusSchema.safeParse({
      status: selected,
      rejectionReason,
    });
    if (!validateFields.success) {
      setLoading(false);
      const tree = z.treeifyError(validateFields.error).properties;
      const statusError = tree?.status?.errors[0];
      const rejectionReasonError = tree?.rejectionReason?.errors[0];
      toast.error(
        statusError
          ? statusError
          : rejectionReasonError
            ? rejectionReasonError
            : "Something went wrong",
      );

      return;
    }
    try {
      await onUpdate(selected, isRejected ? rejectionReason.trim() : undefined);
      // Reset reason after successful update
      if (!isRejected) setRejectionReason("");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStatus = (s: Status) => {
    setSelected(s);
    // Clear reason if switching away from rejected
    if (s !== "rejected") setRejectionReason("");
  };

  return (
    <div className="flex flex-col gap-3">
      {/* ── Pill radio buttons ── */}
      <div className="flex flex-wrap items-center gap-2">
        {ALL_STATUSES.map((s) => {
          const meta = STATUS_META[s];
          const isSelected = selected === s;
          const isCurrent = s === current;

          return (
            <button
              key={s}
              onClick={() => handleSelectStatus(s)}
              className={`
                inline-flex items-center gap-1.5 rounded-full border px-3 py-1
                text-[0.75rem] font-semibold transition-all
                ${meta.classes}
              `}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {/* Checkbox indicator */}
              <span
                className={`
                  flex h-3.5 w-3.5 items-center justify-center rounded-full border
                  ${isSelected ? `${meta.dotClass} border-transparent` : "border-current bg-transparent"}
                `}
              >
                {isSelected && (
                  <svg viewBox="0 0 10 10" className="h-2 w-2 fill-white">
                    <path
                      d="M1.5 5 L4 7.5 L8.5 2.5"
                      stroke="white"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>

              {/* Current status dot */}
              {isCurrent && !isDirty && (
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
              )}

              {meta.label}
            </button>
          );
        })}

        {/* ── Update button — slides in when dirty and not rejected (rejected shows below) ── */}
        <div
          className={`overflow-hidden transition-all duration-200 ${
            isDirty && !isRejected
              ? "max-w-40 opacity-100"
              : "max-w-0 opacity-0"
          }`}
        >
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="ml-1 inline-flex items-center gap-1.5 rounded-xl bg-[#2d4a3e] px-3 py-1.5
                       text-[0.78rem] font-semibold text-white whitespace-nowrap
                       transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(45,74,62,0.25)]
                       disabled:cursor-not-allowed disabled:opacity-60"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {loading ? (
              <svg
                className="h-3 w-3 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
            )}
            Update Status
          </button>
        </div>
      </div>

      {/* ── Rejection reason input — only when rejected is selected and dirty ── */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isDirty && isRejected ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2 pt-1">
          <label
            htmlFor="rejection-reason"
            className="font-dm-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-red-600/70"
          >
            Rejection reason{" "}
            <span className="normal-case tracking-normal text-red-400">
              (required)
            </span>
          </label>

          <textarea
            id="rejection-reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Incomplete documentation, did not meet minimum requirements…"
            rows={3}
            className="w-full resize-none rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2.5
                       font-dm-sans text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30
                       outline-none transition-all duration-150
                       focus:border-red-300 focus:ring-2 focus:ring-red-200/60"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          />

          {/* Confirm button sits below the textarea for rejected */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdateDisabled}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5
                         font-dm-sans text-[0.78rem] font-semibold text-white whitespace-nowrap
                         transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-[0_4px_16px_rgba(220,38,38,0.25)]
                         disabled:cursor-not-allowed disabled:opacity-50"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {loading ? (
                <svg
                  className="h-3 w-3 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : (
                <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
              )}
              Confirm Rejection
            </button>

            <p className="font-dm-sans text-[11px] text-[#1a1a1a]/35">
              This reason will be shown to the student.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
