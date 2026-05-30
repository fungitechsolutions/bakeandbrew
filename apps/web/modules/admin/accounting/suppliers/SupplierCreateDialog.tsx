"use client";

import { useState } from "react";
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
import { CreateSupplierInput } from "./types";

interface SupplierCreateDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onCreate: (data: CreateSupplierInput) => Promise<void>;
}

export function SupplierCreateDialog({
  open,
  loading,
  onClose,
  onCreate,
}: SupplierCreateDialogProps) {
  const [companyName, setCompanyName] = useState("");
  const [vatNo, setVatNo] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      setError("Company name is required.");
      return;
    }
    setError("");
    await onCreate({
      companyName: companyName.trim(),
      vatNo: vatNo.trim() || undefined,
      phone: phone.trim() || undefined,
    });
    setCompanyName("");
    setVatNo("");
    setPhone("");
  };

  const handleClose = () => {
    setCompanyName("");
    setVatNo("");
    setPhone("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle style={{ color: "var(--brand-ink)" }}>
            Add Supplier
          </DialogTitle>
          <DialogDescription>
            Fill in the details to add a new supplier.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. Nepal Trading Co."
              className="h-9"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
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
              onChange={(e) => setVatNo(e.target.value)}
            />
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
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: "var(--brand-green)",
              color: "var(--brand-cream)",
            }}
          >
            {loading ? "Creating..." : "Add Supplier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
