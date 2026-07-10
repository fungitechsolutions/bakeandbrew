"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useAdminQueryRefresh } from "./useAdminQueryRefresh";

/** Refresh hook for server-fetched pages. Wraps router.refresh in startTransition so it is safe from global keyboard shortcuts. */
export function useAdminRouterRefresh() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const refreshPage = useCallback(
    () =>
      new Promise<void>((resolve) => {
        startTransition(() => {
          router.refresh();
          resolve();
        });
      }),
    [router, startTransition],
  );

  return useAdminQueryRefresh(refreshPage);
}
