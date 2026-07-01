"use client";

import { useCallback } from "react";
import { toast } from "sonner";

type RefetchFn = () => Promise<unknown>;

/** Minimum gap between manual refreshes (R shortcut) across the admin panel. */
export const ADMIN_REFRESH_COOLDOWN_MS = 5000;

let lastRefreshAt = 0;
let refreshInFlight = false;

export function useAdminQueryRefresh(refetch: RefetchFn) {
  return useCallback(() => {
    const now = Date.now();
    const elapsed = now - lastRefreshAt;

    if (refreshInFlight) {
      toast.info("Refresh already in progress");
      return;
    }

    if (elapsed < ADMIN_REFRESH_COOLDOWN_MS) {
      const waitSec = Math.ceil((ADMIN_REFRESH_COOLDOWN_MS - elapsed) / 1000);
      toast.message(`Please wait ${waitSec}s before refreshing again`);
      return;
    }

    lastRefreshAt = now;
    refreshInFlight = true;

    void toast
      .promise(refetch(), {
        loading: "Refreshing…",
        success: "Data updated",
        error: "Couldn't refresh data",
      })
      .unwrap()
      .finally(() => {
        refreshInFlight = false;
      });
  }, [refetch]);
}
