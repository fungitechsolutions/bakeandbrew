"use client";

import { useState } from "react";
import { InventoryPageHeader } from "../shared/InventoryPageHeader";
import { SummaryTable } from "./SummaryTable";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarDays, Filter, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { InventorySummaryResponse } from "@repo/types";
import api from "@/lib/axios";
import SummaryLoading from "./SummaryLoading";
import SummaryError from "./SummaryError";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { inputCls } from "../../students/detail/shared/utils";
import { cn } from "@/lib/utils";

export function SummaryClient() {
  const [pendingFrom, setPendingFrom] = useState("");
  const [pendingTo, setPendingTo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const hasActiveFilter = !!fromDate || !!toDate;
  const hasPendingChange = pendingFrom !== fromDate || pendingTo !== toDate;

  const { data, isPending, isError, refetch, error } = useQuery({
    queryKey: ["admin-inventory-summary", fromDate, toDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", toDate);
      const query = params.toString();
      const res = await api.get<InventorySummaryResponse>(
        `/admin/inventory/summary${query ? `?${query}` : ""}`,
      );
      return res.data;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const handleApply = () => {
    setFromDate(pendingFrom);
    setToDate(pendingTo);
  };

  const handleClear = () => {
    setPendingFrom("");
    setPendingTo("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="space-y-6 min-h-screen bg-(--brand-cream) px-4 py-8 sm:px-6 lg:px-8 mx-auto">
      <InventoryPageHeader
        title="Inventory Summary"
        description="Overview of stock levels and valuations across all products."
      />

      {/* Date filter */}
      <div
        className="rounded-lg border border-stone-200 bg-white px-4 py-4 sm:px-5"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
            <CalendarDays size={13} />
            Date Range (BS)
          </span>
          <div className="flex items-center gap-2">
            {hasActiveFilter && (
              <p className="text-sm text-stone-500">Filtered results</p>
            )}
            {hasPendingChange && (
              <Button
                size="sm"
                onClick={handleApply}
                className="h-7 bg-[var(--brand-green)] hover:bg-[var(--brand-green-2)] text-white gap-1.5 px-3 text-xs"
              >
                <Filter size={12} /> Apply
              </Button>
            )}
            {hasActiveFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7 gap-1 px-2 text-xs text-stone-500 hover:text-stone-800"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium uppercase tracking-wide text-stone-400">
              From
            </Label>
            <div className="relative w-full">
              <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#2d4a3e]/40">
                <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <NepaliDatePicker
                inputClassName={cn(
                  inputCls,
                  "h-9 w-full pl-9 rounded-none shadow-none",
                )}
                value={pendingFrom}
                onChange={(v: string) => setPendingFrom(v)}
                options={{ calenderLocale: "en", valueLocale: "en" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium uppercase tracking-wide text-stone-400">
              To
            </Label>
            <div className="relative w-full">
              <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#2d4a3e]/40">
                <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <NepaliDatePicker
                inputClassName={cn(
                  inputCls,
                  "h-9 w-full pl-9 rounded-none shadow-none",
                )}
                value={pendingTo}
                onChange={(v: string) => setPendingTo(v)}
                options={{ calenderLocale: "en", valueLocale: "en" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table area */}
      {isPending || !data ? (
        <SummaryLoading />
      ) : isError ? (
        <SummaryError error={error} reset={refetch} />
      ) : !data.success ? (
        <SummaryError
          error={{ ...data, message: "Failed to process request" }}
          reset={refetch}
        />
      ) : (
        <SummaryTable data={data.data} />
      )}
    </div>
  );
}
