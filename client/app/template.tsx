"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Re-mounts on every navigation, so each page fades in softly.
// Opacity only: a slide/transform would break sticky and fixed elements.
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}