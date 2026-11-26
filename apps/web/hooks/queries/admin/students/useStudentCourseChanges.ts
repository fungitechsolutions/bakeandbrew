import { getStudentCourseChanges } from "@/lib/api/students";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useStudentCourseChanges = (studentId: string) => {
  return useQuery({
    queryKey: queryKeys.courseChanges.student(studentId),
    queryFn: () => getStudentCourseChanges(studentId),
    staleTime: 1000 * 60,
  });
};
