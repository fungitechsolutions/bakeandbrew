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
import { BSToAD } from "bikram-sambat-js";
import { cn } from "@/lib/utils";

import {
  CreateStockInInput,
  CreateStockInResponse,
  createStockInSchema,
  GetProductResponse,
  ListStockInResponse,
  updateStockInSchema,
} from "@repo/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { mapFieldErrors } from "@/utils/api";
import { useSuppliers } from "@/hooks/queries/admin/suppliers/useSuppliers";
import Link from "next/link";

type StockIn = Extract<ListStockInResponse, { success: true }>["data"][number];
type BackendError = Extract<CreateStockInResponse, { success: false }>;

type StockInFormData = Omit<
  StockIn,
  "id" | "createdAt" | "productName" | "productUnit" | "updatedAt" | "qty"
> & {
  quantity: number;
  supplierID?: string;
  bsDate?: string;
};

type Product = Extract<GetProductResponse, { success: true }>["data"][number];

type Props = {
  open: boolean;
  onClose: () => void;
  products: Product[];
  onSubmit: (data: StockInFormData) => Promise<void>;
  initialData?: StockIn | null;
};

const inputCls =
  "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

const emptyForm = {
  invoiceNo: "",
  note: "",
  productID: "",
  supplierID: "",
  quantity: "1",
  rate: "",
  bsDate: "",
  adDate: "",
  date: "",
};

