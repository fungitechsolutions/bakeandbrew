"use client";

import { useCallback, useMemo } from "react";
import { BsDatePicker } from "@/components/bs-date-picker";
import { toast } from "sonner";
import { bsToAdString } from "@/lib/bs-date";
import { SupplierLedgerFilters } from "./types";
import {
  AccountingFilterShell,
  accountingFieldInputClass,
  accountingLabelClass,
} from "../shared/accounting-styles";
import { withAllOption } from "../shared/withAllOption";
import { SearchableSelect } from "../../inventory/shared/SearchableSelect";
import { useSupplierSearch } from "../../inventory/shared/useProductSupplierSearch";
import { useAdminClearFiltersShortcut } from "@/components/admin/admin-shortcut-provider";

interface SupplierLedgerFiltersBarProps {
  filters: SupplierLedgerFilters;
  onChange: (filters: SupplierLedgerFilters) => void;
}

export function SupplierLedgerFiltersBar({
  filters,
  onChange,
}: SupplierLedgerFiltersBarProps) {
  const hasFilters =
    filters.supplierId !== "all" || !!filters.fromBsDate || !!filters.toBsDate;

  const supplierSearch = useSupplierSearch();
  const searchSuppliers = useMemo(
    () => withAllOption(supplierSearch, "All Suppliers"),
    [supplierSearch],
  );

  function handleSupplierChange(value: string, label: string) {
    onChange({
      ...filters,
      supplierId: value,
      supplierName: value === "all" ? "all" : label,
    });
  }

  function handleFromDate(bsValue: string) {
    // "" is the picker's ✕: drop this side of the range.
    if (!bsValue) {
      onChange({ ...filters, fromBsDate: null, fromDate: null });
      return;
    }
    try {
      onChange({ ...filters, fromBsDate: bsValue, fromDate: bsToAdString(bsValue) });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid from date");
    }
  }

  function handleToDate(bsValue: string) {
    // "" is the picker's ✕: drop this side of the range.
    if (!bsValue) {
      onChange({ ...filters, toBsDate: null, toDate: null });
      return;
    }
    try {
      onChange({ ...filters, toBsDate: bsValue, toDate: bsToAdString(bsValue) });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid to date");
    }
  }

  const handleClear = useCallback(() => {
    onChange({
      supplierId: "all",
      supplierName: "all",
      fromDate: null,
      toDate: null,
      fromBsDate: null,
      toBsDate: null,
    });
  }, [onChange]);

  useAdminClearFiltersShortcut(handleClear);

  return (
    <AccountingFilterShell hasActiveFilters={hasFilters} onClear={handleClear}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <span className={accountingLabelClass}>Supplier</span>
          <SearchableSelect
            value={filters.supplierId}
            onChange={handleSupplierChange}
            onSearch={searchSuppliers}
            placeholder="Search supplier…"
            selectedLabel={
              filters.supplierId === "all"
                ? "All Suppliers"
                : filters.supplierName
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className={accountingLabelClass}>From Date (BS)</span>
          <BsDatePicker
            fieldClassName={accountingFieldInputClass}
            clearable
            value={filters.fromBsDate ?? ""}
            onChange={handleFromDate}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className={accountingLabelClass}>To Date (BS)</span>
          <BsDatePicker
            fieldClassName={accountingFieldInputClass}
            clearable
            value={filters.toBsDate ?? ""}
            onChange={handleToDate}
          />
        </div>
      </div>
    </AccountingFilterShell>
  );
}
