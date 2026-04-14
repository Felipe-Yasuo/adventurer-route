"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "./motion-prefs";

export default function GoldParticles({
  active,
  count = 14,
}: {
  active: boolean;
  count?: number;
}) {
  const reduced = usePrefersReducedMotion();

  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        dx: (Math.random() - 0.5) * 120,
        dy: -40 - Math.random() * 80,
        delay: Math.random() * 0.15,
        size: 4 + Math.random() * 5,
      })),
    [count, active]
  );

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
      <AnimatePresence>
        {active &&
          particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: p.dx,
                y: p.dy,
                scale: [0.4, 1, 1, 0.6],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.9,
                delay: p.delay,
                ease: "easeOut",
                times: [0, 0.25, 0.7, 1],
              }}
              style={{
                width: p.size,
                height: p.size,
                background: "var(--color-gold)",
                boxShadow: "0 0 8px var(--color-gold)",
                willChange: "transform, opacity",
              }}
              className="absolute rounded-full"
            />
          ))}
      </AnimatePresence>
    </div>
  );
}
