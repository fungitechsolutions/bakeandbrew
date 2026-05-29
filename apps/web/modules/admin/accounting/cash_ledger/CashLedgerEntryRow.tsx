import { CashLedger } from "@repo/types";

interface CashLedgerEntryRowProps {
  entry: CashLedger;
  serialNo: number;
  striped?: boolean;
}

function formatRs(paisa: number) {
  return (paisa / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function CashLedgerEntryRow({
  entry,
  serialNo,
  striped = false,
}: CashLedgerEntryRowProps) {
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
      {/* S.No */}
      <td
        className="px-4 py-3 text-center tabular-nums"
        style={{ color: "#9ca3af" }}
      >
        {serialNo}
      </td>

      {/* BS Date */}
      <td className="px-4 py-3 tabular-nums whitespace-nowrap font-mono text-xs">
        {entry.bsDate}
      </td>

      {/* D/C badge */}
      <td className="px-4 py-3 text-center">
        <span
          className="inline-block w-6 text-center text-xs font-bold"
          style={{ color: isDebit ? "#dc2626" : "#16a34a" }}
        >
          {isDebit ? "D" : "C"}
        </span>
      </td>

      {/* Debit */}
      <td
        className="px-4 py-3 text-right tabular-nums font-mono text-xs whitespace-nowrap"
        style={{ color: isDebit ? "#dc2626" : "#d1d5db" }}
      >
        {isDebit ? formatRs(entry.amount) : "—"}
      </td>

      {/* Credit */}
      <td
        className="px-4 py-3 text-right tabular-nums font-mono text-xs whitespace-nowrap"
        style={{ color: !isDebit ? "#16a34a" : "#d1d5db" }}
      >
        {!isDebit ? formatRs(entry.amount) : "—"}
      </td>

      {/* Narration */}
      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#4b5563" }}>
        {entry.description ?? <span style={{ color: "#d1d5db" }}>—</span>}
      </td>
    </tr>
  );
}
