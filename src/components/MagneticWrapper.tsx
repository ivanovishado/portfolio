"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, useState, useEffect, type ReactNode, type MouseEvent } from "react";

interface MagneticWrapperProps {
  children: ReactNode;
  /** Strength of magnetic effect (0-1). Default 0.3 */
  strength?: number;
  /** Whether magnetic effect is enabled. Default true */
  enabled?: boolean;
  /** CSS class for wrapper */
  className?: string;
}

/**
 * MagneticWrapper
 *
 * Wraps children with a magnetic cursor-following effect.
 * Element moves slightly toward cursor on hover, snaps back on leave.
 * Uses spring physics for smooth, natural motion.
 *
 * Desktop-only: Disabled on touch devices and when prefers-reduced-motion.
 */
export default function MagneticWrapper({
  children,
  strength = 0.3,
  enabled = true,
  className = "",
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Use lazy initializers for media query state to avoid setState in useEffect
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Motion values for position offset
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth following
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  // Subscribe to media query changes
  useEffect(() => {
    const desktopQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleDesktopChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    const handleReducedMotionChange = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);

    desktopQuery.addEventListener("change", handleDesktopChange);
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      desktopQuery.removeEventListener("change", handleDesktopChange);
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
    };
  }, []);

  const shouldAnimate = enabled && isDesktop && !prefersReducedMotion;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!shouldAnimate || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Distance from center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Move toward cursor with strength multiplier
    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    // Snap back to origin
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        x: shouldAnimate ? springX : 0,
        y: shouldAnimate ? springY : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
