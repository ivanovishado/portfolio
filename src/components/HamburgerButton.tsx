"use client";

import { motion } from "motion/react";
import MagneticWrapper from "./MagneticWrapper";

interface HamburgerButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  /** Enable magnetic cursor effect (desktop only) */
  enableMagnetic?: boolean;
}

/**
 * Hamburger Button with Morphing X Animation
 *
 * Three lines that smoothly transform into an X when open.
 * Uses spring physics for a premium feel.
 * Optionally wrapped in MagneticWrapper for magnetic cursor effect.
 */
export default function HamburgerButton({
  isOpen,
  onToggle,
  enableMagnetic = false,
}: HamburgerButtonProps) {
  // Spring config for smooth, bouncy animation
  const springConfig = { type: "spring" as const, stiffness: 300, damping: 25 };

  const button = (
    <button
      className="hamburger-btn"
      onClick={onToggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      {/* Top line - rotates to form top arm of X */}
      <motion.span
        className="hamburger-line"
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 8 : 0,
        }}
        transition={springConfig}
      />

      {/* Middle line - fades out */}
      <motion.span
        className="hamburger-line"
        animate={{
          opacity: isOpen ? 0 : 1,
          scaleX: isOpen ? 0 : 1,
        }}
        transition={springConfig}
      />

      {/* Bottom line - rotates to form bottom arm of X */}
      <motion.span
        className="hamburger-line"
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? -8 : 0,
        }}
        transition={springConfig}
      />
    </button>
  );

  if (enableMagnetic) {
    return <MagneticWrapper strength={0.35}>{button}</MagneticWrapper>;
  }

  return button;
}
