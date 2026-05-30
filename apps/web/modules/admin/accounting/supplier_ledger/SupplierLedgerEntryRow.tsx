import { SupplierLedger } from "./types";

interface SupplierLedgerEntryRowProps {
  entry: SupplierLedger;
  serialNo: number;
  showSupplierColumn?: boolean;
  striped?: boolean;
}

function formatRs(paisa: number) {
  return (paisa / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function SupplierLedgerEntryRow({
  entry,
  serialNo,
  showSupplierColumn = true,
  striped = false,
}: SupplierLedgerEntryRowProps) {
  const isDebit = entry.entryType === "dr";

  return (
    <tr
      className="border-b text-sm transition-colors hover:brightness-[0.97]"
      style={{
        borderColor: "#f0ede7",
        backgroundColor: striped ? "#faf9f6" : "#fff",
        color: "var(--brand-ink)",
      }}
    >
      <td
        className="px-4 py-3 text-center tabular-nums"
        style={{ color: "#9ca3af" }}
      >
        {serialNo}
      </td>
      <td className="px-4 py-3 tabular-nums whitespace-nowrap font-mono text-xs">
        {entry.bsDate}
      </td>
      {showSupplierColumn && (
        <td
          className="px-4 py-3 whitespace-nowrap text-sm font-medium"
          style={{ color: "var(--brand-ink)" }}
        >
          {entry.supplierName}
        </td>
      )}
      <td className="px-4 py-3 text-center">
        <span
          className="inline-block w-6 text-center text-xs font-bold"
          style={{ color: isDebit ? "#dc2626" : "#16a34a" }}
        >
          {isDebit ? "D" : "C"}
        </span>
      </td>
      <td
        className="px-4 py-3 text-right tabular-nums font-mono text-xs whitespace-nowrap"
        style={{ color: isDebit ? "#dc2626" : "#d1d5db" }}
      >
        {isDebit ? formatRs(entry.amount) : "—"}
      </td>
      <td
        className="px-4 py-3 text-right tabular-nums font-mono text-xs whitespace-nowrap"
        style={{ color: !isDebit ? "#16a34a" : "#d1d5db" }}
      >
        {!isDebit ? formatRs(entry.amount) : "—"}
      </td>
      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#4b5563" }}>
        {entry.description ?? <span style={{ color: "#d1d5db" }}>—</span>}
      </td>
      {/* <td className="px-4 py-3 whitespace-nowrap">
        {entry.stockInId ? (
          <span
            className="text-[0.7rem] font-mono px-1.5 py-0.5 rounded border"
            style={{
              color: "#6b7280",
              borderColor: "#e5e0d6",
              backgroundColor: "#f9f7f4",
            }}
          >
            {entry.stockInId.slice(0, 8)}…
          </span>
        ) : (
          <span style={{ color: "#d1d5db" }}>—</span>
        )}
      </td> */}
    </tr>
  );
}
