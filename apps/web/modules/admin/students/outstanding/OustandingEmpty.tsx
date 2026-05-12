"use client";

export function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      </div>
      <h3 className="empty-title">All clear!</h3>
      <p className="empty-desc">
        No students with outstanding fees match your current filters.
      </p>

      <style jsx>{`
        .empty-state {
          text-align: center;
          padding: 64px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #f0f7f3;
          color: #2f4e40;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }
        .empty-title {
          font-family: var(--font-playfair);
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }
        .empty-desc {
          font-family: var(--font-dm-sans);
          font-size: 14px;
          color: #9e9589;
          margin: 0;
          max-width: 300px;
        }
      `}</style>
    </div>
  );
}
