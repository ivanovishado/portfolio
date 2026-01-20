"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import ProjectCard from "./ProjectCard";
import Spaceship from "./Spaceship";

const PROJECTS = [
  {
    id: "project-1",
    title: "MCB-1",
    subtitle: "Materials in Microgravity",
    description:
      "A materials science experiment aboard the ISS on the MISSE module. Studied the behavior of materials in microgravity conditions to better understand their properties and behavior in space.",
    image: "/projects/placeholder-1.png",
    link: "#",
  },
  {
    id: "project-2",
    title: "CubeSat Summer School",
    subtitle: "Samara, Russia",
    description:
      "An introductory course to CubeSat design and construction, where I designed a CubeSat for weather monitoring.",
    image: "/projects/placeholder-2.png",
    link: "#",
  },
];

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentProject, setCurrentProject] = useState(1);

  // Track scroll progress through this entire section
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Section heights:
  // - 100vh for warp transition (0-33%)
  // - 100vh per project (33-66%, 66-100%)
  const totalHeight = (PROJECTS.length + 1) * 100; // vh

  // Warp transition progress (0-33% of scroll)
  const warpProgress = useTransform(scrollYProgress, [0, 0.33], [0, 1]);

  // Warp opacity - fade in/out
  const warpOpacity = useTransform(warpProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Blur intensity for placeholder warp effect
  const warpBlur = useTransform(warpProgress, [0, 0.5, 1], [0, 20, 0]);
  const warpBlurPx = useTransform(warpBlur, (v) => `${v}px`);

  // Project 1 visibility (33%-66%)
  const project1Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.55, 0.65], [0, 1, 1, 0]);

  // Project 2 visibility (66%-100%)
  const project2Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.85, 0.95], [0, 1, 1, 0]);

  // Track current project for indicator (using state instead of MotionValue)
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const newProject = progress < 0.5 ? 1 : 2;
    if (newProject !== currentProject) {
      setCurrentProject(newProject);
    }
  });

  // Spaceship X position (10% to 90% of track width)
  // Maps projects progress (33%-100%) to horizontal position
  const projectsProgress = useTransform(scrollYProgress, [0.33, 1], [0, 1]);
  const spaceshipX = useTransform(projectsProgress, [0, 1], ["10%", "90%"]);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="projects-section"
      style={{ height: `${totalHeight}vh` }}
    >
      <div className="projects-sticky">
        {/* Warp Transition Placeholder (blur effect) */}
        <motion.div className="warp-transition" style={{ opacity: warpOpacity }}>
          <motion.div
            className="warp-blur"
            style={{ "--warp-blur": warpBlurPx } as React.CSSProperties}
          />
        </motion.div>

        {/* Project Cards Container */}
        <div className="relative z-10 flex items-center justify-center">
          {/* Project 1 */}
          <motion.div className="absolute" style={{ opacity: project1Opacity }}>
            <ProjectCard project={PROJECTS[0]} />
          </motion.div>

          {/* Project 2 */}
          <motion.div className="absolute" style={{ opacity: project2Opacity }}>
            <ProjectCard project={PROJECTS[1]} />
          </motion.div>
        </div>

        {/* Progress Track (subtle line) */}
        <div className="spaceship-track" aria-hidden="true" />

        {/* Spaceship Indicator */}
        <motion.div className="spaceship-indicator" style={{ x: spaceshipX }}>
          <Spaceship
            scrollY={scrollY}
            orientation="horizontal"
            showProgress
            progressCurrent={currentProject}
            progressTotal={PROJECTS.length}
          />
        </motion.div>
      </div>
    </section>
  );
}
