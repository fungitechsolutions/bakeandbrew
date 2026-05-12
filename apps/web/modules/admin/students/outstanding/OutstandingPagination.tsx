"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  isDisabled?: boolean;
}

export function Pagination({ page, totalPages, isDisabled }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(p));
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  const baseBtnClass =
    "min-w-[36px] h-9 rounded-lg border border-[1.5px] border-[#e2ddd6] bg-white font-[var(--font-dm-sans)] text-[13px] font-medium text-[#4a4540] cursor-pointer flex items-center justify-center transition-all duration-[120ms] px-2.5";

  const hoverClass = "hover:border-[#2f4e40] hover:text-[#2f4e40]";
  const activeClass = "!bg-[#2f4e40] !border-[#2f4e40] !text-[#fbfaf7]";
  const disabledClass = "disabled:opacity-35 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-1.5 pt-5 pb-1">
      {/* Prev button */}
      <button
        className={`${baseBtnClass} ${hoverClass} ${disabledClass} !px-0`}
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1 || isDisabled}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="font-[var(--font-dm-sans)] text-sm text-[#9e9589] px-1"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            className={`${baseBtnClass} ${p === page ? activeClass : hoverClass} ${disabledClass}`}
            onClick={() => goToPage(p as number)}
            disabled={isDisabled}
          >
            {p}
          </button>
        ),
      )}

      {/* Next button */}
      <button
        className={`${baseBtnClass} ${hoverClass} ${disabledClass} !px-0`}
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages || isDisabled}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
