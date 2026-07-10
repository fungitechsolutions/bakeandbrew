"use client";

import { useEffect } from "react";

import { useSidebar } from "@/components/ui/sidebar";
import { isTypingTarget } from "@/lib/keyboard";

export function AdminSidebarShortcut() {
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      if (event.key === "[") {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  return null;
}
