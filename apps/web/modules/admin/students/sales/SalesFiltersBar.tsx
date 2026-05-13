"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface SalesFiltersBarProps {
  isPending: boolean;
}

export function SalesFiltersBar({ isPending }: SalesFiltersBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  // const search = searchParams.get("search") ?? "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const clearAll = () => {
    router.push(pathname);
  };

  const hasFilters = from || to; /* || search */

  return (
    <div className="filters-bar">
      <div className="filters-inner">
        {/*
          Search input — uncomment when backend search is wired up

          <div className="filter-group search-group">
            <label className="filter-label" htmlFor="search-input">
              Search Student
            </label>
            <div className="input-wrapper">
              <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                id="search-input"
                type="text"
                className="filter-input"
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
        */}

        <div className="filter-group">
          <label className="filter-label" htmlFor="from-date">
            From
          </label>
          <input
            id="from-date"
            type="date"
            className="filter-input"
            value={from}
            max={to || undefined}
            onChange={(e) => updateParam("from", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="to-date">
            To
          </label>
          <input
            id="to-date"
            type="date"
            className="filter-input"
            value={to}
            min={from || undefined}
            onChange={(e) => updateParam("to", e.target.value)}
          />
        </div>

        {hasFilters && (
          <button
            className="clear-btn"
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

      <style jsx>{`
        .filters-bar {
          background: #fff;
          border: 1px solid #e8e3da;
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 24px;
        }
        .filters-inner {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: flex-end;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 150px;
        }
        .filter-label {
          font-family: var(--font-dm-sans);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #2f4e40;
        }
        .filter-input {
          height: 40px;
          border: 1.5px solid #e2ddd6;
          border-radius: 8px;
          background: #fbfaf7;
          font-family: var(--font-dm-sans);
          font-size: 14px;
          color: #1a1a1a;
          padding: 0 12px;
          transition:
            border-color 0.15s,
            box-shadow 0.15s;
          outline: none;
          box-sizing: border-box;
          cursor: pointer;
        }
        .filter-input:focus {
          border-color: #2f4e40;
          box-shadow: 0 0 0 3px rgba(47, 78, 64, 0.08);
        }
        .clear-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          height: 40px;
          padding: 0 16px;
          border: 1.5px solid #e2ddd6;
          border-radius: 8px;
          background: transparent;
          font-family: var(--font-dm-sans);
          font-size: 13px;
          font-weight: 500;
          color: #7a6e63;
          cursor: pointer;
          transition: all 0.15s;
          align-self: flex-end;
        }
        .clear-btn:hover:not(:disabled) {
          border-color: #c28a4f;
          color: #c28a4f;
        }
        .clear-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media (max-width: 640px) {
          .filters-bar {
            padding: 16px;
          }
          .filter-group {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
