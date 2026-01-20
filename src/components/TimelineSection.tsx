"use client";

import { useRef } from "react";
import { useScroll } from "motion/react";
import Spaceship from "./Spaceship";
import CardWrapper from "./TimelineCardWrapper";

const EXPERIENCES = [
  {
    company: "Netflix",
    position: "Software Engineer",
    dateRange: "Apr 2023 - Present",
    description:
      "Building a Digital Asset Management (DAM) System to power up marketing campaigns.",
    side: "left" as const,
  },
  {
    company: "Nubank",
    position: "Senior Software Engineer",
    dateRange: "Aug 2021 - Apr 2023",
    description:
      "Led the design, implementation, and monitoring of distributed microservices that serve millions of users in Mexico.",
    side: "right" as const,
  },
  {
    company: "Wizeline",
    position: "Software Engineer",
    dateRange: "Aug 2018 - Aug 2021",
    description:
      "Worked for multiple clients across a variety of industries, including real estate and entertainment.",
    side: "left" as const,
  },
];

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      id="journey"
      className="timeline-section relative w-full bg-black/50"
      style={{ height: `${(EXPERIENCES.length + 1) * 100}vh` }}
    >
      <div className="timeline-sticky perspective-1000 sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Central Beam */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 bg-linear-to-b from-transparent via-purple-500/50 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.5)]" />

        {/* Spaceship (Center) */}
        <Spaceship scrollY={scrollY} orientation="vertical" />

        {/* Cards Container */}
        <div className="pointer-events-none relative flex h-full w-full max-w-6xl flex-col justify-center px-4 md:px-8">
          {EXPERIENCES.map((exp, index) => (
            <CardWrapper
              key={index}
              index={index}
              total={EXPERIENCES.length}
              progress={scrollYProgress}
              data={exp}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
