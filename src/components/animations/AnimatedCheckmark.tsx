"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "./motion-prefs";

export default function AnimatedCheckmark({
  size = 64,
  color = "var(--color-easy)",
}: {
  size?: number;
  color?: string;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className="drop-shadow-[0_0_12px_rgba(74,124,89,0.6)]"
    >
      <motion.circle
        cx="32"
        cy="32"
        r="28"
        stroke={color}
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0.15 : 0.35, ease: "easeOut" }}
      />
      <motion.path
        d="M18 33 L28 43 L46 23"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: reduced ? 0.15 : 0.3,
          delay: reduced ? 0 : 0.25,
          ease: "easeOut",
        }}
      />
    </svg>
  );
}
