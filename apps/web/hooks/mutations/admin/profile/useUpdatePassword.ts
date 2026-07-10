import { updatePassword } from "@/lib/api/profile";
import { APIError, UpdatePasswordInput, UpdatePasswordResponse } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useUpdatePassword = () => {
  return useMutation<
    UpdatePasswordResponse,
    AxiosError<APIError>,
    UpdatePasswordInput
  >({
    mutationFn: updatePassword,
    onSuccess: (result) => {
      toast.success(result.message);
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Something went wrong");
    },
  });
};
