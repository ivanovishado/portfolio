"use client";

import { motion } from "motion/react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  link?: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.article className="project-card">
      {/* Project Image */}
      <div className="project-card__image">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 90vw, 500px"
        />
      </div>

      {/* Title */}
      <h3 className="project-card__title">PROJECT: {project.title}</h3>

      {/* Subtitle / Tech Stack */}
      {project.subtitle && <p className="project-card__subtitle">{project.subtitle}</p>}

      {/* Description */}
      <p className="project-card__description">{project.description}</p>

      {/* CTA Button */}
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card__cta"
        >
          LAUNCH PROJECT
          <span aria-hidden="true">→</span>
        </a>
      )}
    </motion.article>
  );
}
