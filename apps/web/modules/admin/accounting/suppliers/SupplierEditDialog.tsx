"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Supplier,
  UpdateSupplierInput,
  updateSupplierSchema,
} from "@repo/types";
import z from "zod";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/axios";
import { mapFieldErrors } from "@/utils/api";
import { toast } from "sonner";
import { FieldError } from "@/components/ui/field";

interface SupplierEditDialogProps {
  supplier: Supplier | null;
  loading: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateSupplierInput) => Promise<void>;
}

export function SupplierEditDialog({
  supplier,
  loading,
  onClose,
  onSave,
}: SupplierEditDialogProps) {
  const [companyName, setCompanyName] = useState("");
  const [vatNo, setVatNo] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] =
    useState<Partial<Record<keyof UpdateSupplierInput, string>>>();

  useEffect(() => {
    if (supplier) {
      setTimeout(() => {
        setCompanyName(supplier.companyName);
        setVatNo(supplier.vatNo ?? "");
        setPhone(supplier.phone ?? "");
        setErrors({});
      }, 0);
    }
  }, [supplier]);

  const handleSave = async () => {
    if (!supplier) {
      toast.error("Supplier not found");
      return;
    }
    const validateFields = updateSupplierSchema.safeParse({
      companyName: companyName.trim(),
      vatNo: vatNo.trim() || undefined,
      phone: phone.trim() || undefined,
    });
    if (!validateFields.success) {
      const tree = z.treeifyError(validateFields.error).properties;
      setErrors({
        companyName: tree?.companyName?.errors[0],
        vatNo: tree?.vatNo?.errors[0],
        phone: tree?.phone?.errors[0],
      });
      return;
    }

    setErrors({});

    try {
      await onSave(supplier.id, {
        companyName: companyName.trim(),
        vatNo: vatNo.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      onClose();
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const data = error.response?.data;
      if (data?.errors?.length) {
        setErrors(mapFieldErrors(data));
      }
    }
  };

  return (
    <Dialog open={!!supplier} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle style={{ color: "var(--brand-ink)" }}>
            Edit Supplier
          </DialogTitle>
          <DialogDescription>
            Update the supplier&apos;s details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              className="h-9"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                setErrors((prev) => ({ ...prev, companyName: undefined }));
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
            {errors?.companyName && (
              <FieldError>{errors.companyName}</FieldError>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">
              VAT No.{" "}
              <span className="text-xs font-normal text-stone-400">
                (optional)
              </span>
            </Label>
            <Input
              placeholder="e.g. 300123456"
              className="h-9 font-mono"
              value={vatNo}
              onChange={(e) => {
                setVatNo(e.target.value);
                setErrors((prev) => ({ ...prev, vatNo: undefined }));
              }}
            />
            {errors?.vatNo && <FieldError>{errors.vatNo}</FieldError>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">
              Phone{" "}
              <span className="text-xs font-normal text-stone-400">
                (optional)
              </span>
            </Label>
            <Input
              type="tel"
              placeholder="e.g. 9841000000"
              className="h-9"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
            />
            {errors?.phone && <FieldError>{errors.phone}</FieldError>}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            style={{
              backgroundColor: "var(--brand-green)",
              color: "var(--brand-cream)",
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
