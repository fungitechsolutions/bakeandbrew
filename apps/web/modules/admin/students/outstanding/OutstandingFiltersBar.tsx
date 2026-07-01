"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAdminClearFiltersShortcut } from "@/components/admin/admin-shortcut-provider";

interface OutstandingFiltersBarProps {
  isPending: boolean;
}

export function OutstandingFiltersBar({
  isPending,
}: OutstandingFiltersBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const search = searchParams.get("search") ?? "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // reset to page 1 on filter change
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const clearAll = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  useAdminClearFiltersShortcut(clearAll);

  const hasFilters = from || to || search;

  return (
    <div className="bg-white border border-[#e8e3da] rounded-xl px-6 py-5 mb-6 max-sm:px-4 max-sm:py-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px] max-sm:min-w-full">
          <label
            className="font-[var(--font-dm-sans)] text-[11px] font-semibold tracking-[0.08em] uppercase text-[#2f4e40]"
            htmlFor="search-input"
          >
            Search Student
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9589] pointer-events-none"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              id="search-input"
              type="text"
              className="w-full h-10 border-[1.5px] border-[#e2ddd6] rounded-lg bg-[#fbfaf7] font-[var(--font-dm-sans)] text-sm text-[#1a1a1a] pl-9 pr-3 transition-[border-color,box-shadow] duration-150 outline-none focus:border-[#2f4e40] focus:shadow-[0_0_0_3px_rgba(47,78,64,0.08)]"
              placeholder="Name or email…"
              defaultValue={search}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParam("search", (e.target as HTMLInputElement).value);
                }
              }}
              onBlur={(e) => updateParam("search", e.target.value)}
            />
          </div>
        </div>

        {/* From date */}
        <div className="flex flex-col gap-1.5 min-w-[150px] max-sm:min-w-full">
          <label
            className="font-[var(--font-dm-sans)] text-[11px] font-semibold tracking-[0.08em] uppercase text-[#2f4e40]"
            htmlFor="from-date"
          >
            From
          </label>
          <input
            id="from-date"
            type="date"
            className="w-full h-10 border-[1.5px] border-[#e2ddd6] rounded-lg bg-[#fbfaf7] font-[var(--font-dm-sans)] text-sm text-[#1a1a1a] px-3 transition-[border-color,box-shadow] duration-150 outline-none focus:border-[#2f4e40] focus:shadow-[0_0_0_3px_rgba(47,78,64,0.08)] cursor-pointer"
            value={from}
            max={to || undefined}
            onChange={(e) => updateParam("from", e.target.value)}
          />
        </div>

        {/* To date */}
        <div className="flex flex-col gap-1.5 min-w-[150px] max-sm:min-w-full">
          <label
            className="font-[var(--font-dm-sans)] text-[11px] font-semibold tracking-[0.08em] uppercase text-[#2f4e40]"
            htmlFor="to-date"
          >
            To
          </label>
          <input
            id="to-date"
            type="date"
            className="w-full h-10 border-[1.5px] border-[#e2ddd6] rounded-lg bg-[#fbfaf7] font-[var(--font-dm-sans)] text-sm text-[#1a1a1a] px-3 transition-[border-color,box-shadow] duration-150 outline-none focus:border-[#2f4e40] focus:shadow-[0_0_0_3px_rgba(47,78,64,0.08)] cursor-pointer"
            value={to}
            min={from || undefined}
            onChange={(e) => updateParam("to", e.target.value)}
          />
        </div>

        {/* Clear button */}
        {hasFilters && (
          <button
            className="self-end flex items-center gap-1.5 h-10 px-4 border-[1.5px] border-[#e2ddd6] rounded-lg bg-transparent font-[var(--font-dm-sans)] text-[13px] font-medium text-[#7a6e63] cursor-pointer transition-all duration-150 hover:border-[#c28a4f] hover:text-[#c28a4f] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={clearAll}
            type="button"
            disabled={isPending}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
