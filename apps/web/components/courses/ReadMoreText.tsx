"use client";

import { useState } from "react";

export function ReadMoreText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-8 max-w-lg">
      <p
        className="text-[1rem] leading-[1.75] text-white/60 transition-all duration-300 text-justify"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: expanded ? "unset" : 3,
          overflow: expanded ? "visible" : "hidden",
        }}
      >
        {text}
      </p>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 text-[0.82rem] font-semibold transition-opacity hover:opacity-70"
        style={{ color: "var(--brand-brown, #c28a4f)" }}
      >
        {expanded ? "Show less ↑" : "Read more ↓"}
      </button>
    </div>
  );
}
