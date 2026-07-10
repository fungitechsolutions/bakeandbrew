import {
  UpdatePasswordInput,
  UpdatePasswordResponse,
  UpdateProfileInput,
  UpdateProfileResponse,
} from "@repo/types";
import api from "../axios";

export const updateProfile = async (
  data: UpdateProfileInput,
): Promise<UpdateProfileResponse> => {
  const res = await api.put<UpdateProfileResponse>(
    "/admin/profile/update-profile",
    data,
  );
  return res.data;
};

export const updatePassword = async (
  data: UpdatePasswordInput,
): Promise<UpdatePasswordResponse> => {
  const res = await api.put<UpdatePasswordResponse>(
    "/admin/profile/update-password",
    data,
  );
  return res.data;
};
