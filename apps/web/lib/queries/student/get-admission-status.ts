import { getAllCookies } from "@/utils/get-all-cookies";

type AdmissionStatusResponse =
  | {
      success: true;
      data:
        | {
            exists: true;
            fullName: string;
            createdAt: Date;
            status: "pending" | "active" | "rejected" | "completed";
          }
        | { exists: false };
    }
  | { success: false; message: string; code: string };
export async function getAdmissionStatus() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/admission/status`,
    {
      method: "GET",
      headers: {
        Cookie: await getAllCookies(),
      },
    },
  );

  const data = (await res.json()) as AdmissionStatusResponse;
  if (!data.success) throw new Error(data.message);
  return data;
}
