import { BanksClient } from "@/modules/admin/accounting/banks/BanksClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banks — Admin | Bake & Brew Barista Coffee School",
  description: "Manage bank payment accounts for Bake & Brew Academy.",
};

export default function Page() {
  return (
    <main className="max-w-8xl mx-auto px-6 py-8 sm:px-4 sm:py-6">
      <BanksClient />
    </main>
  );
}
