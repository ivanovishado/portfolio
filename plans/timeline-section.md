# Timeline Section: "Galactic Journey"

A scroll-driven, sticky timeline where a starship flies through galaxies representing work experiences.

---

## Assets

| Asset | Source |
|-------|--------|
| **Starship** | `assets/spaceship.png` (existing) |
| **Galaxy Images** | CSS gradient placeholders (radial purple/blue) |

---

## Component Architecture

```
src/components/
├── Starship.tsx          # [NEW] PNG-based, animatable
├── GalaxyCard.tsx        # [NEW] Company info + gradient placeholder
├── TimelineSection.tsx   # [NEW] Parent with scroll logic
```

---

## Components

### Starship.tsx

Wraps `spaceship.png` with motion controls:
- Rotates based on scroll direction (up/down)
- `skin` prop for future asset swaps
- Centered via absolute positioning

### GalaxyCard.tsx

```tsx
interface GalaxyCardProps {
  company: string;
  position: string;
  description: string;
  dateRange: string;
  side: "left" | "right";
}
```
- Circular gradient placeholder (radial purple → black)
- Fades in/out based on scroll position

### TimelineSection.tsx

- `position: sticky` keeps viewport locked
- `useScroll` tracks progress
- Calculates active experience index
- Renders active `GalaxyCard` on alternating sides
- Contains vertical "beam" track (purple glow)

---

## CSS Additions

Add to `globals.css`:
- `.timeline-section`: Container height = `numExperiences * 100vh`
- `.timeline-sticky`: `position: sticky; top: 0; height: 100vh`
- `.timeline-track`: Vertical center line with glow
- `.galaxy-card`: Glassmorphism card
- `.galaxy-placeholder`: Radial gradient circle

---

## Implementation Order

1. `Starship.tsx` - PNG wrapper with motion
2. `GalaxyCard.tsx` - Static card with gradient placeholder
3. `TimelineSection.tsx` - Sticky layout + scroll tracking
4. CSS styles
5. `page.tsx` integration
6. Polish animations

---

## Verification

- `npm run lint` - No errors
- `npx tsc --noEmit` - No type errors
- Browser test: Sticky behavior, fade animations, alternating sides
