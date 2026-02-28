import React from "react";

export default function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-black/20 p-4 shadow-lg backdrop-blur",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}