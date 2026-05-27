"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCw, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  fetchAccountLedgerEntries,
  fetchBankAccounts,
  computeSummary,
} from "./mock-data";
import type {
  BankAccount,
  LedgerEntryWithAccount,
  LedgerSummary,
} from "./ledger";
import { LedgerPageHeader } from "./LedgerPageHeader";
import { LedgerSummaryCards } from "./LedgerSummaryCard";
import { LedgerTable } from "./LedgerTable";
import { CreateLedgerEntryForm } from "./CreateLedgerEntryForm";
import { Toaster } from "sonner";

interface PageProps {
  params: {
    bankId: string;
    accountId: string;
  };
}

export default function AccountLedgerPage({ params }: PageProps) {
  const { bankId, accountId } = params;

  const [entries, setEntries] = useState<LedgerEntryWithAccount[]>([]);
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [allAccounts, setAllAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [result, allAccs] = await Promise.all([
        fetchAccountLedgerEntries(bankId, accountId),
        fetchBankAccounts(),
      ]);
      setEntries(result.entries);
      setAccount(result.account);
      setAllAccounts(allAccs);
    } catch {
      setError("Failed to load account ledger. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [bankId, accountId]);

  useEffect(() => {
    setTimeout(() => {
      loadData();
    }, 0);
  }, [loadData]);

  const summary = useMemo<LedgerSummary>(
    () => computeSummary(entries),
    [entries],
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle size={32} style={{ color: "#dc2626" }} />
        <p
          className="text-sm font-medium"
          style={{ color: "var(--brand-ink)" }}
        >
          {error}
        </p>
        <Button variant="outline" onClick={loadData} className="gap-2">
          <RefreshCw size={14} />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-8 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--brand-cream)" }}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Account identity banner */}
        <div
          className="rounded-xl border p-5 flex items-start gap-4"
          style={{
            backgroundColor: "var(--brand-green)",
            borderColor: "var(--brand-green-2)",
          }}
        >
          <div
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <Building2 size={20} style={{ color: "var(--brand-cream)" }} />
          </div>
          <div>
            {loading ? (
              <>
                <Skeleton
                  className="h-5 w-48 mb-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                />
                <Skeleton
                  className="h-3.5 w-64"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                />
              </>
            ) : (
              <>
                <p
                  className="font-semibold text-base"
                  style={{ color: "var(--brand-cream)" }}
                >
                  {account?.accountName}
                </p>
                <p
                  className="text-sm mt-0.5"
                  style={{ color: "rgba(251,250,247,0.7)" }}
                >
                  {account?.bankName}
                  {account?.accountNumber ? ` · ${account.accountNumber}` : ""}
                  {account?.isDefault ? " · Default Account" : ""}
                </p>
              </>
            )}
          </div>
        </div>

        <LedgerPageHeader
          title="Account Ledger"
          subtitle="All transactions for this bank account"
          onCreateEntry={() => setFormOpen(true)}
        />

        <LedgerSummaryCards
          summary={loading ? null : summary}
          loading={loading}
        />

        <LedgerTable
          entries={entries}
          loading={loading}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onCreateEntry={() => setFormOpen(true)}
          showBankColumns={false}
        />
      </div>

      <CreateLedgerEntryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        accounts={allAccounts}
        defaultAccountId={accountId}
        onSuccess={loadData}
      />

      <Toaster />
    </div>
  );
}
