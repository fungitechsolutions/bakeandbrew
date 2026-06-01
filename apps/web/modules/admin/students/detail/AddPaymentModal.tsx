"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { mapFieldErrors } from "@/utils/api";
import { APIResponse } from "@repo/types";
import { AxiosError } from "axios";
import { ADToBS } from "bikram-sambat-js";
import {
  AlertCircle,
  Banknote,
  Building2,
  CreditCard,
  Plus,
  Smartphone,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const modalSchema = z.object({
  amount: z.number().gt(0, {
    error: "Amount must be greater than 0",
  }),
  remarks: z
    .string()
    .min(3)
    .max(100, {
      error: "Remarks must be less than 100 characters",
    })
    .optional(),
  paymentMode: z.string().min(2).max(60, {
    error: "Payment mode must be less than 60 characters",
  }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    error: "AD date must be in YYYY-MM-DD format",
  }),
  bsDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    error: "BS date must be in YYYY-MM-DD format",
  }),
});
type AddPaymentModal = z.infer<typeof modalSchema>;

type AddPaymentModalErrors = {
  amount?: string;
  remarks?: string;
  paymentMode?: string;
  date?: string;
  bsDate?: string;
};

export function AddPaymentModal({
  onClose,
  onAdd,
  isAdding,
}: {
  onClose: () => void;
  onAdd: (data: AddPaymentModal) => void;
  isAdding: boolean;
}) {
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [error, setError] = useState<AddPaymentModalErrors>({});
  const [isAddingNewMode, setIsAddingNewMode] = useState(false);
  const [newModeInput, setNewModeInput] = useState("");
  const [paymentModes, setPaymentModes] = useState([
    { value: "cash", label: "Cash", icon: Banknote },
    { value: "esewa", label: "eSewa", icon: Smartphone },
    { value: "fonepay", label: "FonePay", icon: Smartphone },
    { value: "bank", label: "Bank Transfer", icon: Building2 },
  ]);

  const handleSubmit = async () => {
    const date = new Date().toISOString().split("T")[0];
    const bsDate = ADToBS(date);
    const result = modalSchema.safeParse({
      amount: Number(amount),
      remarks: remarks || undefined,
      paymentMode: paymentMode || undefined,
      date: date,
      bsDate: bsDate,
    });

    if (!result.success) {
      const tree = z.treeifyError(result.error).properties;
      setError({
        amount: tree?.amount?.errors[0],
        remarks: tree?.remarks?.errors[0],
        paymentMode: tree?.paymentMode?.errors[0],
        date: tree?.date?.errors[0],
        bsDate: tree?.bsDate?.errors[0],
      });
      return;
    }
    try {
      await onAdd(result.data);
      onClose();
    } catch (err) {
      const error = err as AxiosError<APIResponse>;
      const data = error.response?.data;
      if (data?.errors?.length) {
        toast.error(data.errors[0].message);
        setError(mapFieldErrors(data));
      } else {
        toast.error(data?.message);
      }
    }
  };

  const handleAddNewMode = () => {
    const trimmed = newModeInput.trim();
    if (!trimmed) return;
    const newEntry = {
      value: trimmed.toLowerCase().replace(/\s+/g, "_"),
      label: trimmed,
      icon: CreditCard,
    };
    setPaymentModes((prev) => [...prev, newEntry]);
    setPaymentMode(newEntry.value);
    setIsAddingNewMode(false);
    setNewModeInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-black/[0.06] bg-white p-6 shadow-2xl">
        {/* ── Header ── */}
        <div className="mb-5 flex items-center justify-between">
          <h3
            className="text-[1.1rem] font-semibold text-[#2d4a3e]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Add Payment
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#2d4a3e]/08"
          >
            <X className="h-4 w-4 text-[#2d4a3e]/50" strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* ── Amount ── */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[0.78rem] font-semibold uppercase tracking-[0.07em] text-[#2d4a3e]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Amount (NPR) <span className="text-[#e8552a]">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2d4a3e]/40">
                <CreditCard className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <input
                type="number"
                min="1"
                placeholder="e.g. 5000"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError({});
                }}
                className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-[0.92rem] text-[#2d4a3e] outline-none transition-all placeholder:text-[#2d4a3e]/30 focus:border-[#e8552a] focus:ring-2 focus:ring-[#e8552a]/15 ${
                  error.amount
                    ? "border-red-400 ring-2 ring-red-100"
                    : "border-[#2d4a3e]/15"
                }`}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
            </div>
            {error.amount && (
              <p
                className="flex items-center gap-1.5 text-[0.78rem] text-red-500"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                <AlertCircle className="h-3.5 w-3.5" /> {error.amount}
              </p>
            )}
          </div>

          {/* ── Payment Mode ── */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[0.78rem] font-semibold uppercase tracking-[0.07em] text-[#2d4a3e]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Payment Mode
            </label>

            <Select
              value={paymentMode}
              onValueChange={(val) => {
                if (val === "__add_new__") {
                  setIsAddingNewMode(true);
                } else {
                  setPaymentMode(val as string);
                  setIsAddingNewMode(false);
                }
              }}
            >
              <SelectTrigger
                className={`w-full rounded-xl border bg-white py-3 px-4 h-12 text-[0.92rem] text-[#2d4a3e] outline-none transition-all focus:border-[#e8552a] focus:ring-2 focus:ring-[#e8552a]/15 ${
                  error.paymentMode
                    ? "border-red-400 ring-2 ring-red-100"
                    : "border-[#2d4a3e]/15"
                }`}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-[#2d4a3e]/10 shadow-lg">
                {paymentModes.map((mode) => (
                  <SelectItem
                    key={mode.value}
                    value={mode.value}
                    className="text-[0.92rem] text-[#2d4a3e] cursor-pointer focus:bg-[#e8552a]/8 focus:text-[#e8552a] rounded-lg"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    <span className="flex items-center gap-2">
                      <mode.icon className="h-4 w-4 text-[#2d4a3e]/50" />
                      <span>{mode.label}</span>
                    </span>
                  </SelectItem>
                ))}
                <SelectSeparator className="my-1 bg-[#2d4a3e]/10" />
                <SelectItem
                  value="__add_new__"
                  className="text-[0.92rem] text-[#e8552a] font-medium cursor-pointer focus:bg-[#e8552a]/8 rounded-lg"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  <span className="flex items-center gap-2">
                    <Plus className="h-3.5 w-3.5" />
                    Add new payment mode
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Inline "add new" input that appears when user picks "+ Add new" */}
            {isAddingNewMode && (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Khalti, Bank Transfer…"
                  value={newModeInput}
                  onChange={(e) => setNewModeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddNewMode();
                    if (e.key === "Escape") {
                      setIsAddingNewMode(false);
                      setNewModeInput("");
                    }
                  }}
                  className="flex-1 rounded-xl border border-[#2d4a3e]/15 bg-white py-2.5 px-4 text-[0.92rem] text-[#2d4a3e] outline-none transition-all placeholder:text-[#2d4a3e]/30 focus:border-[#e8552a] focus:ring-2 focus:ring-[#e8552a]/15"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                />
                <button
                  type="button"
                  onClick={handleAddNewMode}
                  className="rounded-xl bg-[#e8552a] px-4 py-2.5 text-[0.85rem] font-semibold text-white transition-all hover:bg-[#d14b23] active:scale-95"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNewMode(false);
                    setNewModeInput("");
                  }}
                  className="rounded-xl border border-[#2d4a3e]/15 px-3 py-2.5 text-[0.85rem] text-[#2d4a3e]/50 transition-all hover:border-[#2d4a3e]/30 hover:text-[#2d4a3e]"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {error.paymentMode && (
              <p
                className="flex items-center gap-1.5 text-[0.78rem] text-red-500"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                <AlertCircle className="h-3.5 w-3.5" /> {error.paymentMode}
              </p>
            )}
          </div>
          {/* ── Remarks ── */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[0.78rem] font-semibold uppercase tracking-[0.07em] text-[#2d4a3e]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Remarks{" "}
              <span className="font-normal normal-case text-[#2d4a3e]/40">
                (optional)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Second installment"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className={`w-full rounded-xl border bg-white py-3 px-4 text-[0.92rem] text-[#2d4a3e] outline-none transition-all placeholder:text-[#2d4a3e]/30 focus:border-[#e8552a] focus:ring-2 focus:ring-[#e8552a]/15 ${
                error.remarks
                  ? "border-red-400 ring-2 ring-red-100"
                  : "border-[#2d4a3e]/15"
              }`}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            />
            {error.remarks && (
              <p
                className="flex items-center gap-1.5 text-[0.78rem] text-red-500"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                <AlertCircle className="h-3.5 w-3.5" /> {error.remarks}
              </p>
            )}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isAdding}
            className={`flex-1 rounded-xl border border-[#2d4a3e]/15 py-3 text-[0.9rem] font-medium text-[#2d4a3e] transition-all hover:bg-[#2d4a3e]/05 ${
              isAdding ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 rounded-xl bg-[#2d4a3e] py-3 text-[0.9rem] font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(45,74,62,0.25)] ${
              isAdding ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{ fontFamily: "var(--font-dm-sans)" }}
            disabled={isAdding}
          >
            {isAdding ? (
              <div className="flex items-center justify-center gap-2 text-[0.9rem] font-semibold text-white">
                <Spinner />
                Adding...
              </div>
            ) : (
              "Add Payment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