export function StockInDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  products,
}: Props) {
  const isEdit = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] =
    useState<
      Partial<
        Record<
          keyof CreateStockInInput | "quantity" | "supplierID" | "bsDate",
          string
        >
      >
    >();

  const { data: suppliersData, isPending: suppliersLoading } = useSuppliers(1);
  const suppliers = suppliersData?.suppliers ?? [];

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      if (initialData) {
        setFormData({
          invoiceNo: initialData.invoiceNo ?? "",
          note: initialData.note ?? "",
          productID: initialData.productID ?? "",
          supplierID: "",
          quantity: initialData.qty.toString(),
          rate: (initialData.rate / 100).toString(),
          bsDate: "",
          adDate: "",
          date: initialData.date ?? "",
        });
      } else {
        setFormData(emptyForm);
      }
      setErrors({});
    }, 0);
    return () => clearTimeout(id);
  }, [initialData, open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFormData(emptyForm);
      setErrors({});
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const base = {
      productID: formData.productID,
      quantity: Number(formData.quantity),
      rate: Number(formData.rate),
      note: formData.note || undefined,
      invoiceNo: formData.invoiceNo || undefined,
    };

    if (isEdit) {
      const validateFields = updateStockInSchema.safeParse({
        ...base,
        date: formData.date,
      });
      if (!validateFields.success) {
        setIsSubmitting(false);
        const fieldErrors = validateFields.error.flatten().fieldErrors;
        setErrors({
          note: fieldErrors.note?.[0],
          quantity: fieldErrors.quantity?.[0],
          productID: fieldErrors.productID?.[0],
          rate: fieldErrors.rate?.[0],
          invoiceNo: fieldErrors.invoiceNo?.[0],
          date: fieldErrors.date?.[0],
        });
        return;
      }
      try {
        await onSubmit({ ...validateFields.data, quantity: base.quantity });
        setFormData(emptyForm);
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
      return;
    }

    const validateFields = createStockInSchema.safeParse({
      ...base,
      supplierID: formData.supplierID,
      bsDate: formData.bsDate,
      date: formData.adDate,
    });
    if (!validateFields.success) {
      setIsSubmitting(false);
      const fieldErrors = validateFields.error.flatten().fieldErrors;
      setErrors({
        note: fieldErrors.note?.[0],
        quantity: fieldErrors.quantity?.[0],
        productID: fieldErrors.productID?.[0],
        rate: fieldErrors.rate?.[0],
        invoiceNo: fieldErrors.invoiceNo?.[0],
        date: fieldErrors.date?.[0],
        bsDate: fieldErrors.bsDate?.[0],
        supplierID: fieldErrors.supplierID?.[0],
      });
      return;
    }

    try {
      await onSubmit({
        ...validateFields.data,
        quantity: base.quantity,
      });
      setFormData(emptyForm);
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
    if (!products || !formData.productID) return undefined;
    return products.find((p) => p.id === formData.productID);
  }, [products, formData.productID]);

  const selectedSupplier = useMemo(
    () => suppliers.find((s) => s.id === formData.supplierID),
    [suppliers, formData.supplierID],
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto px-6 py-6">
        <SheetHeader className="mb-6">
          <SheetTitle
            className="font-[family-name:var(--font-playfair)] text-xl"
            style={{ color: "var(--brand-ink)" }}
          >
            {isEdit ? "Edit Stock In" : "Add Stock In"}
          </SheetTitle>
          <SheetDescription className="font-[family-name:var(--font-dm-sans)]">
            {isEdit
              ? "Update an existing stock-in record."
              : "Record incoming inventory and link it to a supplier."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product */}
          <div className="space-y-1.5">
            <Label className="font-[family-name:var(--font-dm-sans)] text-[var(--brand-ink)]">
              Product <span className="text-red-500">*</span>
            </Label>
            {products.length === 0 ? (
              <div className="flex">
                <p className="text-xs text-slate-500">
                  No products found. Please{" "}
                  <Link
                    href="/admin/inventory/products"
                    className="text-blue-500 hover:text-blue-600 hover:underline"
                  >
                    create a product
                  </Link>{" "}
                  first.
                </p>
              </div>
            ) : (
              <>
                <Select
                  value={formData.productID}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, productID: v ?? "" }))
                  }
                >
                  <SelectTrigger className="border-[var(--brand-green)]/30 focus:ring-[var(--brand-green)] w-full">
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
              </>
            )}
          </div>

          {/* Supplier — create only */}
          {!isEdit && (
            <div className="space-y-1.5">
              <Label className="font-[family-name:var(--font-dm-sans)] text-[var(--brand-ink)]">
                Supplier <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.supplierID}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, supplierID: v ?? "" }))
                }
                disabled={suppliersLoading}
              >
                <SelectTrigger className="border-[var(--brand-green)]/30 focus:ring-[var(--brand-green)] w-full">
                  <SelectValue
                    placeholder={
                      suppliersLoading
                        ? "Loading suppliers…"
                        : "Select supplier"
                    }
                  >
                    {selectedSupplier?.companyName}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.supplierID && (
                <p className="text-xs text-red-500">{errors.supplierID}</p>
              )}
            </div>
          )}

          {/* Date */}
          <div className="space-y-1.5">
            <Label className="font-[family-name:var(--font-dm-sans)] text-[var(--brand-ink)]">
              Date (BS) <span className="text-red-500">*</span>
            </Label>
            {isEdit ? (
              <Input
                placeholder="2081-01-15"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="border-[var(--brand-green)]/30 focus-visible:ring-[var(--brand-green)]"
              />
            ) : (
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-[#2d4a3e]/40">
                  <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <NepaliDatePicker
                  inputClassName={cn(inputCls, "pl-9 rounded-none shadow-none")}
                  value={formData.bsDate}
                  onChange={(v: string) => {
                    try {
                      setFormData((prev) => ({
                        ...prev,
                        bsDate: v,
                        adDate: BSToAD(v),
                      }));
                    } catch (err) {
                      toast.error(
                        err instanceof Error ? err.message : "Invalid date",
                      );
                    }
                  }}
                  options={{ calenderLocale: "en", valueLocale: "en" }}
                />
              </div>
            )}
            {(errors?.date || errors?.bsDate) && (
              <p className="text-xs text-red-500">
                {errors.bsDate ?? errors.date}
              </p>
            )}
          </div>

          {/* Invoice No */}
          <div className="space-y-1.5">
            <Label className="font-[family-name:var(--font-dm-sans)] text-[var(--brand-ink)]">
              Invoice No{" "}
              <span className="text-[var(--brand-brown)] text-xs">
                (optional)
              </span>
            </Label>
            <Input
              placeholder="INV-001"
              value={formData.invoiceNo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, invoiceNo: e.target.value }))
              }
              className="border-[var(--brand-green)]/30 focus-visible:ring-[var(--brand-green)]"
            />
          </div>

          {/* Qty + Rate */}
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

          {/* Note */}
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
