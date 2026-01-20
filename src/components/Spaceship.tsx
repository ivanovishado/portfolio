"use client";

import {
  motion,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  MotionValue,
  useVelocity,
  useTransform,
  useScroll,
} from "motion/react";
import Image from "next/image";

interface SpaceshipProps {
  skin?: string;
  /** Orientation mode: 'vertical' for up/down (timeline), 'horizontal' for left/right (projects) */
  orientation?: "vertical" | "horizontal";
  /** External scroll Y value for scroll direction detection */
  scrollY?: MotionValue<number>;
  /** Show progress indicator */
  showProgress?: boolean;
  /** Current progress step */
  progressCurrent?: number | MotionValue<number>;
  /** Total progress steps */
  progressTotal?: number;
  /** Custom class name for positioning */
  className?: string;
}

export default function Spaceship({
  skin = "/assets/spaceship.png",
  orientation = "vertical",
  scrollY: externalScrollY,
  showProgress = false,
  progressCurrent = 1,
  progressTotal = 2,
  className = "",
}: SpaceshipProps) {
  // Always call hooks unconditionally
  const { scrollY: internalScrollY } = useScroll();
  const scrollYToUse = externalScrollY ?? internalScrollY;

  const initialRotation = orientation === "vertical" ? 180 : 90;
  const rotate = useMotionValue(initialRotation);
  const smoothRotate = useSpring(rotate, { damping: 25, stiffness: 350 });

  // Thruster glow intensity based on scroll velocity
  const velocity = useVelocity(scrollYToUse);
  const absVelocity = useTransform(velocity, (v) => Math.abs(v));
  const glowIntensity = useTransform(absVelocity, [0, 500], [0.4, 1]);
  const filterStyle = useTransform(
    glowIntensity,
    (g) => `drop-shadow(0 0 ${15 * g}px rgba(100,200,255,${g}))`,
  );

  useMotionValueEvent(scrollYToUse, "change", (latest) => {
    const previous = scrollYToUse.getPrevious() ?? 0;
    const diff = latest - previous;

    if (orientation === "vertical") {
      // Vertical mode: 0° = up, 180° = down
      if (diff > 0) rotate.set(180);
      else if (diff < 0) rotate.set(0);
    } else {
      // Horizontal mode: 90° = right, 270° = left
      if (diff > 0) rotate.set(90);
      else if (diff < 0) rotate.set(270);
    }
  });

  // Default positioning classes based on orientation
  const defaultPositionClass =
    orientation === "vertical"
      ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      : "relative";

  // Handle progressCurrent which can be number or MotionValue
  const displayProgress = typeof progressCurrent === "number" ? progressCurrent : 1;

  return (
    <div
      className={`pointer-events-none z-50 flex flex-col items-center gap-2 ${className || defaultPositionClass}`}
    >
      {/* Progress Indicator */}
      {showProgress && (
        <div className="rounded border border-cyan-500/50 bg-black/60 px-3 py-1 font-mono text-xs text-cyan-400 backdrop-blur-sm">
          {displayProgress} / {progressTotal}
        </div>
      )}

      {/* Spaceship */}
      <motion.div
        style={{
          rotate: smoothRotate,
          filter: filterStyle,
        }}
        className="relative h-24 w-24 md:h-32 md:w-32"
      >
        <Image src={skin} alt="Spaceship" fill className="object-contain" priority />
      </motion.div>
    </div>
  );
}
