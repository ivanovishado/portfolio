"use client";

import { memo } from "react";
import { motion, useTransform, MotionValue } from "motion/react";
import GalaxyCard from "./GalaxyCard";

interface ExperienceData {
  company: string;
  position: string;
  description: string;
  dateRange: string;
  side: "left" | "right";
}

interface CardWrapperProps {
  index: number;
  total: number;
  progress: MotionValue<number>;
  data: ExperienceData;
}

const CardWrapper = memo(function CardWrapper({ index, total, progress, data }: CardWrapperProps) {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;
  const center = start + segment / 2;

  const opacity = useTransform(progress, [start, center - 0.1, center + 0.1, end], [0, 1, 1, 0]);

  const y = useTransform(progress, [start, end], [500, -500]);

  const scale = useTransform(progress, [start, center, end], [0.8, 1, 0.8]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={`pointer-events-auto absolute top-1/2 flex -translate-y-1/2 ${
        data.side === "left"
          ? "right-1/2 left-0 justify-end pr-12 md:pr-20"
          : "right-0 left-1/2 justify-start pl-12 md:pl-20"
      }`}
    >
      <GalaxyCard {...data} />
    </motion.div>
  );
});

export default CardWrapper;
