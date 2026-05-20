"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  X,
  Menu,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { siteInfo } from "@/utils/site-info";
import { useAuthStore } from "@/store/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { BaseAPIResponse } from "@repo/types";
import { Spinner } from "../ui/spinner";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Why Us", href: "/#why-us" },
  { label: "Programs", href: "/#programs" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Inquire", href: "/#inquiry" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function UserAvatar({
  user,
  size = 36,
}: {
  user: { name: string; imageUrl?: string };
  size?: number;
}) {
  if (user.imageUrl) {
    return (
      <Image
        src={user.imageUrl}
        alt={user.name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="flex items-center justify-center rounded-full bg-[#e8552a] font-semibold text-white select-none"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        fontFamily: "var(--font-dm-sans)",
      }}
    >
      {getInitials(user.name)}
    </span>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const router = useRouter();

  const { mutate, isPending, reset } = useMutation({
    mutationFn: async () => {
      const response = await api.post<BaseAPIResponse>("/auth/logout");
      return response.data;
    },
    onMutate: () => {
      setDropdownOpen(false);
    },
    onSuccess: (result) => {
      clearUser();
      toast.success(result.message);
      router.refresh();
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
      reset();
    },
  });

  const dashboardHref =
    user?.role === "admin" || user?.role === "superadmin"
      ? "/admin"
      : "/dashboard";

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Animate mobile menu height
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    if (menuOpen) {
      el.style.height = el.scrollHeight + "px";
      el.style.opacity = "1";
    } else {
      el.style.height = "0px";
      el.style.opacity = "0";
    }
  }, [menuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [dropdownOpen]);

  return (
    <header className="fixed left-0 right-0 top-0 z-100 transition-all duration-300 bg-[#2d4a3e]/97 shadow-[0_2px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl">
      <div className="mx-auto flex h-25 max-w-300 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="flex h-20 w-20 items-center justify-center overflow-hidden">
            <Image
              src={siteInfo.assets.whiteLogoNoBG}
              alt={siteInfo.company.shortName}
              width={120}
              height={120}
            />
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={`/${link.href}`}
              className="text-[0.9rem] font-medium tracking-[0.02em] text-white/85 transition-colors duration-200 hover:text-[#d6cbb8]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#e8552a] text-white hover:opacity-90 transition"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Signup
                </Link>
              </>
            ) : (
              /* ── Desktop Avatar + Dropdown ── */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full p-0.5 ring-2 ring-transparent hover:ring-[#d6cbb8]/50 transition-all duration-200 focus:outline-none focus:ring-[#d6cbb8]/60"
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  <UserAvatar user={user} size={36} />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+10px)] w-48 rounded-xl border border-white/10 bg-[#223d32] shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden z-50"
                    style={{ animation: "dropIn 160ms ease" }}
                  >
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <p
                        className="text-sm font-semibold text-white truncate"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-xs text-white/50 truncate"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href={dashboardHref}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-[#d6cbb8] transition-colors duration-150"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      <LayoutDashboard size={15} className="shrink-0" />
                      Dashboard
                    </Link>

                    <button
                      onClick={() => mutate()}
                      disabled={isPending}
                      className="flex w-full items-center  gap-3 px-4 py-3 text-sm text-white/80 transition-colors duration-150 hover:bg-white/5 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white/80"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {isPending ? (
                        <>
                          <Spinner />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut size={15} className="shrink-0" />
                          Logout
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile right side: avatar (if logged in) + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center rounded-full p-0.5 ring-2 ring-transparent hover:ring-[#d6cbb8]/50 transition-all duration-200 focus:outline-none"
                aria-label="User menu"
                aria-expanded={dropdownOpen}
              >
                <UserAvatar user={user} size={32} />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+10px)] w-44 rounded-xl border border-white/10 bg-[#223d32] shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden z-50"
                  style={{ animation: "dropIn 160ms ease" }}
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p
                      className="text-sm font-semibold text-white truncate"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {user.name}
                    </p>
                    <p
                      className="text-xs text-white/50 truncate"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href={dashboardHref}
                    onClick={() => {
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-[#d6cbb8] transition-colors duration-150"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    <LayoutDashboard size={15} className="shrink-0" />
                    Dashboard
                  </Link>

                  <button
                    onClick={() => mutate()}
                    disabled={isPending}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white/80 transition-colors duration-150 hover:bg-white/5 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white/80"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {isPending ? (
                      <>
                        <Spinner />
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut size={15} className="shrink-0" />
                        Logout
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors duration-200 hover:bg-white/10"
          >
            {menuOpen ? (
              <X className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className="overflow-hidden bg-[#2d4a3e] lg:hidden"
        style={{
          height: "0px",
          opacity: 0,
          transition:
            "height 260ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease",
        }}
      >
        <div className="flex flex-col gap-1 px-6 pb-6 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-3 text-[1rem] font-medium text-white/85 transition-colors duration-150 hover:text-[#d6cbb8]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {link.label}
            </Link>
          ))}

          {/* Show login/signup in hamburger only when NOT logged in */}
          {!user && (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg py-2 text-white/85 transition hover:text-[#d6cbb8]"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>

              <Link
                href="/auth/signup"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg py-2 text-white/85 transition hover:text-[#d6cbb8]"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                <UserPlus size={18} />
                <span>Signup</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown animation keyframe — injected once */}
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </header>
  );
}
