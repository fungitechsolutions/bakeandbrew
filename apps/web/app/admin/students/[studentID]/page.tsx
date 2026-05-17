import { getStudentDetails } from "@/lib/queries/admin/students/get-student-detail";
import { getStudentDiscount } from "@/lib/queries/admin/students/get-student-discount";
import { getStudentEnrolledCourses } from "@/lib/queries/admin/students/get-student-enrolled-courses";
import { getStudentPaymentDetails } from "@/lib/queries/admin/students/get-student-payment-details";
import { getStudentScholarship } from "@/lib/queries/admin/students/get-student-scholarship";
import StudentDetailPage from "@/modules/admin/students/detail/StudentDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ studentID: string }>;
}) {
  const { studentID } = await params;
  if (!studentID) {
    return (
      <div>
        <h1>Missing student ID</h1>
      </div>
    );
  }

  const [student, courses, payments, scholarships, discounts] =
    await Promise.all([
      getStudentDetails(studentID),
      getStudentEnrolledCourses(studentID),
      getStudentPaymentDetails(studentID),
      getStudentScholarship(studentID),
      getStudentDiscount(studentID),
    ]);

  return (
    <StudentDetailPage
      student={student}
      courses={courses}
      payments={payments}
      scholarships={scholarships}
      discounts={discounts}
    />
  );
}
