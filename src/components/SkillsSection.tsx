"use client";

import SolarSystem from "./SolarSystem";

const SKILL_SYSTEMS = [
  {
    name: "Frontend",
    color: "#0ea5e9", // Sky blue
    skills: [
      { name: "React", orbitRadius: 60, speed: 10 },
      { name: "Next.js", orbitRadius: 80, speed: 15 },
      { name: "Tailwind", orbitRadius: 100, speed: 12 },
      { name: "TypeScript", orbitRadius: 120, speed: 18 },
      { name: "Motion", orbitRadius: 140, speed: 20 },
    ],
  },
  {
    name: "Backend",
    color: "#a855f7", // Purple
    skills: [
      { name: "Node.js", orbitRadius: 70, speed: 12 },
      { name: "PostgreSQL", orbitRadius: 90, speed: 16 },
      { name: "Python", orbitRadius: 110, speed: 22 },
      { name: "API Design", orbitRadius: 130, speed: 25 },
    ],
  },
  {
    name: "Core",
    color: "#f59e0b", // Amber
    skills: [
      { name: "Git", orbitRadius: 60, speed: 14 },
      { name: "Testing", orbitRadius: 80, speed: 18 },
      { name: "CI/CD", orbitRadius: 100, speed: 22 },
      { name: "Architecture", orbitRadius: 120, speed: 28 },
    ],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="relative min-h-screen overflow-hidden py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center font-headline text-4xl font-bold md:text-6xl">
          Tech Universe
        </h2>
        <div className="grid grid-cols-1 items-center justify-items-center gap-24 md:grid-cols-3 md:gap-4">
          {SKILL_SYSTEMS.map((system) => (
            <SolarSystem key={system.name} {...system} />
          ))}
        </div>
      </div>
    </section>
  );
}
