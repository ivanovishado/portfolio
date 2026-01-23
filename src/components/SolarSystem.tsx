"use client";

import { motion, useReducedMotion } from "motion/react";
import React from "react";

interface Skill {
  name: string;
  orbitRadius: number;
  speed: number;
}

interface SolarSystemProps {
  name: string;
  color: string;
  skills: Skill[];
}

const OrbitingSkill = ({ skill, color }: { skill: Skill; color: string }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="orbit-ring absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
      style={{
        width: skill.orbitRadius * 2,
        height: skill.orbitRadius * 2,
        left: "50%",
        top: "50%",
      }}
    >
      {/* The Skill Planet */}
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center will-change-transform"
        animate={{
          rotate: shouldReduceMotion ? 0 : 360,
        }}
        transition={{
          duration: skill.speed,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          transformOrigin: `50% ${skill.orbitRadius}px`, // Pivot around center of the ring
        }}
      >
        {/* Planet visual */}
        <div
          className="mb-2 h-4 w-4 rounded-full shadow-[0_0_10px]"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
        {/* Counter-rotate text so it stays upright */}
        <motion.div
          animate={{ rotate: shouldReduceMotion ? 0 : -360 }}
          transition={{
            duration: skill.speed,
            repeat: Infinity,
            ease: "linear",
          }}
          className="whitespace-nowrap text-[10px] font-medium text-white/70"
        >
          {skill.name}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default function SolarSystem({ name, color, skills }: SolarSystemProps) {
  // Determine the largest orbit to size the container
  const maxRadius = Math.max(...skills.map((s) => s.orbitRadius));
  const containerSize = maxRadius * 2 + 40; // Add some padding

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
      className="solar-system relative flex flex-col items-center justify-center perspective-[1000px]"
    >
      {/* Central Star/Category */}
      <motion.div
        className="relative z-10 flex h-24 w-24 cursor-pointer items-center justify-center rounded-full backdrop-blur-sm"
        whileHover={{ scale: 1.1 }}
        animate={{
          boxShadow: [
            `0 0 30px ${color}40, inset 0 0 20px ${color}20`,
            `0 0 50px ${color}60, inset 0 0 30px ${color}40`,
            `0 0 30px ${color}40, inset 0 0 20px ${color}20`,
          ],
        }}
        transition={{
          boxShadow: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
          scale: {
            duration: 0.3,
            ease: "easeOut",
          },
        }}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}20, #000)`,
          border: `1px solid ${color}40`,
        }}
      >
        <h3
          className="text-center font-bold"
          style={{ color: color, textShadow: `0 0 10px ${color}60` }}
        >
          {name}
        </h3>
      </motion.div>

      {/* Orbit Container */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: containerSize,
          height: containerSize,
          transform: "rotateX(75deg)", // Steeper angle for better 3D look
          transformStyle: "preserve-3d",
        }}
      >
        {skills.map((skill) => (
          <OrbitingSkill key={skill.name} skill={skill} color={color} />
        ))}
      </div>
    </motion.div>
  );
}
