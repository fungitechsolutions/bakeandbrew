import { getStudentCertificate } from "@/lib/api/certificates";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useStudentCertificate = (
  studentId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.certificates.student(studentId),
    queryFn: () => getStudentCertificate(studentId),
    enabled,
    staleTime: 1000 * 60,
  });
};
