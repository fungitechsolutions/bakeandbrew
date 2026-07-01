"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { useLogout } from "@/hooks/useLogout";
import { ADMIN_GO_NAV_ROUTES } from "@/lib/admin-shortcuts";
import { isTypingTarget } from "@/lib/keyboard";

const GO_CHORD_TIMEOUT_MS = 1000;

type ShortcutFn = () => void;

type AdminShortcutContextValue = {
  registerNewShortcut: (toggle: ShortcutFn) => () => void;
  registerFocusSearchShortcut: (focus: ShortcutFn) => () => void;
  registerRefreshShortcut: (refresh: ShortcutFn) => () => void;
  registerClearFiltersShortcut: (clear: ShortcutFn) => () => void;
  registerBackShortcut: (back: ShortcutFn) => () => void;
  registerPaymentShortcut: (open: ShortcutFn) => () => void;
  registerScholarshipShortcut: (open: ShortcutFn) => () => void;
  registerDiscountShortcut: (open: ShortcutFn) => () => void;
  registerEscapeShortcut: (close: ShortcutFn) => () => void;
};

const AdminShortcutContext = createContext<AdminShortcutContextValue | null>(
  null,
);

function useRegisterShortcut(ref: React.MutableRefObject<ShortcutFn | null>) {
  return useCallback((handler: ShortcutFn) => {
    ref.current = handler;
    return () => {
      if (ref.current === handler) {
        ref.current = null;
      }
    };
  }, [ref]);
}

export function AdminShortcutProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const newRef = useRef<ShortcutFn | null>(null);
  const focusSearchRef = useRef<ShortcutFn | null>(null);
  const refreshRef = useRef<ShortcutFn | null>(null);
  const clearFiltersRef = useRef<ShortcutFn | null>(null);
  const backRef = useRef<ShortcutFn | null>(null);
  const paymentRef = useRef<ShortcutFn | null>(null);
  const scholarshipRef = useRef<ShortcutFn | null>(null);
  const discountRef = useRef<ShortcutFn | null>(null);
  const escapeRef = useRef<ShortcutFn | null>(null);
  const pendingGoRef = useRef(false);
  const goTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const registerNewShortcut = useRegisterShortcut(newRef);
  const registerFocusSearchShortcut = useRegisterShortcut(focusSearchRef);
  const registerRefreshShortcut = useRegisterShortcut(refreshRef);
  const registerClearFiltersShortcut = useRegisterShortcut(clearFiltersRef);
  const registerBackShortcut = useRegisterShortcut(backRef);
  const registerPaymentShortcut = useRegisterShortcut(paymentRef);
  const registerScholarshipShortcut = useRegisterShortcut(scholarshipRef);
  const registerDiscountShortcut = useRegisterShortcut(discountRef);
  const registerEscapeShortcut = useRegisterShortcut(escapeRef);

  useEffect(() => {
    return () => {
      if (goTimeoutRef.current) {
        clearTimeout(goTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      const key = event.key.toLowerCase();

      if (event.key === "Escape" && escapeRef.current) {
        escapeRef.current();
        return;
      }

      if (isTypingTarget(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const inAdmin = pathname.startsWith("/admin");

      if (pendingGoRef.current && inAdmin) {
        pendingGoRef.current = false;
        if (goTimeoutRef.current) {
          clearTimeout(goTimeoutRef.current);
          goTimeoutRef.current = null;
        }

        const route = ADMIN_GO_NAV_ROUTES.find((r) => r.key === key);
        if (route) {
          event.preventDefault();
          router.push(route.href);
        }
        return;
      }

      if (key === "g" && inAdmin) {
        event.preventDefault();
        pendingGoRef.current = true;
        if (goTimeoutRef.current) {
          clearTimeout(goTimeoutRef.current);
        }
        goTimeoutRef.current = setTimeout(() => {
          pendingGoRef.current = false;
          goTimeoutRef.current = null;
        }, GO_CHORD_TIMEOUT_MS);
        return;
      }

      if (key === "n" && newRef.current) {
        event.preventDefault();
        newRef.current();
        return;
      }

      if (key === "f" && focusSearchRef.current) {
        event.preventDefault();
        focusSearchRef.current();
        return;
      }

      if (key === "c" && clearFiltersRef.current) {
        event.preventDefault();
        clearFiltersRef.current();
        return;
      }

      if (key === "r" && refreshRef.current) {
        event.preventDefault();
        refreshRef.current();
        return;
      }

      if (key === "b" && backRef.current) {
        event.preventDefault();
        backRef.current();
        return;
      }

      if (key === "p" && paymentRef.current) {
        event.preventDefault();
        paymentRef.current();
        return;
      }

      if (key === "s" && scholarshipRef.current) {
        event.preventDefault();
        scholarshipRef.current();
        return;
      }

      if (key === "d" && discountRef.current) {
        event.preventDefault();
        discountRef.current();
        return;
      }

      if (key === "l" && inAdmin && !isLoggingOut) {
        event.preventDefault();
        logout();
        return;
      }

      if (event.key === "?" && inAdmin) {
        event.preventDefault();
        router.push("/admin/shortcuts");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pathname, router, logout, isLoggingOut]);

  return (
    <AdminShortcutContext.Provider
      value={{
        registerNewShortcut,
        registerFocusSearchShortcut,
        registerRefreshShortcut,
        registerClearFiltersShortcut,
        registerBackShortcut,
        registerPaymentShortcut,
        registerScholarshipShortcut,
        registerDiscountShortcut,
        registerEscapeShortcut,
      }}
    >
      {children}
    </AdminShortcutContext.Provider>
  );
}

function useAdminShortcut(
  register: ((handler: ShortcutFn) => () => void) | undefined,
  handler: ShortcutFn,
) {
  useEffect(() => {
    if (!register) return;
    return register(handler);
  }, [register, handler]);
}

export function useAdminNewShortcut(toggle: ShortcutFn) {
  const context = useContext(AdminShortcutContext);
  useAdminShortcut(context?.registerNewShortcut, toggle);
}

export function useAdminFocusSearchShortcut(focus: ShortcutFn) {
  const context = useContext(AdminShortcutContext);
  useAdminShortcut(context?.registerFocusSearchShortcut, focus);
}

export function useAdminRefreshShortcut(refresh: ShortcutFn) {
  const context = useContext(AdminShortcutContext);
  useAdminShortcut(context?.registerRefreshShortcut, refresh);
}

export function useAdminClearFiltersShortcut(clear: ShortcutFn) {
  const context = useContext(AdminShortcutContext);
  useAdminShortcut(context?.registerClearFiltersShortcut, clear);
}

export function useAdminBackShortcut(back: ShortcutFn) {
  const context = useContext(AdminShortcutContext);
  useAdminShortcut(context?.registerBackShortcut, back);
}

export function useAdminPaymentShortcut(open: ShortcutFn) {
  const context = useContext(AdminShortcutContext);
  useAdminShortcut(context?.registerPaymentShortcut, open);
}

export function useAdminScholarshipShortcut(open: ShortcutFn) {
  const context = useContext(AdminShortcutContext);
  useAdminShortcut(context?.registerScholarshipShortcut, open);
}

export function useAdminDiscountShortcut(open: ShortcutFn) {
  const context = useContext(AdminShortcutContext);
  useAdminShortcut(context?.registerDiscountShortcut, open);
}

export function useAdminEscapeShortcut(close: ShortcutFn) {
  const context = useContext(AdminShortcutContext);
  useAdminShortcut(context?.registerEscapeShortcut, close);
}
