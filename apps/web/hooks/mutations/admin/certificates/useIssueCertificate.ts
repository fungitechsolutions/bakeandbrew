import { issueCertificate } from "@/lib/api/certificates";
import { queryKeys } from "@/lib/query-keys";
import {
  APIError,
  IssueCertificateInput,
  IssueCertificateResponse,
} from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useIssueCertificate = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    IssueCertificateResponse,
    AxiosError<APIError>,
    IssueCertificateInput
  >({
    mutationFn: (data) => issueCertificate(studentId, data),
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({
        queryKey: queryKeys.certificates.student(studentId),
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data.message ?? "Failed to issue certificate",
      );
    },
  });
};
