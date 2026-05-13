"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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

  return (
    <div className="pagination">
      <button
        className="page-btn nav-btn"
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
          <span key={`ellipsis-${i}`} className="ellipsis">
            …
          </span>
        ) : (
          <button
            key={p}
            className={`page-btn ${p === page ? "active" : ""}`}
            onClick={() => goToPage(p as number)}
            disabled={isDisabled}
          >
            {p}
          </button>
        ),
      )}

      <button
        className="page-btn nav-btn"
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

      <style jsx>{`
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 20px 0 4px;
        }
        .page-btn {
          min-width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1.5px solid #e2ddd6;
          background: #fff;
          font-family: var(--font-dm-sans);
          font-size: 13px;
          font-weight: 500;
          color: #4a4540;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.12s;
          padding: 0 10px;
        }
        .page-btn:hover:not(:disabled):not(.active) {
          border-color: #2f4e40;
          color: #2f4e40;
        }
        .page-btn.active {
          background: #2f4e40;
          border-color: #2f4e40;
          color: #fbfaf7;
        }
        .page-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .nav-btn {
          padding: 0;
        }
        .ellipsis {
          font-family: var(--font-dm-sans);
          font-size: 14px;
          color: #9e9589;
          padding: 0 4px;
        }
      `}</style>
    </div>
  );
}
