"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Canvas } from "@react-three/fiber";
import BlackHoleScene from "./BlackHoleScene";

/**
 * Black Hole Background
 *
 * Fixed position with 100vh height to maintain correct sizing.
 * Stays centered in viewport during hero section, then fades out
 * as user scrolls past the hero.
 */
export default function BlackHoleBackground() {
  const { scrollYProgress } = useScroll();

  // Fade out the black hole as user leaves hero section
  // Hero is 150vh, animation ends at 70% of scroll.
  // Start fading out after animation completes (0.7)
  const opacity = useTransform(scrollYProgress, [0.7, 0.9], [1, 0]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-full bg-black"
      style={{ opacity }}
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <BlackHoleScene />
      </Canvas>
    </motion.div>
  );
}
