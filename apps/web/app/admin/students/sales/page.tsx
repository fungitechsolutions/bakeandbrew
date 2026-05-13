import { Suspense } from "react";
import type { Metadata } from "next";

import { SalesRevenueView } from "@/modules/admin/students/sales/SalesRevenueView";

export const metadata: Metadata = {
  title: "Sales Revenue | Admin",
  description: "Fee collections across all active students",
};

export const dynamic = "force-dynamic";

export default function SalesRevenuePage() {
  return (
    <Suspense fallback={<SalesPageFallback />}>
      <SalesRevenueView />
    </Suspense>
  );
}

function SalesPageFallback() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <div
        style={{
          height: 40,
          width: 240,
          borderRadius: 8,
          background: "#e8e3da",
          marginBottom: 8,
          animation: "pulse 1.5s infinite",
        }}
      />
      <div
        style={{
          height: 20,
          width: 200,
          borderRadius: 6,
          background: "#e8e3da",
          marginBottom: 32,
          opacity: 0.6,
        }}
      />
    </div>
  );
}
