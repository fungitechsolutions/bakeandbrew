import { updateProfile } from "@/lib/api/profile";
import { useAuthStore } from "@/store/auth";
import {
  APIError,
  JWTUser,
  UpdateProfileInput,
  UpdateProfileResponse,
} from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useUpdateProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<
    UpdateProfileResponse,
    AxiosError<APIError>,
    UpdateProfileInput
  >({
    mutationFn: updateProfile,
    onSuccess: (result) => {
      toast.success(result.message);
      const updated = result.data;
      setUser({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role as JWTUser["role"],
        imageUrl: updated.imageUrl ?? undefined,
      });
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Something went wrong");
    },
  });
};
