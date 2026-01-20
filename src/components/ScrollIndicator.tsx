"use client";

import { motion } from "motion/react";

/**
 * ScrollIndicator
 *
 * Bottom-center component with "Explore the Universe" text
 * and animated scroll indicator (bouncing chevron).
 */
export default function ScrollIndicator() {
  return (
    <motion.div
      className="scroll-indicator"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="scroll-indicator-text">Explore the Universe</span>

      <motion.div
        className="scroll-indicator-arrow"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
