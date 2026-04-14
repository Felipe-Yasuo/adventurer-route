"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { usePrefersReducedMotion } from "./motion-prefs";

type Direction = "up" | "left" | "right";

export default function AnimatedCard({
  direction = "up",
  delay = 0,
  layoutId,
  children,
  ...rest
}: {
  direction?: Direction;
  delay?: number;
  layoutId?: string;
} & HTMLMotionProps<"div">) {
  const reduced = usePrefersReducedMotion();

  const offset = reduced
    ? { x: 0, y: 0 }
    : direction === "up"
    ? { x: 0, y: 20 }
    : direction === "left"
    ? { x: -24, y: 0 }
    : { x: 24, y: 0 };

  return (
    <motion.div
      layout
      layoutId={layoutId}
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
      transition={{ duration: reduced ? 0.12 : 0.32, delay, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
