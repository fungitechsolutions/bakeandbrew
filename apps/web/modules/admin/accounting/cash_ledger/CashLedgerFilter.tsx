"use client";

import { useCallback } from "react";
import { BsDatePicker } from "@/components/bs-date-picker";
import { toast } from "sonner";
import { bsToAdString } from "@/lib/bs-date";
import {
  AccountingFilterShell,
  accountingFieldInputClass,
  accountingLabelClass,
} from "../shared/accounting-styles";
import { useAdminClearFiltersShortcut } from "@/components/admin/admin-shortcut-provider";

export type CashLedgerFilters = {
  fromBsDate: string | null;
  fromDate: string | null;
  toBsDate: string | null;
  toDate: string | null;
};

interface CashLedgerFiltersProps {
  filters: CashLedgerFilters;
  onChange: (filters: CashLedgerFilters) => void;
}

export function CashLedgerFilters({
  filters,
  onChange,
}: CashLedgerFiltersProps) {
  const hasFilters = !!(filters.fromBsDate || filters.toBsDate);

  function handleFromDateChange(bsValue: string) {
    // "" is the picker's ✕: drop this side of the range.
    if (!bsValue) {
      onChange({ ...filters, fromBsDate: null, fromDate: null });
      return;
    }
    try {
      const adValue = bsToAdString(bsValue);
      onChange({
        ...filters,
        fromBsDate: bsValue,
        fromDate: adValue,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid from date");
    }
  }

  function handleToDateChange(bsValue: string) {
    // "" is the picker's ✕: drop this side of the range.
    if (!bsValue) {
      onChange({ ...filters, toBsDate: null, toDate: null });
      return;
    }
    try {
      const adValue = bsToAdString(bsValue);
      onChange({
        ...filters,
        toBsDate: bsValue,
        toDate: adValue,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid to date");
    }
  }

  const handleClear = useCallback(() => {
    onChange({
      fromDate: null,
      toDate: null,
      fromBsDate: null,
      toBsDate: null,
    });
  }, [onChange]);

  useAdminClearFiltersShortcut(handleClear);

  return (
    <AccountingFilterShell hasActiveFilters={hasFilters} onClear={handleClear}>
      <div className="flex flex-wrap gap-4">
        <div className="flex min-w-[160px] flex-1 flex-col gap-2">
          <span className={accountingLabelClass}>From Date (BS)</span>
          <BsDatePicker
            fieldClassName={accountingFieldInputClass}
            clearable
            value={filters.fromBsDate ?? ""}
            onChange={handleFromDateChange}
          />
        </div>

        <div className="flex min-w-[160px] flex-1 flex-col gap-2">
          <span className={accountingLabelClass}>To Date (BS)</span>
          <BsDatePicker
            fieldClassName={accountingFieldInputClass}
            clearable
            value={filters.toBsDate ?? ""}
            onChange={handleToDateChange}
          />
        </div>
      </div>
    </AccountingFilterShell>
  );
}
