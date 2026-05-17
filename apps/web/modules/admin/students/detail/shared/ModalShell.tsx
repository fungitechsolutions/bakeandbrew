import { Spinner } from "@/components/ui/spinner";

export function ModalShell({
  title,
  icon: Icon,
  onCancel,
  onSubmit,
  submitLabel,
  submitting,
  children,
}: {
  title: string;
  icon: React.ElementType;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  submitting?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
      <div
        className="mx-4 w-full max-w-sm rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#2d4a3e]/08 px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2d4a3e]/08">
            <Icon className="h-4 w-4 text-[#2d4a3e]" strokeWidth={2} />
          </div>
          <h2
            className="text-[0.92rem] font-semibold text-[#2d4a3e]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {title}
          </h2>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-5 py-4">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-[#2d4a3e]/08 px-5 py-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-[#2d4a3e]/12 px-4 py-2 text-[0.82rem] font-medium text-[#2d4a3e]/60 transition-colors hover:bg-[#f4f1ec]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="rounded-xl bg-[#2d4a3e] px-4 py-2 text-[0.82rem] font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {submitting ? (
              <>
                <Spinner />
                Saving…
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
