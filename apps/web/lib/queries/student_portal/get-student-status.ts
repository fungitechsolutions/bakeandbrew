import { getAllCookies } from "@/utils/get-all-cookies";

type GetStudentStatusResponse =
  | {
      success: true;
      data: { status: "active" | "rejected" | "completed" | "pending" };
    }
  | { success: false; message: string; code: string };

export async function getStudentStatus() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/portal/student/status`,
    {
      method: "GET",
      headers: {
        Cookie: await getAllCookies(),
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch student status");
  }

  const data = (await res.json()) as GetStudentStatusResponse;

  if (!data.success) throw new Error(data.message);

  return data.data;
}
