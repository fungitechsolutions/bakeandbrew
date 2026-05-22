import { getStudentStatus } from "@/lib/queries/student_portal/get-student-status";
import { redirect } from "next/navigation";

type StudentStatus = "active" | "completed" | "pending" | "rejected";

export function redirectByStudentStatus(status: StudentStatus) {
  switch (status) {
    case "active":
    case "completed":
      redirect("/dashboard");

    case "pending":
      redirect("/dashboard/pending");

    case "rejected":
      redirect("/dashboard/rejected");

    default:
      redirect("/");
  }
}

export async function requireStudentStatus(allowedStatuses: StudentStatus[]) {
  const { status } = await getStudentStatus();

  if (!allowedStatuses.includes(status)) {
    redirectByStudentStatus(status);
  }

  return status;
}
