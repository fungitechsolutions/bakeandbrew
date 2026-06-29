import { updateStudentImage } from "@/lib/api/students";
import {
  APIError,
  UpdateStudentImageInput,
  UpdateStudentImageResponse,
} from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useUpdateStudentImage = (studentId: string) => {
  return useMutation<
    UpdateStudentImageResponse,
    AxiosError<APIError>,
    UpdateStudentImageInput
  >({
    mutationFn: (data) => updateStudentImage(studentId, data),
    onSuccess: (result) => {
      toast.success(result.message);
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Something went wrong");
    },
  });
};
