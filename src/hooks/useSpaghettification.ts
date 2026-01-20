import { useScroll, useTransform, useMotionTemplate, MotionValue } from "motion/react";

interface SuckAnimation {
  x: MotionValue<string>;
  y: MotionValue<string>;
  scale: MotionValue<number>;
  scaleY: MotionValue<number>;
  scaleX: MotionValue<number>;
  opacity: MotionValue<number>;
  orbitRotation: MotionValue<number>;
}

type ElementPosition = "center" | "bottom-left" | "bottom-center";

/**
 * Hook that animates elements toward the fixed viewport center (50vw, 50vh)
 * where the black hole is located.
 */
export function useBlackHoleSuck(
  containerRef: React.RefObject<HTMLElement | null>,
  position: ElementPosition,
): SuckAnimation {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Animation timing
  // Animation timing
  // Start immediately (0.0) so it feels responsive to the first pixel of scroll
  const startProgress = 0.0;
  const midProgress = 0.3;
  const endProgress = 0.7;

  // Starting and ending positions for each element type
  const getConfig = (pos: ElementPosition) => {
    switch (pos) {
      case "center":
        // Title/subtitle: starts at center (offset 0,0)
        return {
          startXOffset: "0px",
          startYOffset: "0px",
        };
      case "bottom-left":
        // Social buttons: Left aligned
        // Desktop: 2rem margin + center offset
        // Mobile: 1rem margin + center offset
        // We use a safe clamp or just a tighter average.
        // Let's use 2.5rem (1rem margin + 1.5rem width) to hug the left edge more on mobile.
        return {
          startXOffset: "calc(2.5rem - 50vw)",
          startYOffset: "calc(50vh - 8rem)",
        };
      case "bottom-center":
        // Scroll indicator: Bottom aligned (2rem)
        // X: 0 (Centered)
        // Y: 50vh (bottom) - 2rem (margin) - 2rem (half height approx)
        return {
          startXOffset: "0px",
          startYOffset: "calc(50vh - 4rem)",
        };
      default:
        return {
          startXOffset: "0px",
          startYOffset: "0px",
        };
    }
  };

  const { startXOffset, startYOffset } = getConfig(position);

  // Suck Factor: 1 (at start position) -> 0 (at center/black hole)
  const suckFactor = useTransform(scrollYProgress, [startProgress, endProgress], [1, 0]);

  // Use templates to multiply the offset by the suck factor
  // This handles mixed units (calc, vh, vw, px) correctly
  const x = useMotionTemplate`calc((${startXOffset}) * ${suckFactor})`;
  const y = useMotionTemplate`calc((${startYOffset}) * ${suckFactor})`;

  // Orbit Rotation - rotates the container frame around the black hole (center)
  // Accelerating Spiral: Moves slowly at first, then whips around fast (conservation of angular momentum)
  const orbitRotation = useTransform(
    scrollYProgress,
    [startProgress, midProgress, endProgress],
    [0, 45, 360],
  );

  // Spaghettification
  const scaleY = useTransform(
    scrollYProgress,
    [startProgress, midProgress, endProgress],
    [1, 2.5, 0],
  );
  const scaleX = useTransform(
    scrollYProgress,
    [startProgress, midProgress, endProgress],
    [1, 0.3, 0],
  );

  const scale = useTransform(scrollYProgress, [startProgress, endProgress], [1, 0]);
  const opacity = useTransform(scrollYProgress, [startProgress, endProgress - 0.1], [1, 0]);

  return { x, y, scale, scaleY, scaleX, opacity, orbitRotation };
}
