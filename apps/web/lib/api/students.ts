import {
  StudentCourseChanges,
  UpdateStudentImageInput,
  UpdateStudentImageResponse,
} from "@repo/types";
import api from "../axios";

export const updateStudentImage = async (
  studentId: string,
  data: UpdateStudentImageInput,
): Promise<UpdateStudentImageResponse> => {
  const res = await api.put<UpdateStudentImageResponse>(
    `/admin/students/${studentId}/image`,
    data,
  );
  return res.data;
};

export const getStudentCourseChanges = async (
  studentId: string,
): Promise<StudentCourseChanges> => {
  const res = await api.get<StudentCourseChanges>(
    `/admin/students/${studentId}/course-changes`,
  );
  return res.data;
};
