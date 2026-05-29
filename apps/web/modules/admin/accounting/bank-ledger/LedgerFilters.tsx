"use client";

import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BankAccountForDropdown } from "@repo/types";

export type FilterState = {
  bankId: string;
  bankName: string;
  accountId: string;
  accountName: string;
};

interface LedgerFiltersProps {
  accounts: BankAccountForDropdown[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  hideAccountSelector?: boolean;
}

export function LedgerFilters({
  accounts,
  filters,
  onChange,
  hideAccountSelector = false,
}: LedgerFiltersProps) {
  const banks = Array.from(
    new Map(
      accounts.map((a) => [a.bankId, { id: a.bankId, name: a.bankName }]),
    ).values(),
  );

  const filteredAccounts =
    filters.bankId === "all"
      ? accounts
      : accounts.filter((a) => a.bankId === filters.bankId);

  function handleBankChange(value: string | null) {
    const selectedBank = banks.find((b) => b.id === value);
    const currentAccountStillValid = accounts.find(
      (a) => a.id === filters.accountId && a.bankId === value,
    );
    onChange({
      bankId: value ?? "all",
      bankName: selectedBank?.name ?? "all",
      accountId: currentAccountStillValid ? filters.accountId : "all",
      accountName: currentAccountStillValid ? filters.accountName : "all",
    });
  }

  function handleAccountChange(value: string | null) {
    const selectedAccount = accounts.find((a) => a.id === value);
    onChange({
      ...filters,
      accountId: value ?? "all",
      accountName: selectedAccount?.accountName ?? "all",
      bankId: selectedAccount?.bankId ?? filters.bankId,
      bankName: selectedAccount?.bankName ?? filters.bankName,
    });
  }
  return (
    <div
      className="flex flex-wrap items-end gap-4 rounded-lg border px-5 py-4"
      style={{ borderColor: "#e5e0d6", backgroundColor: "#fff" }}
    >
      <span
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide self-center mr-1"
        style={{ color: "#6b7280" }}
      >
        <SlidersHorizontal size={13} />
        Filters
      </span>

      {/* Bank selector */}
      <div className="flex flex-col gap-1 min-w-[200px]">
        <Label
          className="text-xs font-medium uppercase tracking-wide"
          style={{ color: "#9ca3af" }}
        >
          Bank
        </Label>
        <Select value={filters.bankId} onValueChange={handleBankChange}>
          <SelectTrigger className="h-9 text-sm w-full">
            <SelectValue placeholder="All Banks">
              {filters.bankId === "all"
                ? "All Banks"
                : (banks.find((b) => b.id === filters.bankId)?.name ??
                  "All Banks")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Banks</SelectItem>
            {banks.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Account selector */}
      {!hideAccountSelector && (
        <div className="flex flex-col gap-1 min-w-[260px]">
          <Label
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: "#9ca3af" }}
          >
            Bank Account
          </Label>
          <Select value={filters.accountId} onValueChange={handleAccountChange}>
            <SelectTrigger className="h-9 text-sm w-full">
              <SelectValue placeholder="All Accounts">
                {filters.accountId === "all"
                  ? "All Accounts"
                  : (filteredAccounts.find((a) => a.id === filters.accountId)
                      ?.accountName ?? "All Accounts")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {filteredAccounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.accountName}
                  <span style={{ color: "#9ca3af" }}> — {a.bankName}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
