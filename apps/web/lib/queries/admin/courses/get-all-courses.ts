import { getApiUrl } from "@/lib/api-url";
import { getAllCookies } from "@/utils/get-all-cookies";
import { CoursesListResponse } from "@repo/types";

export async function GetAllCourses() {
  const res = await fetch(`${getApiUrl()}/api/v1/admin/courses`, {
    method: "GET",
    headers: {
      Cookie: await getAllCookies(),
    },
  });

  const data = (await res.json()) as CoursesListResponse;

  if (!res.ok || !data || !data.success)
    throw new Error(!data.success ? data.message : "Something went wrong");

  return data.data;
}
