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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CreateCashLedgerEntryInput } from "@repo/types";
import { useForm } from "@tanstack/react-form-nextjs";
import { BSToAD } from "bikram-sambat-js";

interface CreateCashLedgerEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createLedgerEntry: (data: CreateCashLedgerEntryInput) => Promise<void>;
}

const inputCls =
  "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function CreateCashLedgerEntryForm({
  open,
  onOpenChange,
  createLedgerEntry,
}: CreateCashLedgerEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      bsDate: "",
      date: "", // AD ISO — set automatically from bsDate
      entryType: "" as "dr" | "cr" | "",
      amountRs: "", // user enters rupees, we convert to paisa
      description: "",
    },
    onSubmit: async ({ value }) => {
      if (!value.bsDate || !value.date || !value.entryType || !value.amountRs) {
        toast.error("Please fill in all required fields");
        return;
      }

      const amountPaisa = Math.round(parseFloat(value.amountRs) * 100);
      if (isNaN(amountPaisa) || amountPaisa <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      setIsSubmitting(true);
      try {
        await createLedgerEntry({
          bsDate: value.bsDate,
          date: value.date,
          entryType: value.entryType as "dr" | "cr",
          amount: String(amountPaisa),
          description: value.description || undefined,
        });
        toast.success("Cash entry created successfully");
        form.reset();
        onOpenChange(false);
      } catch {
        toast.error("Failed to create entry. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto px-6 py-6">
        <SheetHeader className="mb-6">
          <SheetTitle style={{ color: "var(--brand-ink)" }}>
            New Cash Entry
          </SheetTitle>
          <SheetDescription>
            Record a cash debit or credit transaction.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className="space-y-5"
        >
          {/* BS Date */}
          <form.Field name="bsDate">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium">
                  Date (BS) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-[#2d4a3e]/40">
                    <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <NepaliDatePicker
                    inputClassName={cn(inputCls, "pl-9")}
                    value={field.state.value}
                    onChange={(bsValue: string) => {
                      field.handleChange(bsValue);
                      try {
                        const adValue = BSToAD(bsValue);
                        form.setFieldValue("date", adValue);
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
            )}
          </form.Field>

          {/* Entry Type */}
          <form.Field name="entryType">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium">
                  Entry Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v as "dr" | "cr")}
                >
                  <SelectTrigger className="h-9 text-sm w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cr">Credit (Cash In)</SelectItem>
                    <SelectItem value="dr">Debit (Cash Out)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          {/* Amount */}
          <form.Field name="amountRs">
            {(field) => (
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
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              </div>
            )}
          </form.Field>

          {/* Description */}
          <form.Field name="description">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium">
                  Narration{" "}
                  <span
                    className="text-xs font-normal"
                    style={{ color: "#9ca3af" }}
                  >
                    (optional)
                  </span>
                </Label>
                <Textarea
                  placeholder="Describe this transaction..."
                  className="resize-none text-sm"
                  rows={3}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                form.reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 gap-2"
              style={{
                backgroundColor: "var(--brand-green)",
                color: "var(--brand-cream)",
              }}
            >
              {isSubmitting ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
