import type { ReactNode } from "react";
import { landingCardClass } from "./landing-styles";
import {
  getLandingCardPattern,
  type LandingCardPatternTone,
} from "./landing-card-patterns";
import { cn } from "@/lib/utils";

export function LandingPatternCard({
  tone,
  index = 0,
  className,
  children,
}: {
  tone: LandingCardPatternTone;
  index?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={cn(
        landingCardClass,
        "group relative overflow-hidden bg-white",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={getLandingCardPattern(tone, index)}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-white/55 transition-colors duration-300 group-hover:bg-white/45"
        aria-hidden
      />
      <div className="relative z-[1]">{children}</div>
    </article>
  );
}
