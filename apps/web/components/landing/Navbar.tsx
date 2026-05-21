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
      className="flex items-center justify-center rounded-full font-semibold text-white select-none"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: "var(--brand-brown)",
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
    <header
      className="fixed left-0 right-0 top-0 z-100 transition-all duration-300"
      style={{
        background: "rgba(251,250,247,0.96)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(194,138,79,0.18)",
        boxShadow: "0 2px 24px rgba(47,78,64,0.07)",
      }}
    >
      <div className="mx-auto flex h-25 max-w-400 items-center justify-between px-6">
        {/* Logo — swap to dark/colored logo now that bg is light */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="flex h-20 w-20 items-center justify-center overflow-hidden">
            <Image
              src={
                siteInfo.assets.greenBrownNoBG ?? siteInfo.assets.whiteLogoNoBG
              }
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
              href={link.href}
              className="text-[0.9rem] font-medium tracking-[0.02em] transition-colors duration-200 hover:text-[--brand-green]"
              style={{
                color: "rgba(26,26,26,0.6)",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium transition-colors duration-200"
                  style={{
                    color: "var(--brand-green)",
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2 text-sm font-semibold rounded-lg text-white transition-all duration-200 hover:-translate-y-[1px]"
                  style={{
                    background: "var(--brand-brown)",
                    boxShadow: "0 3px 14px rgba(194,138,79,0.28)",
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full p-0.5 transition-all duration-200 focus:outline-none"
                  style={{
                    outline: dropdownOpen
                      ? "2px solid rgba(194,138,79,0.45)"
                      : "2px solid transparent",
                    outlineOffset: "1px",
                  }}
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  <UserAvatar user={user} size={36} />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+10px)] w-48 rounded-xl overflow-hidden z-50"
                    style={{
                      background: "var(--brand-cream)",
                      border: "1px solid rgba(194,138,79,0.2)",
                      boxShadow: "0 8px 32px rgba(47,78,64,0.12)",
                      animation: "dropIn 160ms ease",
                    }}
                  >
                    <div
                      className="px-4 py-3"
                      style={{
                        borderBottom: "1px solid rgba(194,138,79,0.12)",
                      }}
                    >
                      <p
                        className="text-sm font-semibold truncate"
                        style={{
                          color: "var(--brand-ink)",
                          fontFamily: "var(--font-dm-sans)",
                        }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{
                          color: "rgba(26,26,26,0.42)",
                          fontFamily: "var(--font-dm-sans)",
                        }}
                      >
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href={dashboardHref}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 hover:bg-[rgba(194,138,79,0.08)] hover:text-[--brand-green]"
                      style={{
                        color: "rgba(26,26,26,0.65)",
                        fontFamily: "var(--font-dm-sans)",
                      }}
                    >
                      <LayoutDashboard size={15} className="shrink-0" />
                      Dashboard
                    </Link>

                    <button
                      onClick={() => mutate()}
                      disabled={isPending}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 hover:bg-[rgba(194,138,79,0.08)] hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        color: "rgba(26,26,26,0.65)",
                        fontFamily: "var(--font-dm-sans)",
                      }}
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

        {/* Mobile: avatar + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center rounded-full p-0.5 transition-all duration-200 focus:outline-none"
                aria-label="User menu"
                aria-expanded={dropdownOpen}
              >
                <UserAvatar user={user} size={32} />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+10px)] w-44 rounded-xl overflow-hidden z-50"
                  style={{
                    background: "var(--brand-cream)",
                    border: "1px solid rgba(194,138,79,0.2)",
                    boxShadow: "0 8px 32px rgba(47,78,64,0.12)",
                    animation: "dropIn 160ms ease",
                  }}
                >
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: "1px solid rgba(194,138,79,0.12)" }}
                  >
                    <p
                      className="text-sm font-semibold truncate"
                      style={{
                        color: "var(--brand-ink)",
                        fontFamily: "var(--font-dm-sans)",
                      }}
                    >
                      {user.name}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{
                        color: "rgba(26,26,26,0.42)",
                        fontFamily: "var(--font-dm-sans)",
                      }}
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
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 hover:bg-[rgba(194,138,79,0.08)] hover:text-[--brand-green]"
                    style={{
                      color: "rgba(26,26,26,0.65)",
                      fontFamily: "var(--font-dm-sans)",
                    }}
                  >
                    <LayoutDashboard size={15} className="shrink-0" />
                    Dashboard
                  </Link>

                  <button
                    onClick={() => mutate()}
                    disabled={isPending}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 hover:bg-[rgba(194,138,79,0.08)] hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      color: "rgba(26,26,26,0.65)",
                      fontFamily: "var(--font-dm-sans)",
                    }}
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

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[rgba(194,138,79,0.1)]"
            style={{ color: "var(--brand-green)" }}
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
        className="overflow-hidden lg:hidden"
        style={{
          height: "0px",
          opacity: 0,
          background: "var(--brand-cream)",
          borderTop: "1px solid rgba(194,138,79,0.15)",
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
              className="py-3 text-[1rem] font-medium transition-colors duration-150 hover:text-[--brand-green]"
              style={{
                color: "rgba(26,26,26,0.65)",
                borderBottom: "1px solid rgba(194,138,79,0.12)",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              {link.label}
            </Link>
          ))}

          {!user && (
            <div className="flex flex-col gap-2 pt-3">
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition"
                style={{
                  color: "var(--brand-green)",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>

              <Link
                href="/auth/signup"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-[1px]"
                style={{
                  background: "var(--brand-brown)",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                <UserPlus size={18} />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </header>
  );
}
