import { env } from "@/utils/env";
import { getAllCookies } from "@/utils/get-all-cookies";
import { StudentScholarshipResponse } from "@repo/types";

export async function getStudentScholarship(studentID: string) {
  const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/api/v1/admin/students/${studentID}/scholarships`,
    {
      method: "GET",
      headers: {
        Cookie: await getAllCookies(),
      },
    },
  );

  const data = (await res.json()) as StudentScholarshipResponse;
  if (!res.ok || !data || !data.success) {
    throw new Error(`${!data.success ? data.message : "Something went wrong"}`);
  }

  return data.data;
}
