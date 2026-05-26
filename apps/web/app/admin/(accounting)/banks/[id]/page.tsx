import { BankAccountsClient } from "@/modules/admin/accounting/bank-accounts/BankAccountsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bank Accounts — Admin | Bake & Brew Barista Coffee School",
  description:
    "Manage bank accounts linked to payment banks for Bake & Brew Academy.",
};

export default function BankAccountsPage() {
  return (
    <main className="max-w-8xl mx-auto px-6 py-8 sm:px-4 sm:py-6">
      <BankAccountsClient />
    </main>
  );
}
