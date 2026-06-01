"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays } from "lucide-react";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { cn } from "@/lib/utils";
import {
  CreateStockOutInput,
  CreateStockOutResponse,
  createStockOutSchema,
  GetProductResponse,
  ListStockOutResponse,
} from "@repo/types";
import { useEffect, useMemo, useState } from "react";
import { mapFieldErrors } from "@/utils/api";
import { toast } from "sonner";

type StockOut = Extract<
  ListStockOutResponse,
  { success: true }
>["data"][number];
type BackendError = Extract<CreateStockOutResponse, { success: false }>;
type StockOutFormData = Omit<
  StockOut,
  "id" | "createdAt" | "productName" | "productUnit" | "updatedAt" | "qty"
> & {
  quantity: number;
};
type Product = Extract<GetProductResponse, { success: true }>["data"][number];

type Props = {
  open: boolean;
  products: Product[];
  onClose: () => void;
  onSubmit: (data: StockOutFormData) => Promise<void> | void;
  initialData?: StockOut | null;
  stockOut?: StockOut[];
};

const inputCls =
  "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

const EMPTY_FORM = {
  billNo: "",
  note: "",
  productID: "",
  quantity: "1",
  rate: "",
  date: "",
};

export function StockOutDialog({
  open,
  onClose,
  onSubmit,
  products,
  initialData,
}: Props) {
  const isEdit = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] =
    useState<Partial<Record<keyof CreateStockOutInput, string>>>();

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      if (initialData) {
        setFormData({
          billNo: initialData.billNo ?? "",
          note: initialData.note ?? "",
          productID: initialData.productID ?? "",
          quantity: initialData.qty.toString(),
          rate: (initialData.rate / 100).toString(),
          date: initialData.date ?? "",
        });
      } else {
        setFormData(EMPTY_FORM);
      }
      setErrors({});
    }, 0);
    return () => clearTimeout(id);
  }, [initialData, open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFormData(EMPTY_FORM);
      setErrors({});
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: CreateStockOutInput = {
      ...formData,
      quantity: Number(formData.quantity),
      rate: Number(formData.rate),
      note: formData.note || undefined,
      billNo: formData.billNo || undefined,
    };

    const validateFields = createStockOutSchema.safeParse(payload);
    if (!validateFields.success) {
      setIsSubmitting(false);
      const fieldErrors = validateFields.error.flatten().fieldErrors;
      setErrors({
        note: fieldErrors.note?.[0],
        quantity: fieldErrors.quantity?.[0],
        productID: fieldErrors.productID?.[0],
        rate: fieldErrors.rate?.[0],
        billNo: fieldErrors.billNo?.[0],
        date: fieldErrors.date?.[0],
      });
      return;
    }

    try {
      await onSubmit({ ...validateFields.data, quantity: payload.quantity });
      setFormData(EMPTY_FORM);
      setErrors({});
      onClose();
    } catch (err) {
      const error = err as BackendError;
      toast.error(error?.message ?? "Something went wrong");
      if (error?.errors?.length) {
        setErrors(mapFieldErrors(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProduct = useMemo(() => {
    if (!formData.productID) return undefined;
    return products.find((p) => p.id === formData.productID);
  }, [products, formData.productID]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto px-6 py-6">
        <SheetHeader className="mb-6">
          <SheetTitle
            className="font-[family-name:var(--font-playfair)] text-xl"
            style={{ color: "var(--brand-ink)" }}
          >
            {isEdit ? "Edit Stock Out" : "Add Stock Out"}
          </SheetTitle>
          <SheetDescription className="font-[family-name:var(--font-dm-sans)]">
            {isEdit
              ? "Update an existing stock-out record."
              : "Record inventory issued or sold."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="font-[family-name:var(--font-dm-sans)] text-[var(--brand-ink)]">
              Product <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.productID}
              onValueChange={(v) =>
                setFormData((prev) => ({ ...prev, productID: v ?? "" }))
              }
            >
              <SelectTrigger className="w-full border-[var(--brand-green)]/30 focus:ring-[var(--brand-green)]">
                <SelectValue placeholder="Select product">
                  {selectedProduct?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.productID && (
              <p className="text-xs text-red-500">{errors.productID}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="font-[family-name:var(--font-dm-sans)] text-[var(--brand-ink)]">
              Date (BS) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-[#2d4a3e]/40">
                <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <NepaliDatePicker
                inputClassName={cn(
                  inputCls,
                  "pl-9 border-[var(--brand-green)]/30 rounded-none shadow-none",
                )}
                value={formData.date}
                onChange={(v: string) =>
                  setFormData((prev) => ({ ...prev, date: v }))
                }
                options={{ calenderLocale: "en", valueLocale: "en" }}
              />
            </div>
            {errors?.date && (
              <p className="text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="font-[family-name:var(--font-dm-sans)] text-[var(--brand-ink)]">
              Bill No{" "}
              <span className="text-[var(--brand-brown)] text-xs">
                (optional)
              </span>
            </Label>
            <Input
              placeholder="BILL-001"
              value={formData.billNo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, billNo: e.target.value }))
              }
              className="border-[var(--brand-green)]/30 focus-visible:ring-[var(--brand-green)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-[family-name:var(--font-dm-sans)] text-[var(--brand-ink)]">
                Qty <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quantity: e.target.value }))
                }
                className="border-[var(--brand-green)]/30 focus-visible:ring-[var(--brand-green)]"
              />
              {errors?.quantity && (
                <p className="text-xs text-red-500">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="font-[family-name:var(--font-dm-sans)] text-[var(--brand-ink)]">
                Rate (Rs.) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                value={formData.rate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, rate: e.target.value }))
                }
                className="border-[var(--brand-green)]/30 focus-visible:ring-[var(--brand-green)]"
              />
              {errors?.rate && (
                <p className="text-xs text-red-500">{errors.rate}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-[family-name:var(--font-dm-sans)] text-[var(--brand-ink)]">
              Note{" "}
              <span className="text-[var(--brand-brown)] text-xs">
                (optional)
              </span>
            </Label>
            <textarea
              value={formData.note}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, note: e.target.value }))
              }
              rows={2}
              className="w-full rounded-md border border-[var(--brand-green)]/30 bg-white px-3 py-2 text-sm font-[family-name:var(--font-dm-sans)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-green)]"
              placeholder="Optional note..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-[var(--brand-green)]/30 text-[var(--brand-ink)]"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[var(--brand-green)] hover:bg-[var(--brand-green-2)] text-white font-[family-name:var(--font-dm-sans)]"
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
