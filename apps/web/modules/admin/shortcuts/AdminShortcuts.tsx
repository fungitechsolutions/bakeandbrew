"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Info, Keyboard, Search, X } from "lucide-react";

import { AdminPageLayout } from "@/components/admin/admin-page-layout";
import { ADMIN_BORDER, adminInputClass } from "@/components/admin/admin-styles";
import {
  ADMIN_GO_NAV_ROUTES,
  ADMIN_PAGE_SHORTCUTS,
  ADMIN_QUICK_REFERENCE,
  getFlattenedShortcuts,
  getPageShortcutKeys,
  type AdminPageShortcut,
} from "@/lib/admin-shortcuts";
import {
  inventoryFilterPanelClass,
  inventoryTableWrapClass,
} from "@/modules/admin/inventory/shared/inventory-styles";
import { cn } from "@/lib/utils";

const PAGE_GROUPS = ["School", "Accounting", "Inventory"] as const;

const SECTION_NAV = [
  { id: "all-shortcuts", label: "All shortcuts" },
  { id: "go-to", label: "Go to" },
  { id: "by-page", label: "By page" },
] as const;

function ShortcutKey({
  children,
  size = "default",
}: {
  children: string;
  size?: "default" | "sm";
}) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded-none border border-[rgba(47,78,64,0.2)] bg-[rgba(251,250,247,1)] font-(family-name:--font-dm-sans) font-semibold text-(--brand-green) shadow-[0_1px_0_rgba(47,78,64,0.08)]",
        size === "sm"
          ? "min-w-[1.5rem] px-1.5 py-0.5 text-[10px]"
          : "min-w-[1.85rem] px-2 py-1 text-xs",
      )}
    >
      {children}
    </kbd>
  );
}

function ShortcutKeys({
  keys,
  size = "default",
}: {
  keys: string[];
  size?: "default" | "sm";
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {keys.map((key, index) => (
        <span key={`${key}-${index}`} className="inline-flex items-center gap-1">
          {index > 0 ? (
            <span className="font-(family-name:--font-dm-sans) text-[10px] text-[rgba(47,78,64,0.35)]">
              +
            </span>
          ) : null}
          <ShortcutKey size={size}>{key}</ShortcutKey>
        </span>
      ))}
    </span>
  );
}

function groupPagesByCategory() {
  return PAGE_GROUPS.map((category) => ({
    category,
    pages: ADMIN_PAGE_SHORTCUTS.filter((p) => p.category === category),
  })).filter((g) => g.pages.length > 0);
}

function matchesQuery(
  query: string,
  parts: Array<string | undefined>,
): boolean {
  if (!query) return true;
  const haystack = parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function PageShortcutCard({ page }: { page: AdminPageShortcut }) {
  const keys = getPageShortcutKeys(page);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-none bg-white p-4 sm:flex-row sm:items-center sm:justify-between",
        ADMIN_BORDER,
      )}
    >
      <div className="min-w-0 space-y-1">
        <p className="font-(family-name:--font-dm-sans) text-sm font-semibold text-(--brand-green)">
          {page.page}
        </p>
        <p className="font-(family-name:--font-dm-sans) text-xs text-[rgba(47,78,64,0.5)]">
          {page.action}
        </p>
        <code className="font-(family-name:--font-dm-sans) text-[10px] text-[rgba(47,78,64,0.4)]">
          {page.path}
        </code>
      </div>
      <div className="flex shrink-0 flex-wrap gap-1.5">
        {keys.map((key) => (
          <ShortcutKey key={key} size="sm">
            {key}
          </ShortcutKey>
        ))}
      </div>
    </div>
  );
}

