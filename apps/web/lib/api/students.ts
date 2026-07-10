import {
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
