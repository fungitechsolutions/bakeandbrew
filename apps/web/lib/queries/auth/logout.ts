import { getAllCookies } from "@/utils/get-all-cookies";
import { getApiUrl } from "@/lib/api-url";

interface APIResponse {
  success: boolean;
  message: string;
}
export async function Logout(): Promise<APIResponse> {
  const res = await fetch(`${getApiUrl()}/api/v1/logout`, {
    method: "POST",
    headers: {
      Cookie: await getAllCookies(),
    },
  });

  const data = (await res.json()) as APIResponse;
  if (!res.ok) return { success: false, message: "Something went wrong" };

  return data;
}
