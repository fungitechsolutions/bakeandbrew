import { getApiUrl } from "@/lib/api-url";
import { getAllCookies } from "@/utils/get-all-cookies";
import { StudentDiscountResponse } from "@repo/types";

export async function getStudentDiscount(studentID: string) {
  const res = await fetch(
    `${getApiUrl()}/api/v1/admin/students/${studentID}/discounts`,
    {
      method: "GET",
      headers: {
        Cookie: await getAllCookies(),
      },
    },
  );

  const data = (await res.json()) as StudentDiscountResponse;
  if (!res.ok || !data || !data.success) {
    throw new Error(`${!data.success ? data.message : "Something went wrong"}`);
  }

  return data.data;
}
