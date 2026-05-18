import { cn } from "@/lib/utils";
import { ArrowUpRight, Hash, Phone } from "lucide-react";
import Link from "next/link";
import { ListStudent } from "@repo/types";

type Status = "pending" | "active" | "completed" | "rejected";

const STATUS_META: Record<
  Status,
  { label: string; dot: string; classes: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
  },
  active: {
    label: "Active",
    dot: "bg-emerald-400",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  completed: {
    label: "Completed",
    dot: "bg-blue-400",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-red-400",
    classes: "bg-red-50 text-red-700 border-red-200",
  },
};

function StatusBadge({ status }: { status: Status }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.06em]",
        meta.classes,
      )}
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
export function StudentCard({
  student,
}: {
  student: Extract<ListStudent, { success: true }>["data"][number];
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden border border-[#2d4a3e]/10 bg-white transition-all duration-200 hover:border-[#2d4a3e]/25 hover:shadow-[0_4px_24px_-4px_rgba(45,74,62,0.12)]">
      {/* Top accent line based on status */}
      <div
        className={cn("h-0.5 w-full", {
          "bg-amber-300": student.status === "pending",
          "bg-emerald-400": student.status === "active",
          "bg-blue-400": student.status === "completed",
          "bg-red-400": student.status === "rejected",
        })}
      />

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-[0.95rem] font-bold leading-snug text-[#2d4a3e]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {student.fullName}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <Hash
                className="h-3 w-3 shrink-0 text-[#2d4a3e]/30"
                strokeWidth={2}
              />
              <span
                className="font-mono text-[0.68rem] text-[#2d4a3e]/40"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {student.referenceNo}
              </span>
            </div>
          </div>
          <StatusBadge status={student.status} />
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#2d4a3e]/06">
              <Phone
                className="h-3.5 w-3.5 text-[#2d4a3e]/40"
                strokeWidth={1.75}
              />
            </div>
            <span
              className="text-[0.82rem] text-[#2d4a3e]/65"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {student.phone}
            </span>
          </div>

          {/* <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#2d4a3e]/06">
              <Wallet className="h-3.5 w-3.5 text-[#2d4a3e]/40" strokeWidth={1.75} />
            </div>
            <span
              className="text-[0.82rem] font-semibold tabular-nums text-[#2d4a3e]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              NPR {(student.claimedAmount / 100).toLocaleString()}
            </span>
          </div> */}
        </div>

        {/* Courses */}
        {student.courses.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {student.courses.map((c) => (
              <span
                key={c}
                className="border border-[#2d4a3e]/12 bg-[#2d4a3e]/04 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[#2d4a3e]/55"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <Link
        href={`/admin/students/${student.id}`}
        className="flex items-center justify-between border-t border-[#2d4a3e]/08 bg-[#2d4a3e]/02 px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-wide text-[#2d4a3e]/50 transition-all hover:bg-[#2d4a3e] hover:text-white"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        View profile
        <ArrowUpRight
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2}
        />
      </Link>
    </div>
  );
}
