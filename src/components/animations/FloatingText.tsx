"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "./motion-prefs";

export type FloatingTextItem = {
  id: string;
  text: string;
  color?: string;
};

export default function FloatingText({
  items,
}: {
  items: FloatingTextItem[];
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-visible">
      <AnimatePresence>
        {items.map((item, i) => (
          <motion.span
            key={item.id}
            initial={{ opacity: 0, y: 0, scale: 0.9 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: reduced ? -10 : -90,
              scale: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reduced ? 0.2 : 2.6,
              times: [0, 0.08, 0.85, 1],
              delay: i * 0.35,
              ease: "easeOut",
            }}
            style={{
              color: item.color ?? "var(--color-gold)",
              willChange: "transform, opacity",
            }}
            className="absolute top-2 text-sm font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
          >
            {item.text}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
