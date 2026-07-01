import { redirect } from "next/navigation";

export default function LegacyBankAccountsRedirect() {
  redirect("/admin/banks/accounts");
}
