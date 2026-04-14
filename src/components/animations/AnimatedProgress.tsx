"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "./motion-prefs";

export default function AnimatedProgress({
  value,
  className,
  trackClassName,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={[
        "h-3 overflow-hidden rounded-full bg-(--color-bg) border border-(--color-border)",
        trackClassName ?? "",
      ].join(" ")}
    >
      <motion.div
        initial={{ width: reduced ? `${clamped}%` : 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{
          duration: reduced ? 0 : 0.6,
          ease: "easeOut",
        }}
        style={{ willChange: "width" }}
        className={[
          "h-full bg-(--color-gold)",
          className ?? "",
        ].join(" ")}
      />
    </div>
  );
}
