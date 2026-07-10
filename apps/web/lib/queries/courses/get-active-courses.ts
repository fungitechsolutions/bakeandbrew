import { CoursesList } from "@repo/types";
import { getApiUrl } from "@/lib/api-url";

export async function getActiveCourses() {
  const res = await fetch(`${getApiUrl()}/api/v1/courses`, {
    method: "GET",
  });

  const data = (await res.json()) as CoursesList;
  if (!res.ok || !data.success)
    throw new Error(!data.success ? data.message : "Failed to fetch courses");

  return data.data;
}
