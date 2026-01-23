import { render, screen } from "@testing-library/react";
import SolarSystem from "./SolarSystem";
import { describe, it, expect } from "vitest";

describe("SolarSystem", () => {
  it("renders the system name", () => {
    const skills = [{ name: "React", orbitRadius: 100, speed: 20 }];
    render(
      <SolarSystem
        name="Frontend"
        color="#0ea5e9"
        skills={skills}
      />
    );
    expect(screen.getByText("Frontend")).toBeInTheDocument();
  });

  it("renders orbit rings for each skill", () => {
    const skills = [{ name: "React", orbitRadius: 100, speed: 20 }];
    const { container } = render(
      <SolarSystem
        name="Frontend"
        color="#0ea5e9"
        skills={skills}
      />
    );
    // Check for an element with specific radius style or class
    // We'll look for the class "orbit-ring" which we plan to add
    const rings = container.querySelectorAll(".orbit-ring");
    expect(rings.length).toBe(1);
  });
});
