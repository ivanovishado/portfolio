import { render, screen } from "@testing-library/react";
import SkillsSection from "./SkillsSection";
import { describe, it, expect } from "vitest";

describe("SkillsSection", () => {
  it("renders all three main categories", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Core")).toBeInTheDocument();
  });

  it("renders the section title", () => {
    render(<SkillsSection />);
    expect(screen.getByText(/Tech Universe/i)).toBeInTheDocument();
  });
});
