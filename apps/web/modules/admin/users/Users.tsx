"use client";

import { useState, useTransition } from "react";
import { Plus, Search, ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { StatsBar } from "./StatsBar";
import { PAGE_SIZE } from "@/utils/mock";
import { CreateUserModal } from "./CreateUserModal";
import { EditUserCard } from "./EditUserCard";
import { UsersTable } from "./UserTable";
import { Pagination } from "./Pagination";
import api from "@/lib/axios";
import { User, UsersList } from "@repo/types";
import { UsersTableSkeleton } from "./UserTableSkeleton";
import { UsersErrorState } from "./UserErrorState";
import { UsersEmptyState } from "./UserEmptyState";

type Role = "admin" | "instructor" | "student" | "all";

const ROLES: { label: string; value: Role }[] = [
  { label: "All Roles", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Instructor", value: "instructor" },
  { label: "Student", value: "student" },
];

export function UsersPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isTransitioning, startTransition] = useTransition();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);

  // Read from URL, defaults
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const role = (searchParams.get("role") as Role) ?? "all";

  // Local search input state (debounced into URL)
  const [searchInput, setSearchInput] = useState(search);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    }
    // Reset to page 1 on filter change
    if ("search" in updates || "role" in updates) params.set("page", "1");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateParams({ search: value || null });
  }, 400);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  }

  function clearSearch() {
    setSearchInput("");
    updateParams({ search: null });
  }

  function handleRoleSelect(value: Role) {
    setRoleOpen(false);
    updateParams({
      role: value,
    });
  }

  function handlePageChange(newPage: number) {
    updateParams({ page: String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Build query string for API
  const queryString = (() => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    if (search) p.set("search", search);
    if (role && role !== "all") p.set("role", role);
    return p.toString();
  })();

  const { data, isFetching, isPending, isError, error } = useQuery({
    queryKey: ["admin-users", page, search, role],
    queryFn: async () => {
      const res = await api.get<UsersList>(`/admin/users?${queryString}`);
      return res.data;
    },
    staleTime: 10 * 60 * 60,
    gcTime: 10 * 60 * 60,
  });

  const users = data?.data;
  const totalUsers = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPages ?? 1;
  const start = (data?.meta.offset ?? 0) + 1;
  const end = (data?.meta.offset ?? 0) + (users?.length ?? 0);

  const currentRoleLabel = ROLES.find((r) => r.value === role)?.label ?? "All";
  const hasActiveFilters = search || role !== "all";

  if (isError || error) return <UsersErrorState />;

  return (
    <div className="min-h-screen bg-(--brand-cream) px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight text-(--brand-green) uppercase">
            Users
          </h1>
          <p className="font-mono text-xs text-[rgba(47,78,64,0.55)] tracking-widest mt-1">
            {isFetching || isPending ? "Loading..." : `${totalUsers} total`}
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-(--brand-brown) bg-(--brand-brown) px-5 py-2.5 font-mono text-xs font-semibold tracking-widest text-white uppercase transition-colors hover:bg-[#ad7843] sm:self-auto"
        >
          <Plus size={14} />
          Create User
        </button>
      </div>

      {/* Search + Role filter row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(47,78,64,0.4)] pointer-events-none"
          />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search by name or email…"
            className="w-full border border-[rgba(47,78,64,0.2)] bg-white pl-8 pr-8 py-2.5 font-mono text-xs tracking-wide text-(--brand-green) placeholder:text-[rgba(47,78,64,0.35)] outline-none focus:border-(--brand-green) transition-colors"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(47,78,64,0.4)] hover:text-(--brand-green) transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Role filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleOpen((o) => !o)}
            className="flex items-center gap-2 border border-[rgba(47,78,64,0.2)] bg-white px-4 py-2.5 font-mono text-xs tracking-widest text-(--brand-green) uppercase hover:border-(--brand-green) transition-colors min-w-[140px] justify-between"
          >
            <span>{currentRoleLabel}</span>
            <ChevronDown
              size={13}
              className={`transition-transform ${roleOpen ? "rotate-180" : ""}`}
            />
          </button>

          {roleOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setRoleOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-[rgba(47,78,64,0.2)] shadow-sm min-w-[140px]">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => handleRoleSelect(r.value)}
                    className={`w-full text-left px-4 py-2.5 font-mono text-xs tracking-widest uppercase transition-colors hover:bg-[rgba(47,78,64,0.06)] ${
                      role === r.value
                        ? "text-(--brand-green) font-semibold bg-[rgba(47,78,64,0.04)]"
                        : "text-[rgba(47,78,64,0.7)]"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="font-mono text-[10px] tracking-widest text-[rgba(47,78,64,0.4)] uppercase">
            Filters:
          </span>
          {role !== "all" && (
            <span className="inline-flex items-center gap-1.5 border border-[rgba(47,78,64,0.2)] bg-white px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase text-(--brand-green)">
              Role: {currentRoleLabel}
              <button
                onClick={() => handleRoleSelect("all")}
                className="text-[rgba(47,78,64,0.4)] hover:text-(--brand-green)"
              >
                <X size={10} />
              </button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1.5 border border-[rgba(47,78,64,0.2)] bg-white px-2.5 py-1 font-mono text-[10px] tracking-widest text-(--brand-green)">
              &ldquo;{search}&rdquo;
              <button
                onClick={clearSearch}
                className="text-[rgba(47,78,64,0.4)] hover:text-(--brand-green)"
              >
                <X size={10} />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchInput("");
              updateParams({ search: null, role: null });
            }}
            className="font-mono text-[10px] tracking-widest uppercase text-[rgba(47,78,64,0.4)] hover:text-(--brand-green) underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Loading overlay on filter/page change */}
      {(isFetching && data) || isPending ? (
        <div className="opacity-60 pointer-events-none">
          <UsersTableSkeleton />
        </div>
      ) : users?.length === 0 ? (
        <UsersEmptyState
          role={role === "all" ? "users" : role}
          onCreateUser={() => setIsCreateOpen(true)}
        />
      ) : users && users.length > 0 ? (
        <>
          <StatsBar
            users={users}
            total={data.meta.total}
            roleCount={{ ...data.meta.roleCounts }}
          />
          <UsersTable users={users} onRowClick={setSelectedUser} />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
            <p className="font-mono text-xs tracking-wide text-[rgba(47,78,64,0.55)]">
              Showing {start}&ndash;
              {end} of {totalUsers} users
            </p>
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </>
      ) : null}

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <EditUserCard user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
