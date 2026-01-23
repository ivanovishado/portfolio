import Hero from "@/components/Hero";
import ProjectsSection from "@/components/ProjectsSection";
import TimelineSection from "@/components/TimelineSection";
import SkillsSection from "@/components/SkillsSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProjectsSection />
      <TimelineSection />
      <SkillsSection />
    </main>
  );
}
