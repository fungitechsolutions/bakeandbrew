"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { BaseAPIResponse } from "@repo/types";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth";

export function useLogout() {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<BaseAPIResponse>("/auth/logout");
      return response.data;
    },
    onSuccess: (result) => {
      clearUser();
      toast.success(result.message);
      router.replace("/auth/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
