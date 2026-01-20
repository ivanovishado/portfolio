"use client";

import { memo } from "react";
import { motion } from "motion/react";
import { tv } from "tailwind-variants";

const galaxyCardStyles = tv({
  base: "galaxy-card relative flex w-full max-w-md flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md",
  variants: {
    side: {
      left: "items-end text-right",
      right: "items-start text-left",
    },
  },
});

interface GalaxyCardProps {
  company: string;
  position: string;
  description: string;
  dateRange: string;
  side: "left" | "right";
  className?: string;
}

const GalaxyCard = memo(function GalaxyCard({
  company,
  position,
  description,
  dateRange,
  side,
  className,
}: GalaxyCardProps) {
  return (
    <motion.div
      className={galaxyCardStyles({ side, className })}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Decorative Gradient Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl">
        <div
          className="galaxy-placeholder absolute top-0 left-0 h-full w-full opacity-20"
          style={{
            background:
              "radial-gradient(circle at center, rgba(120, 119, 198, 0.4) 0%, transparent 70%)",
          }}
        />
      </div>

      <h3 className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
        {company}
      </h3>
      <h4 className="text-xl font-medium text-white/90">{position}</h4>
      <span className="font-mono text-sm tracking-wider text-blue-300">{dateRange}</span>
      <p className="mt-2 max-w-prose leading-relaxed text-gray-300">{description}</p>
    </motion.div>
  );
});

export default GalaxyCard;
