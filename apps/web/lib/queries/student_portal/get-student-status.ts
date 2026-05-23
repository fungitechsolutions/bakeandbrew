import { getAllCookies } from "@/utils/get-all-cookies";
import { redirect } from "next/navigation";

type GetStudentStatusResponse =
  | {
      success: true;
      data: {
        status: "active" | "rejected" | "completed" | "pending" | "noStatus";
      };
      message?: string;
      code?: string;
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

  if (data.message && data.code && data.code === "STUDENT_NOT_REGISTERED") {
    const noStdData = {
      status: "noStatus" as Extract<
        GetStudentStatusResponse,
        { success: true }
      >["data"]["status"],
    };
    return noStdData;
  }

  return data.data;
}
