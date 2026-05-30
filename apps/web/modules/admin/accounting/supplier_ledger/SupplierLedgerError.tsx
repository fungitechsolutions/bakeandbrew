import { AlertCircle, RefreshCw } from "lucide-react";

interface SupplierLedgerErrorProps {
  message: string;
  onRetry: () => void;
}

export function SupplierLedgerError({
  message,
  onRetry,
}: SupplierLedgerErrorProps) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 px-6 py-14 flex flex-col items-center gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <AlertCircle size={22} className="text-red-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-red-700">
          Failed to load ledger
        </p>
        <p className="mt-1 text-xs text-red-400">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 bg-white text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
      >
        <RefreshCw size={13} />
        Try again
      </button>
    </div>
  );
}