export function AdminShortcuts() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const pageGroups = groupPagesByCategory();
  const allShortcuts = useMemo(() => getFlattenedShortcuts(), []);

  const filteredShortcuts = useMemo(
    () =>
      allShortcuts.filter((shortcut) =>
        matchesQuery(normalizedQuery, [
          shortcut.label,
          shortcut.description,
          shortcut.category,
          shortcut.scope,
          ...shortcut.keys,
        ]),
      ),
    [allShortcuts, normalizedQuery],
  );

  const filteredGoRoutes = useMemo(
    () =>
      ADMIN_GO_NAV_ROUTES.filter((route) =>
        matchesQuery(normalizedQuery, [
          route.label,
          route.href,
          `g ${route.key}`,
          route.key,
        ]),
      ),
    [normalizedQuery],
  );

  const filteredPageGroups = useMemo(
    () =>
      pageGroups
        .map(({ category, pages }) => ({
          category,
          pages: pages.filter((page) =>
            matchesQuery(normalizedQuery, [
              page.page,
              page.action,
              page.path,
              page.category,
              ...getPageShortcutKeys(page),
            ]),
          ),
        }))
        .filter((group) => group.pages.length > 0),
    [normalizedQuery, pageGroups],
  );

  const totalResults =
    filteredShortcuts.length +
    filteredGoRoutes.length +
    filteredPageGroups.reduce((sum, g) => sum + g.pages.length, 0);

  return (
    <AdminPageLayout
      title="Keyboard Shortcuts"
      description="Press ? anytime in the admin panel to open this page."
      maxWidth="wide"
    >
      <div className="space-y-8">
        <div className={cn("flex gap-3", inventoryFilterPanelClass)}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-[rgba(47,78,64,0.12)] bg-[rgba(47,78,64,0.06)] text-(--brand-green)">
            <Info className="h-4 w-4" strokeWidth={2} />
          </div>
          <p className="font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[rgba(47,78,64,0.65)]">
            Shortcuts work in the admin panel only. They pause while you type in
            a field — except{" "}
            <span className="font-medium text-(--brand-green)">Esc</span>, which
            always closes the top overlay. Press{" "}
            <span className="font-medium text-(--brand-green)">G</span> then a
            letter within one second to jump between sections.
          </p>
        </div>

        <div className="sticky top-0 z-20 space-y-4 border-b border-[rgba(47,78,64,0.1)] bg-(--brand-cream) pb-4 pt-1">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[rgba(47,78,64,0.4)]"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shortcuts — try payment, students, G S, clear…"
              className={cn(adminInputClass, "py-2.5 pl-9 pr-9 normal-case tracking-normal")}
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[rgba(47,78,64,0.4)] hover:text-(--brand-green)"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {SECTION_NAV.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-none border border-[rgba(47,78,64,0.18)] bg-white px-3 py-1.5 font-(family-name:--font-dm-sans) text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgba(47,78,64,0.55)] transition-colors hover:border-(--brand-green) hover:text-(--brand-green)"
                >
                  {section.label}
                </a>
              ))}
            </div>
            <p className="font-(family-name:--font-dm-sans) text-xs text-[rgba(47,78,64,0.45)]">
              {normalizedQuery
                ? `${totalResults} result${totalResults === 1 ? "" : "s"}`
                : `${allShortcuts.length + ADMIN_GO_NAV_ROUTES.length} shortcuts`}
            </p>
          </div>

          {!normalizedQuery ? (
            <div className="flex flex-wrap gap-2">
              {ADMIN_QUICK_REFERENCE.map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-none border border-[rgba(47,78,64,0.14)] bg-white px-2.5 py-1.5"
                >
                  <ShortcutKeys keys={[...item.keys]} size="sm" />
                  <span className="font-(family-name:--font-dm-sans) text-[10px] font-semibold uppercase tracking-[0.08em] text-[rgba(47,78,64,0.5)]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <section id="all-shortcuts" className="scroll-mt-28 space-y-4">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-[rgba(47,78,64,0.45)]" strokeWidth={2} />
            <h2 className="font-(family-name:--font-lora) text-lg font-semibold text-(--brand-green)">
              All shortcuts
            </h2>
          </div>

          {filteredShortcuts.length === 0 ? (
            <p className="font-(family-name:--font-dm-sans) text-sm text-[rgba(47,78,64,0.5)]">
              No shortcuts match your search.
            </p>
          ) : (
            <div className={inventoryTableWrapClass}>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[rgba(47,78,64,0.03)]">
                    <th className="w-36 px-4 py-2.5 text-left font-(family-name:--font-dm-sans) text-[10px] font-semibold uppercase tracking-[0.12em] text-[rgba(47,78,64,0.45)]">
                      Keys
                    </th>
                    <th className="w-44 px-4 py-2.5 text-left font-(family-name:--font-dm-sans) text-[10px] font-semibold uppercase tracking-[0.12em] text-[rgba(47,78,64,0.45)]">
                      Action
                    </th>
                    <th className="hidden px-4 py-2.5 text-left font-(family-name:--font-dm-sans) text-[10px] font-semibold uppercase tracking-[0.12em] text-[rgba(47,78,64,0.45)] sm:table-cell">
                      Category
                    </th>
                    <th className="px-4 py-2.5 text-left font-(family-name:--font-dm-sans) text-[10px] font-semibold uppercase tracking-[0.12em] text-[rgba(47,78,64,0.45)]">
                      What it does
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShortcuts.map((shortcut) => (
                    <tr
                      key={`${shortcut.category}-${shortcut.label}`}
                      className="border-t border-[rgba(47,78,64,0.08)] align-top hover:bg-[rgba(47,78,64,0.02)]"
                    >
                      <td className="px-4 py-3">
                        <ShortcutKeys keys={shortcut.keys} size="sm" />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-(family-name:--font-dm-sans) text-sm font-semibold text-(--brand-green)">
                          {shortcut.label}
                        </p>
                        {shortcut.scope ? (
                          <p className="mt-0.5 font-(family-name:--font-dm-sans) text-[10px] uppercase tracking-[0.08em] text-[rgba(47,78,64,0.4)]">
                            {shortcut.scope}
                          </p>
                        ) : null}
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <span className="font-(family-name:--font-dm-sans) text-xs text-[rgba(47,78,64,0.55)]">
                          {shortcut.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[rgba(47,78,64,0.65)]">
                          {shortcut.description}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section id="go-to" className="scroll-mt-28 space-y-4">
          <div>
            <h2 className="font-(family-name:--font-lora) text-lg font-semibold text-(--brand-green)">
              Go to section
            </h2>
            <p className="mt-1 font-(family-name:--font-dm-sans) text-sm text-[rgba(47,78,64,0.55)]">
              Press <ShortcutKey size="sm">G</ShortcutKey> then a letter within
              one second.
            </p>
          </div>

          {filteredGoRoutes.length === 0 ? (
            <p className="font-(family-name:--font-dm-sans) text-sm text-[rgba(47,78,64,0.5)]">
              No go-to shortcuts match your search.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredGoRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "group flex flex-col gap-2 rounded-none bg-white p-3 transition-colors hover:bg-[rgba(47,78,64,0.02)]",
                    ADMIN_BORDER,
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    <ShortcutKey size="sm">G</ShortcutKey>
                    <span className="text-[rgba(47,78,64,0.25)]">+</span>
                    <ShortcutKey size="sm">
                      {route.key.toUpperCase()}
                    </ShortcutKey>
                  </span>
                  <span className="font-(family-name:--font-dm-sans) text-sm font-medium text-(--brand-green) group-hover:text-(--brand-green-2)">
                    {route.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section id="by-page" className="scroll-mt-28 space-y-6">
          <div>
            <h2 className="font-(family-name:--font-lora) text-lg font-semibold text-(--brand-green)">
              Shortcuts by page
            </h2>
            <p className="mt-1 font-(family-name:--font-dm-sans) text-sm text-[rgba(47,78,64,0.55)]">
              Only keys that work on each page — no more scanning empty columns.
            </p>
          </div>

          {filteredPageGroups.length === 0 ? (
            <p className="font-(family-name:--font-dm-sans) text-sm text-[rgba(47,78,64,0.5)]">
              No pages match your search.
            </p>
          ) : (
            filteredPageGroups.map(({ category, pages }) => (
              <div key={category} className="space-y-3">
                <h3 className="font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(47,78,64,0.45)]">
                  {category}
                </h3>
                <div className="grid gap-2 lg:grid-cols-2">
                  {pages.map((page) => (
                    <PageShortcutCard key={page.path} page={page} />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        <p className="border-t border-[rgba(47,78,64,0.1)] pt-6 font-(family-name:--font-dm-sans) text-xs text-[rgba(47,78,64,0.45)]">
          Tip: bookmark{" "}
          <Link
            href="/admin/shortcuts"
            className="font-medium text-(--brand-green) underline underline-offset-2 hover:text-(--brand-green-2)"
          >
            /admin/shortcuts
          </Link>{" "}
          or press <ShortcutKey size="sm">?</ShortcutKey> whenever you need a
          reminder.
        </p>
      </div>
    </AdminPageLayout>
  );
}
