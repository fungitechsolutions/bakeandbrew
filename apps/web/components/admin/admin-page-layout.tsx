import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminPageLayoutProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  maxWidth?: "default" | "wide";
};

export function AdminPageLayout({
  title,
  description,
  action,
  children,
  maxWidth = "default",
}: AdminPageLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-(--brand-cream) px-4 py-8 sm:px-6 lg:px-8">
      <div
        className={cn(
          "mx-auto",
          maxWidth === "wide" ? "max-w-8xl" : "max-w-7xl",
        )}
      >
        <div className="mb-8 flex flex-col gap-4 border-b border-[rgba(47,78,64,0.12)] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="font-(family-name:--font-dm-sans) text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgba(47,78,64,0.45)]">
              Admin
            </p>
            <h1 className="font-(family-name:--font-lora) text-[1.75rem] font-bold tracking-tight text-(--brand-green)">
              {title}
            </h1>
            {description && (
              <p className="max-w-2xl font-(family-name:--font-dm-sans) text-sm text-[rgba(47,78,64,0.55)]">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}
