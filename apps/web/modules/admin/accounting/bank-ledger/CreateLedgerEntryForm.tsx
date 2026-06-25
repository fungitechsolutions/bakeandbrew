"use client";

import { useEffect, useState } from "react";
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
import {
  BankAccountForDropdown,
  CreateBankLedgerEntryInput,
  createBankLedgerEntrySchema,
} from "@repo/types";
import { CalendarDays } from "lucide-react";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { cn } from "@/lib/utils";
import { BSToAD } from "bikram-sambat-js";
import "nepali-datepicker-reactjs/dist/index.css";
import { useForm } from "@tanstack/react-form-nextjs";
import { AxiosError } from "axios";
import { APIError } from "@repo/types";

import { mapFieldErrors } from "@/utils/api";

interface CreateLedgerEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: BankAccountForDropdown[];
  defaultAccountId?: string;
  createLedgerEntry: (
    data: CreateBankLedgerEntryInput & { accountID: string },
  ) => void;
}

const inputCls =
  "w-full rounded-xl border border-[#2d4a3e]/15 bg-[#f4f1ec]/60 px-3 py-2 text-[0.88rem] font-medium text-[#2d4a3e] outline-none placeholder:text-[#2d4a3e]/25 transition-colors focus:border-[#2d4a3e]/40 focus:ring-2 focus:ring-[#2d4a3e]/08";

export function CreateLedgerEntryForm({
  open,
  onOpenChange,
  accounts,
  defaultAccountId,
  createLedgerEntry,
}: CreateLedgerEntryFormProps) {
  const [bankAccountId, setBankAccountId] = useState(defaultAccountId ?? "");

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateBankLedgerEntryInput, string>>
  >({});

  useEffect(() => {
    if (defaultAccountId) {
      setTimeout(() => {
        setBankAccountId(defaultAccountId);
      }, 0);
    }
  }, [defaultAccountId]);

  const form = useForm({
    defaultValues: {
      date: "",
      bsDate: "",
      entryType: "" as "cr" | "dr" | "",
      amount: "",
      description: "",
    },
    validators: {
      onSubmit: createBankLedgerEntrySchema,
    },

    onSubmit: async ({ value, formApi }) => {
      try {
        await createLedgerEntry({
          accountID: bankAccountId,
          ...value,
          entryType: value.entryType as "cr" | "dr",
        });
        formApi.reset();
        reset();
        onOpenChange(false);
      } catch (err) {
        const error = err as AxiosError<APIError>;
        const data = error.response?.data;
        if (data?.errors?.length) {
          setErrors(mapFieldErrors(data));
        }
      }
    },
  });

  function reset() {
    setBankAccountId(defaultAccountId ?? "");
    setErrors({});
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
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
                      <SelectValue placeholder="Select an account">
                        {
                          accounts.find((a) => a.id === bankAccountId)
                            ?.accountName
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.bankName} — {a.accountName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* {errors.bankAccountId && (
                    <FieldError>{errors.bankAccountId}</FieldError>
                  )} */}
                </Field>
              )}

              <form.Field name="date">
                {(field) => {
                  const fieldError = field.state.meta.errors[0]?.message;
                  const mergedError = fieldError ?? errors.date;
                  return (
                    <Field>
                      <FieldLabel htmlFor="date">Date (AD)</FieldLabel>
                      <Input
                        id="date"
                        type="date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {mergedError && <FieldError>{mergedError}</FieldError>}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="bsDate">
                {(field) => {
                  const fieldError = field.state.meta.errors[0]?.message;
                  const mergedError = fieldError ?? errors.bsDate;

                  return (
                    <Field>
                      <FieldLabel htmlFor="bsDate">BS Date</FieldLabel>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-[#2d4a3e]/40">
                          <CalendarDays
                            className="h-4 w-4"
                            strokeWidth={1.75}
                          />
                        </span>
                        <NepaliDatePicker
                          inputClassName={cn(
                            inputCls,
                            "pl-9 rounded-none",

                            mergedError && "border-red-400 ring-2 ring-red-100",
                          )}
                          value={field.state.value}
                          onChange={(bsValue: string) => {
                            field.handleChange(bsValue);
                            try {
                              const adValue = BSToAD(bsValue);
                              console.log("ad value: ", adValue);
                              form.setFieldValue("date", adValue);
                            } catch (err) {
                              console.log("err: ", err);
                              toast.error(
                                err instanceof Error
                                  ? err.message
                                  : "Something went wrong while setting date",
                              );
                            }
                          }}
                          options={{ calenderLocale: "en", valueLocale: "en" }}
                        />
                      </div>
                      {mergedError && <FieldError>{mergedError}</FieldError>}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="entryType">
                {(field) => {
                  const fieldError = field.state.meta.errors[0]?.message;
                  const mergedError = fieldError ?? errors.entryType;

                  return (
                    <Field>
                      <FieldLabel htmlFor="entryType">Entry Type</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(val) =>
                          field.handleChange(val as "cr" | "dr")
                        }
                      >
                        <SelectTrigger id="entryType">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cr">Credit (CR)</SelectItem>
                          <SelectItem value="dr">Debit (DR)</SelectItem>
                        </SelectContent>
                      </Select>
                      {mergedError && <FieldError>{mergedError}</FieldError>}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="amount">
                {(field) => {
                  const fieldError = field.state.meta.errors[0]?.message;
                  const mergedError = fieldError ?? errors.amount;
                  return (
                    <Field>
                      <FieldLabel htmlFor="amountRs">Amount (Rs.)</FieldLabel>
                      <Input
                        id="amountRs"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {mergedError && <FieldError>{mergedError}</FieldError>}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="description">
                {(field) => {
                  const fieldError = field.state.meta.errors[0]?.message;
                  const mergedError = fieldError ?? errors.description;
                  return (
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
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {mergedError && <FieldError>{mergedError}</FieldError>}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </FieldSet>

          <form.Subscribe
            selector={(formState) => [
              formState.isSubmitting,
              formState.canSubmit,
            ]}
          >
            {([isSubmitting, canSubmit]) => (
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={isSubmitting}
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 font-medium"
                  disabled={!canSubmit || isSubmitting}
                  style={{
                    backgroundColor: "var(--brand-green)",
                    color: "var(--brand-cream)",
                  }}
                >
                  {isSubmitting ? "Saving..." : "Save Entry"}
                </Button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </SheetContent>
    </Sheet>
  );
}
