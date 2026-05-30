"use client";

import { SlidersHorizontal, CalendarDays, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BSToAD } from "bikram-sambat-js";
import { SupplierForDropdown, SupplierLedgerFilters } from "./types";

interface SupplierLedgerFiltersBarProps {
  suppliers: SupplierForDropdown[];
  filters: SupplierLedgerFilters;
  onChange: (filters: SupplierLedgerFilters) => void;
}

const inputCls =
  "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function SupplierLedgerFiltersBar({
  suppliers,
  filters,
  onChange,
}: SupplierLedgerFiltersBarProps) {
  const hasFilters =
    filters.supplierId !== "all" || !!filters.fromBsDate || !!filters.toBsDate;

  function handleSupplierChange(value: string) {
    const selected = suppliers.find((s) => s.id === value);
    onChange({
      ...filters,
      supplierId: value,
      supplierName: selected?.companyName ?? "all",
    });
  }

  function handleFromDate(bsValue: string) {
    try {
      onChange({ ...filters, fromBsDate: bsValue, fromDate: BSToAD(bsValue) });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid from date");
    }
  }

  function handleToDate(bsValue: string) {
    try {
      onChange({ ...filters, toBsDate: bsValue, toDate: BSToAD(bsValue) });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid to date");
    }
  }

  function handleClear() {
    onChange({
      supplierId: "all",
      supplierName: "all",
      fromDate: null,
      toDate: null,
      fromBsDate: null,
      toBsDate: null,
    });
  }

  return (
    <div
      className="rounded-lg border px-5 py-4"
      style={{ borderColor: "#e5e0d6", backgroundColor: "#fff" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide"
          style={{ color: "#6b7280" }}
        >
          <SlidersHorizontal size={13} /> Filters
        </span>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-7 px-2 text-xs gap-1"
            style={{ color: "#9ca3af" }}
          >
            <X size={12} /> Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
          <Label
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: "#9ca3af" }}
          >
            Supplier
          </Label>
          <Select
            value={filters.supplierId}
            onValueChange={(v) => v && handleSupplierChange(v)}
          >
            <SelectTrigger className="h-9 text-sm w-full rounded-none shadow-none py-[17px]">
              <SelectValue placeholder="All Suppliers">
                {filters.supplierId === "all"
                  ? "All Suppliers"
                  : (suppliers.find((s) => s.id === filters.supplierId)
                      ?.companyName ?? "All Suppliers")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
          <Label
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: "#9ca3af" }}
          >
            From Date (BS)
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-[#2d4a3e]/40">
              <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <NepaliDatePicker
              inputClassName={cn(inputCls, "pl-9 rounded-none shadow-none")}
              value={filters.fromBsDate ?? ""}
              onChange={(v: string) => {
                if (v) handleFromDate(v);
              }}
              options={{ calenderLocale: "en", valueLocale: "en" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
          <Label
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: "#9ca3af" }}
          >
            To Date (BS)
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-[#2d4a3e]/40">
              <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <NepaliDatePicker
              inputClassName={cn(inputCls, "pl-9 rounded-none shadow-none")}
              value={filters.toBsDate ?? ""}
              onChange={(v: string) => {
                if (v) handleToDate(v);
              }}
              options={{ calenderLocale: "en", valueLocale: "en" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
