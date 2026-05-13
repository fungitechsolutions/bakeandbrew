"use client";

import type { SalesStudent } from "./types/sales";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function PaidBadge({ amount }: { amount: number }) {
  return (
    <span className="badge">
      {formatCurrency(amount)}
      <style jsx>{`
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-family: var(--font-dm-sans);
          font-size: 13px;
          font-weight: 600;
          background: #f0f7f3;
          color: #2f4e40;
        }
      `}</style>
    </span>
  );
}

function OutstandingChip({ amount }: { amount: number }) {
  if (amount <= 0) {
    return (
      <span className="chip chip-clear">
        Cleared
        <style jsx>{`
          .chip {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 3px 10px;
            border-radius: 20px;
            font-family: var(--font-dm-sans);
            font-size: 12px;
            font-weight: 500;
          }
          .chip-clear {
            background: #f0fdf4;
            color: #166534;
          }
        `}</style>
      </span>
    );
  }

  return (
    <span className="chip chip-due">
      {formatCurrency(amount)}
      <style jsx>{`
        .chip {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-family: var(--font-dm-sans);
          font-size: 12px;
          font-weight: 500;
        }
        .chip-due {
          background: #fef2f2;
          color: #b91c1c;
        }
      `}</style>
    </span>
  );
}

export function SalesTableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="skeleton-row">
          <td>
            <div className="skel-cell">
              <div className="skel-avatar" />
              <div className="skel-text-group">
                <div className="skel skel-name" />
                <div className="skel skel-email" />
              </div>
            </div>
          </td>
          <td>
            <div className="skel skel-amount" />
          </td>
          <td>
            <div className="skel skel-badge" />
          </td>
          <td>
            <div className="skel skel-chip" />
          </td>
          <style jsx>{`
            .skeleton-row td {
              padding: 16px 20px;
              border-bottom: 1px solid #f0ede8;
            }
            .skel-cell {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .skel-avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: #e8e3da;
              flex-shrink: 0;
              animation: shimmer 1.5s infinite;
              animation-delay: ${i * 0.07}s;
            }
            .skel-text-group {
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
            .skel {
              background: #e8e3da;
              border-radius: 4px;
              animation: shimmer 1.5s infinite;
              animation-delay: ${i * 0.07}s;
            }
            .skel-name {
              width: 120px;
              height: 14px;
            }
            .skel-email {
              width: 160px;
              height: 12px;
            }
            .skel-amount {
              width: 80px;
              height: 14px;
            }
            .skel-badge {
              width: 90px;
              height: 26px;
              border-radius: 20px;
            }
            .skel-chip {
              width: 70px;
              height: 22px;
              border-radius: 20px;
            }
            @keyframes shimmer {
              0%,
              100% {
                opacity: 1;
              }
              50% {
                opacity: 0.35;
              }
            }
          `}</style>
        </tr>
      ))}
    </>
  );
}

interface SalesTableRowProps {
  student: SalesStudent;
}

export function SalesTableRow({ student }: SalesTableRowProps) {
  const progressPct =
    student.totalCourseFee > 0
      ? Math.min((student.totalPaid / student.totalCourseFee) * 100, 100)
      : 0;

  return (
    <tr className="data-row">
      <td className="cell-student">
        <div className="student-cell">
          <div className="avatar">{getInitials(student.name)}</div>
          <div className="student-info">
            <span className="student-name">{student.name}</span>
            <span className="student-email">{student.email}</span>
          </div>
        </div>
      </td>

      <td className="cell-right">
        <span className="amount-text">
          {formatCurrency(student.totalCourseFee / 100)}
        </span>
      </td>

      <td className="cell-right">
        <div className="paid-group">
          <PaidBadge amount={student.totalPaid / 100} />
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="pct-label">{Math.round(progressPct)}%</span>
        </div>
      </td>

      <td className="cell-right">
        <OutstandingChip amount={student.outstanding / 100} />
      </td>

      <style jsx>{`
        .data-row {
          transition: background 0.12s;
        }
        .data-row:hover {
          background: #f9f7f3;
        }
        .data-row td {
          padding: 16px 20px;
          border-bottom: 1px solid #f0ede8;
          vertical-align: middle;
        }
        .data-row:last-child td {
          border-bottom: none;
        }
        .student-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #2f4e40;
          color: #c28a4f;
          font-family: var(--font-dm-sans);
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          letter-spacing: 0.04em;
        }
        .student-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .student-name {
          font-family: var(--font-dm-sans);
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          white-space: nowrap;
        }
        .student-email {
          font-family: var(--font-dm-sans);
          font-size: 12px;
          color: #9e9589;
        }
        .cell-right {
          text-align: right;
        }
        .amount-text {
          font-family: var(--font-dm-sans);
          font-size: 14px;
          color: #4a4540;
          font-variant-numeric: tabular-nums;
        }
        .paid-group {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
        }
        .progress-bar {
          width: 80px;
          height: 4px;
          background: #e8e3da;
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: #c28a4f;
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        .pct-label {
          font-family: var(--font-dm-sans);
          font-size: 11px;
          color: #9e9589;
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </tr>
  );
}
