# Skills Section Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a visually engaging "Skills Section" using a "Saturn Rings" solar system metaphor where skills orbit central category planets.

**Architecture:**

- **Container:** `SkillsSection` component that stacks three `SolarSystem` components vertically on mobile and horizontally on desktop.
- **Visuals:** 2D CSS/Framer Motion animations simulating 3D orbits (elliptical paths with z-index switching).
- **Data:** `SKILL_SYSTEMS` constant defining categories (Frontend, Backend, Core) and their orbiting skills.

**Tech Stack:** React, Tailwind CSS, Framer Motion.

---

### Task 1: Create SolarSystem Component Structure

**Files:**

- Create: `src/components/SolarSystem.tsx`
- Test: `src/components/SolarSystem.test.tsx`

**Step 1: Write the failing test**

```typescript
import { render, screen } from "@testing-library/react";
import SolarSystem from "./SolarSystem";

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
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/SolarSystem.test.tsx`
Expected: FAIL (Component not found)

**Step 3: Write minimal implementation**

```typescript
// src/components/SolarSystem.tsx
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

export default function SolarSystem({ name, skills }: SolarSystemProps) {
  return (
    <div className="solar-system">
      <h2>{name}</h2>
      {skills.map(skill => <div key={skill.name}>{skill.name}</div>)}
    </div>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test src/components/SolarSystem.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/SolarSystem.tsx src/components/SolarSystem.test.tsx
git commit -m "feat: create basic SolarSystem component structure"
```

---

### Task 2: Implement Orbit Animation Logic

**Files:**

- Modify: `src/components/SolarSystem.tsx`
- Test: `src/components/SolarSystem.test.tsx`

**Step 1: Write the failing test**

```typescript
// src/components/SolarSystem.test.tsx
// Add to existing tests
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
  const rings = container.querySelectorAll(".orbit-ring");
  expect(rings.length).toBe(1);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/SolarSystem.test.tsx`
Expected: FAIL (No rings found)

**Step 3: Write implementation**

_Implement the `OrbitingSkill` sub-component inside `SolarSystem.tsx` using Framer Motion._

```typescript
// src/components/SolarSystem.tsx
"use client";

import { motion } from "motion/react";

// ... interfaces ...

const OrbitingSkill = ({ skill, color }: { skill: Skill, color: string }) => {
  return (
    <motion.div
        className="orbit-ring absolute rounded-full border border-white/10"
        style={{
            width: skill.orbitRadius * 2,
            height: skill.orbitRadius * 2,
             // 3:1 aspect ratio for flattened look
             // Centered absolute positioning logic
        }}
    >
        {/* The Skill Planet */}
        <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{
                rotate: 360
            }}
            transition={{
                duration: skill.speed,
                repeat: Infinity,
                ease: "linear"
            }}
             style={{
                 transformOrigin: `50% ${skill.orbitRadius}px` // Pivot around center
             }}
        >
             {/* Counter-rotate text so it stays upright */}
             <div className="text-xs">{skill.name}</div>
        </motion.div>
    </motion.div>
  );
};

// Update main component to map OrbitingSkill
```

**Step 4: Run test to verify it passes**

Run: `npm test src/components/SolarSystem.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/SolarSystem.tsx
git commit -m "feat: implement orbit animation logic"
```

---

### Task 3: Create SkillsSection Container

**Files:**

- Create: `src/components/SkillsSection.tsx`
- Test: `src/components/SkillsSection.test.tsx`

**Step 1: Write the failing test**

```typescript
import { render, screen } from "@testing-library/react";
import SkillsSection from "./SkillsSection";

describe("SkillsSection", () => {
  it("renders all three main categories", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Core / Tools")).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/SkillsSection.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

```typescript
// src/components/SkillsSection.tsx
import SolarSystem from "./SolarSystem";

const SKILL_SYSTEMS = [
    // ... Copy the data structure discussed ...
];

export default function SkillsSection() {
  return (
    <section className="py-24 min-h-screen relative overflow-hidden">
        <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-headline text-center mb-16">
                Tech Universe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center justify-items-center">
                {SKILL_SYSTEMS.map(system => (
                    <SolarSystem key={system.name} {...system} />
                ))}
            </div>
        </div>
    </section>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test src/components/SkillsSection.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/SkillsSection.tsx src/components/SkillsSection.test.tsx
git commit -m "feat: create SkillsSection container with data"
```

---

### Task 4: Integrate into Page

**Files:**

- Modify: `src/app/page.tsx`

**Step 1: Write the failing test**

_Skip unit test for page integration; verify manually or via snapshot if set up._

**Step 2: Write implementation**

```typescript
// src/app/page.tsx
import SkillsSection from "@/components/SkillsSection";

// ... inside Home component ...
<ProjectsSection />
<TimelineSection />
<SkillsSection /> {/* Added here */}
```

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: integrate SkillsSection into homepage"
```

---

### Task 5: Styling Polish (Tailwind)

**Files:**

- Modify: `src/components/SolarSystem.tsx`
- Modify: `src/components/SkillsSection.tsx`

**Step 1: Refine visual styles**

- Add glowing gradients to the central planets.
- Adjust ring opacity and border styles.
- Ensure z-index layering is correct (Saturn Rings effect where part of the ring is behind the planet).
  - _Note: This requires splitting the ring into two semi-circles or using 3D transforms carefully._
  - _Simplification:_ We'll use `preserve-3d` on the container and `rotateX(75deg)` on the ring container to get the true elliptical orbit look without complex masking.

**Step 2: Commit**

```bash
git add src/components/SolarSystem.tsx src/components/SkillsSection.tsx
git commit -m "style: polish solar system visuals with 3d transforms"
```
