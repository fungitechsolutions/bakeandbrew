"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BSToAD } from "bikram-sambat-js";
import { SupplierForDropdown, CreateSupplierLedgerEntryInput } from "./types";

interface CreateSupplierLedgerEntryFormProps {
  open: boolean;
  loading: boolean;
  suppliers: SupplierForDropdown[];
  defaultSupplierId?: string;
  onOpenChange: (open: boolean) => void;
  createLedgerEntry: (data: CreateSupplierLedgerEntryInput) => Promise<void>;
}

const inputCls =
  "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function CreateSupplierLedgerEntryForm({
  open,
  loading,
  suppliers,
  defaultSupplierId,
  onOpenChange,
  createLedgerEntry,
}: CreateSupplierLedgerEntryFormProps) {
  const [supplierId, setSupplierId] = useState(defaultSupplierId ?? "");
  const [bsDate, setBsDate] = useState("");
  const [adDate, setAdDate] = useState("");
  const [entryType, setEntryType] = useState<"dr" | "cr" | "">("");
  const [amountRs, setAmountRs] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setSupplierId(defaultSupplierId ?? "");
    setBsDate("");
    setAdDate("");
    setEntryType("");
    setAmountRs("");
    setDescription("");
    setError("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || !bsDate || !adDate || !entryType || !amountRs) {
      setError("Please fill in all required fields.");
      return;
    }
    const amountPaisa = Math.round(parseFloat(amountRs) * 100);
    if (isNaN(amountPaisa) || amountPaisa <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setError("");
    await createLedgerEntry({
      supplierId,
      date: adDate,
      bsDate,
      entryType: entryType as "dr" | "cr",
      amount: amountPaisa,
      description: description.trim() || undefined,
    });
    resetForm();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto px-6 py-6">
        <SheetHeader className="mb-6">
          <SheetTitle style={{ color: "var(--brand-ink)" }}>
            New Supplier Entry
          </SheetTitle>
          <SheetDescription>
            Record a purchase (credit) or payment (debit) against a supplier.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!defaultSupplierId && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium">
                Supplier <span className="text-red-500">*</span>
              </Label>
              <Select
                value={supplierId}
                onValueChange={(v) => v && setSupplierId(v)}
              >
                <SelectTrigger className="h-9 text-sm w-full">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">
              Date (BS) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-[#2d4a3e]/40">
                <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <NepaliDatePicker
                inputClassName={cn(inputCls, "pl-9 rounded-none shadow-none")}
                value={bsDate}
                onChange={(v: string) => {
                  setBsDate(v);
                  try {
                    setAdDate(BSToAD(v));
                  } catch (err) {
                    toast.error(
                      err instanceof Error ? err.message : "Invalid date",
                    );
                  }
                }}
                options={{ calenderLocale: "en", valueLocale: "en" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">
              Entry Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={entryType}
              onValueChange={(v) => setEntryType(v as "dr" | "cr")}
            >
              <SelectTrigger className="h-9 text-sm w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cr">
                  Credit — Purchase / Payable added
                </SelectItem>
                <SelectItem value="dr">
                  Debit — Payment made to supplier
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">
              Amount (Rs.) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                style={{ color: "#9ca3af" }}
              >
                Rs.
              </span>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className="pl-10 h-9"
                value={amountRs}
                onChange={(e) => setAmountRs(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">
              Narration{" "}
              <span className="text-xs font-normal text-stone-400">
                (optional)
              </span>
            </Label>
            <Textarea
              placeholder="e.g. Payment for Invoice #1023"
              className="resize-none text-sm"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={loading}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
              style={{
                backgroundColor: "var(--brand-green)",
                color: "var(--brand-cream)",
              }}
            >
              {loading ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
