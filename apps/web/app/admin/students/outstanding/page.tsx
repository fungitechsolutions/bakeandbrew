export const dynamic = "force-dynamic";
import { Suspense } from "react";
import type { Metadata } from "next";
import { OutstandingStudentsView } from "@/modules/admin/students/outstanding/OutstandingStudentsView";

export const metadata: Metadata = {
  title: "Outstanding Fees | Admin",
  description: "Students with pending fee balances",
};

export default function OutstandingStudentsPage() {
  return (
    <Suspense fallback={<OutstandingPageFallback />}>
      <OutstandingStudentsView />
    </Suspense>
  );
}

function OutstandingPageFallback() {
  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "32px 24px",
      }}
    >
      <div
        style={{
          height: 40,
          width: 260,
          borderRadius: 8,
          background: "#e8e3da",
          marginBottom: 8,
          animation: "pulse 1.5s infinite",
        }}
      />
      <div
        style={{
          height: 20,
          width: 180,
          borderRadius: 6,
          background: "#e8e3da",
          marginBottom: 32,
          opacity: 0.6,
        }}
      />
    </div>
  );
}
