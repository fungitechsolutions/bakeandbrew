"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createLedgerEntry } from "./mock-data";
import type { BankAccount } from "./ledger";

const formSchema = z.object({
  bankAccountId: z.string().min(1, "Please select a bank account"),
  date: z.string().min(1, "Date is required"),
  bsDate: z
    .string()
    .min(1, "BS date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "BS date must be in YYYY-MM-DD format"),
  entryType: z.enum(["dr", "cr"], { error: "Entry type is required" }),
  amountRs: z
    .number({ error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  description: z.string().optional(),
});

type FormErrors = Partial<Record<keyof z.infer<typeof formSchema>, string>>;

interface CreateLedgerEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: BankAccount[];
  defaultAccountId?: string;
  onSuccess?: () => void;
}

export function CreateLedgerEntryForm({
  open,
  onOpenChange,
  accounts,
  defaultAccountId,
  onSuccess,
}: CreateLedgerEntryFormProps) {
  const [bankAccountId, setBankAccountId] = useState(defaultAccountId ?? "");
  const [date, setDate] = useState("");
  const [bsDate, setBsDate] = useState("");
  const [entryType, setEntryType] = useState<"dr" | "cr" | "">("");
  const [amountRs, setAmountRs] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultAccountId) setBankAccountId(defaultAccountId);
  }, [defaultAccountId]);

  function reset() {
    setBankAccountId(defaultAccountId ?? "");
    setDate("");
    setBsDate("");
    setEntryType("");
    setAmountRs("");
    setDescription("");
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = formSchema.safeParse({
      bankAccountId,
      date,
      bsDate,
      entryType: entryType || undefined,
      amountRs: amountRs === "" ? undefined : parseFloat(amountRs),
      description: description || undefined,
    });

    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await createLedgerEntry({
        bankAccountId: parsed.data.bankAccountId,
        date: new Date(parsed.data.date).toISOString(),
        bsDate: parsed.data.bsDate,
        entryType: parsed.data.entryType,
        amount: Math.round(parsed.data.amountRs * 100),
        description: parsed.data.description ?? null,
        paymentId: null,
      });
      toast.success("Entry created", {
        description: "The ledger entry has been recorded successfully.",
      });
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Failed to create entry", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const showAccountSelector = !defaultAccountId;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto px-6 py-6">
        <SheetHeader className="mb-8">
          <SheetTitle style={{ color: "var(--brand-ink)" }}>
            New Ledger Entry
          </SheetTitle>
          <SheetDescription>
            Record a manual debit or credit transaction against a bank account.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldSet>
            <FieldGroup className="gap-4">
              {showAccountSelector && (
                <Field>
                  <FieldLabel htmlFor="bankAccountId">Bank Account</FieldLabel>
                  <Select
                    value={bankAccountId}
                    onValueChange={(val) => setBankAccountId(val ?? "")}
                  >
                    <SelectTrigger id="bankAccountId">
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.bankName} — {a.accountName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bankAccountId && (
                    <FieldError>{errors.bankAccountId}</FieldError>
                  )}
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="date">Date (AD)</FieldLabel>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {errors.date && <FieldError>{errors.date}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="bsDate">BS Date</FieldLabel>
                <Input
                  id="bsDate"
                  placeholder="2081-01-15"
                  value={bsDate}
                  onChange={(e) => setBsDate(e.target.value)}
                />
                {errors.bsDate && <FieldError>{errors.bsDate}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="entryType">Entry Type</FieldLabel>
                <Select
                  value={entryType}
                  onValueChange={(val) => setEntryType(val as "dr" | "cr")}
                >
                  <SelectTrigger id="entryType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cr">Credit (CR)</SelectItem>
                    <SelectItem value="dr">Debit (DR)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.entryType && (
                  <FieldError>{errors.entryType}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="amountRs">Amount (Rs.)</FieldLabel>
                <Input
                  id="amountRs"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amountRs}
                  onChange={(e) => setAmountRs(e.target.value)}
                />
                {errors.amountRs && <FieldError>{errors.amountRs}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="description">
                  Description{" "}
                  <span
                    className="text-xs font-normal"
                    style={{ color: "#9ca3af" }}
                  >
                    (optional)
                  </span>
                </FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Add a note about this transaction..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && (
                  <FieldError>{errors.description}</FieldError>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 font-medium"
              disabled={isSubmitting}
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
