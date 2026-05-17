import {
  StudentDetail,
  StudentDiscountResponse,
  StudentEnrolledCourses,
  StudentPaymentDetails,
  StudentScholarshipResponse,
} from "@repo/types";
import { DiscountSection } from "./DiscountSection";
import { ScholarshipSection } from "./ScholarshipSection";
import { MiddleColumn } from "./MiddleColumn";
import { RightColumn } from "./RightColumn";

type Student = Extract<StudentDetail, { success: true }>["data"];
type Course = Extract<
  StudentEnrolledCourses,
  { success: true }
>["data"][number];
type Payment = Extract<
  StudentPaymentDetails,
  { success: true }
>["data"][number];
type Scholarship = Extract<
  StudentScholarshipResponse,
  { success: true }
>["data"];
type Discount = Extract<
  StudentDiscountResponse,
  { success: true }
>["data"][number];

type PaymentRowProps = {
  payment: {
    id: string | number;
    amount: number;
    addedAt: string;
    remarks?: string | null;
    addedByName?: string;
    paymentMode?: string | null;
  };
  student: {
    referenceNo: string;
    fullName: string;
    phone: string;
    fiscalYear: string;
  };
  receiptNo: number;
};

export function StudentDetailGrid({
  student,
  payments,
  courses,
  totalFee,
  setShowPaymentModal,
  PaymentRow,
  scholarship,
  discounts,
}: {
  student: Student;
  payments: Payment[];
  courses: Course[];
  totalFee: number;
  setShowPaymentModal: (v: boolean) => void;
  PaymentRow: React.ComponentType<PaymentRowProps>;
  scholarship: Scholarship;
  discounts: Discount[];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* LEFT — Discounts + Scholarship */}
      <div className="flex flex-col gap-5">
        <DiscountSection discounts={discounts} studentID={student.id} />
        <ScholarshipSection scholarship={scholarship} studentID={student.id} />
      </div>

      {/* MIDDLE — Personal Info + Guardian + Payments */}
      <MiddleColumn
        student={student}
        payments={payments}
        setShowPaymentModal={setShowPaymentModal}
        PaymentRow={PaymentRow}
      />

      {/* RIGHT — Courses + Enrollment + Notes */}
      <RightColumn student={student} courses={courses} totalFee={totalFee} />
    </div>
  );
}

export default StudentDetailGrid;
