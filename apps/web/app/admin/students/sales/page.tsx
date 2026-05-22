import type { Metadata } from "next";

import { SalesRevenueView } from "@/modules/admin/students/sales/SalesRevenueView";

export const metadata: Metadata = {
  title: "Sales Revenue | Admin",
  description: "Fee collections across all active students",
};

export default function SalesRevenuePage() {
  return <SalesRevenueView />;
}
