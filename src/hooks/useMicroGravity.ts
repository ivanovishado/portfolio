import { useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useCallback } from "react";

interface GravityOptions {
  damping?: number;
  stiffness?: number;
}

export function useMicroGravity(
  containerRef: React.RefObject<HTMLElement | null>,
  options: GravityOptions = {},
) {
  const { damping = 20, stiffness = 150 } = options;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the movement
  const springX = useSpring(mouseX, { damping, stiffness });
  const springY = useSpring(mouseY, { damping, stiffness });

  // Transforms for the "bowing" effect
  // We use rotate to simulate a 3D tilt towards the mouse
  const rotateX = useTransform(springY, [-100, 100], [10, -10]);
  const rotateY = useTransform(springX, [-100, 100], [-10, 10]);

  // Translation for subtle "pull"
  const x = useTransform(springX, [-500, 500], [-20, 20]);
  const y = useTransform(springY, [-500, 500], [-20, 20]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Relative distance from center
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    },
    [containerRef, mouseX, mouseY],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return { x, y, rotateX, rotateY };
}
