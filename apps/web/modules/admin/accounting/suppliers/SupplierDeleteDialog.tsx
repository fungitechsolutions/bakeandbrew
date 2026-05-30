"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Supplier } from "@repo/types";

interface SupplierDeleteDialogProps {
  supplier: Supplier | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function SupplierDeleteDialog({
  supplier,
  loading,
  onClose,
  onConfirm,
}: SupplierDeleteDialogProps) {
  return (
    <Dialog open={!!supplier} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <DialogTitle style={{ color: "var(--brand-ink)" }}>
              Delete Supplier
            </DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-stone-700">
              {supplier?.companyName}
            </span>
            ? This action cannot be undone and may fail if the supplier has
            existing ledger entries.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => supplier && onConfirm(supplier.id)}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Supplier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
