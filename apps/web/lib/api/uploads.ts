import { ImageUploadResponse } from "@repo/types";
import api from "../axios";

export const uploadImage = async (data: FormData): Promise<ImageUploadResponse> => {
  const res = await api.post<ImageUploadResponse>("/uploads", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
