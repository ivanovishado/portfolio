"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import ScrambleText from "@/components/ScrambleText";
import Navbar from "@/components/Navbar";
import SocialButtons from "@/components/SocialButtons";
import ScrollIndicator from "@/components/ScrollIndicator";
import { useMicroGravity } from "@/hooks/useMicroGravity";
import BlackHoleBackground from "@/components/BlackHoleBackground";
import { useBlackHoleSuck } from "@/hooks/useSpaghettification";

/**
 * Hero Section - 200vh tall
 *
 * A cinematic hero section with large typography over a cosmic nebula background.
 * Features a real-time Black Hole simulation. All elements get "sucked" into the
 * center of the screen (the black hole) as the user scrolls.
 */
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  // Scoped Micro-Gravity effect for subtle mouse parallax
  const microGravity = useMicroGravity(containerRef);

  // Black hole suck animations for each element type
  const contentSuck = useBlackHoleSuck(containerRef, "center");
  const socialSuck = useBlackHoleSuck(containerRef, "bottom-left");
  const scrollSuck = useBlackHoleSuck(containerRef, "bottom-center");

  return (
    <section className="hero" ref={containerRef}>
      {/* Cinematic Black Hole Background - fixed at viewport center */}
      <BlackHoleBackground />

      {/* Navigation - NOT animated, stays fixed */}
      <Navbar />

      {/* Hero content - Orbit Container */}
      <motion.div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          width: 0,
          height: 0,
          zIndex: 10,
          rotate: contentSuck.orbitRotation,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Inner Content - Sucks into center */}
        <motion.div
          style={{
            x: contentSuck.x,
            y: contentSuck.y,
            scaleY: contentSuck.scaleY,
            scaleX: contentSuck.scaleX,
            opacity: contentSuck.opacity,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "max-content", // Ensure it doesn't collapse
          }}
        >
          <motion.h1
            className="hero-title"
            style={{
              x: microGravity.x,
              y: microGravity.y,
              rotateX: microGravity.rotateX,
              rotateY: microGravity.rotateY,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            IVAN GALAVIZ
          </motion.h1>

          <motion.div
            className="hero-subtitle"
            initial={{ y: 0 }}
            style={{
              x: microGravity.x,
              y: microGravity.y,
              rotateX: microGravity.rotateX,
              rotateY: microGravity.rotateY,
            }}
          >
            <ScrambleText
              text="SOFTWARE ENGINEER"
              delay={0.8}
              duration={2.0}
              className="font-mono"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Social buttons - Orbit Container */}
      <motion.div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          width: 0,
          height: 0,
          zIndex: 40,
          rotate: socialSuck.orbitRotation,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          style={{
            x: socialSuck.x,
            y: socialSuck.y,
            scaleY: socialSuck.scaleY,
            scaleX: socialSuck.scaleX,
            opacity: socialSuck.opacity,
          }}
        >
          <SocialButtons />
        </motion.div>
      </motion.div>

      {/* Scroll indicator - Orbit Container */}
      <motion.div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          width: 0,
          height: 0,
          zIndex: 20,
          rotate: scrollSuck.orbitRotation,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          style={{
            x: scrollSuck.x,
            y: scrollSuck.y,
            scaleY: scrollSuck.scaleY,
            scaleX: scrollSuck.scaleX,
            opacity: scrollSuck.opacity,
            textAlign: "center",
          }}
        >
          <ScrollIndicator />
        </motion.div>
      </motion.div>
    </section>
  );
}
