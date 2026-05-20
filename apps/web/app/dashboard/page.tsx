import { Suspense } from "react";
import Link from "next/link";
import { UserCircle2 } from "lucide-react";
import { StudentDashboardData } from "@/components/student/dashboard/types/dashboard";
import { mockStudent } from "@/components/student/dashboard/mock-data";
import { StudentHero } from "@/components/student/dashboard/StudentHero";
import { FinancialSummary } from "@/components/student/dashboard/FinancialSummary";
import { EnrolledCourses } from "@/components/student/dashboard/EnrolledCourses";
import { siteInfo } from "@/utils/site-info";
import { PaymentHistory } from "@/components/student/dashboard/PaymentHistory";
import { DashboardSkeleton } from "@/components/student/dashboard/DashboardSkeleton";

async function getStudentDashboard(): Promise<StudentDashboardData> {
  return mockStudent;
}

async function DashboardContent() {
  const student = await getStudentDashboard();

  return (
    <div className="space-y-8auto">
      {/* Profile hero */}
      <StudentHero student={student} />

      {/* Financial summary */}
      <FinancialSummary
        courses={student.enrolledCourses}
        payments={student.payments}
      />

      {/* Courses + side info row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <EnrolledCourses courses={student.enrolledCourses} />

        {/* Quick links / contact card */}
        <aside>
          <h2
            className="text-base font-semibold text-[#1a1a1a] mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Need Help?
          </h2>
          <div className="rounded-xl border border-[#1a1a1a]/8 bg-white p-5 space-y-4">
            <div>
              <p className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest font-medium mb-0.5">
                School Contact
              </p>
              <p className="text-sm font-medium text-[#1a1a1a]">
                {siteInfo.contact.phone}
              </p>
              <p className="text-sm text-[#1a1a1a]/60">
                {siteInfo.contact.email}
              </p>
            </div>
            <div className="h-px bg-[#1a1a1a]/6" />
            <div>
              <p className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest font-medium mb-0.5">
                Office Hours
              </p>
              <p className="text-sm text-[#1a1a1a]/70">
                {siteInfo.contact.officeHours}
              </p>
            </div>
            <div className="h-px bg-[#1a1a1a]/6" />
            <div>
              <p className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest font-medium mb-0.5">
                Address
              </p>
              <p className="text-sm text-[#1a1a1a]/70">
                {siteInfo.contact.address}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Full-width payment history */}
      <PaymentHistory payments={student.payments} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------
export default function DashboardPage() {
  return (
    <div
      className="min-h-screen "
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-bold text-[#1a1a1a] leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Student Dashboard
            </h1>
            <p className="text-sm text-[#1a1a1a]/45 mt-1">
              {siteInfo.company.name}
            </p>
          </div>

          {/* Profile shortcut */}
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2f4e40] hover:text-[#c28a4f] bg-white border border-[#1a1a1a]/10 hover:border-[#c28a4f]/30 px-3.5 py-2 rounded-xl transition-all duration-200 hover:shadow-sm"
          >
            <UserCircle2 size={16} />
            <span className="hidden sm:inline">Edit Profile</span>
          </Link>
        </header>

        {/* Main content wrapped in Suspense for server-side streaming */}
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>

        {/* Footer note */}
        <footer className="mt-12 pt-6 border-t border-[#1a1a1a]/6 text-center">
          <p className="text-xs text-[#1a1a1a]/30">
            {siteInfo.company.name} &nbsp;·&nbsp; PAN {siteInfo.company.panNo}
          </p>
        </footer>
      </div>
    </div>
  );
}
