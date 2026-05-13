"use client";

export function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
          <line x1="12" y1="12" x2="12" y2="16" />
          <line x1="10" y1="14" x2="14" y2="14" />
        </svg>
      </div>
      <h3 className="empty-title">No revenue records</h3>
      <p className="empty-desc">
        No students match the current filter range. Try adjusting the dates.
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

interface ErrorStateProps {
  onRetry?: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="error-state">
      <div className="error-icon">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="error-title">Something went wrong</h3>
      <p className="error-desc">
        We couldn&apos;t load the sales data. Please try again.
      </p>
      {onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          Try again
        </button>
      )}

      <style jsx>{`
        .error-state {
          text-align: center;
          padding: 64px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .error-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #fef2f2;
          color: #b91c1c;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }
        .error-title {
          font-family: var(--font-playfair);
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }
        .error-desc {
          font-family: var(--font-dm-sans);
          font-size: 14px;
          color: #9e9589;
          margin: 0;
          max-width: 320px;
        }
        .retry-btn {
          margin-top: 8px;
          padding: 10px 24px;
          background: #2f4e40;
          color: #fbfaf7;
          border: none;
          border-radius: 8px;
          font-family: var(--font-dm-sans);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .retry-btn:hover {
          background: #3a5a49;
        }
      `}</style>
    </div>
  );
}
