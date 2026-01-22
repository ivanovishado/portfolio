# Projects Section & Transition Design

**Date:** 2026-01-22
**Status:** Approved

## Overview

This design covers the transition from the Hero section to the Featured Projects section, including a scroll-driven supernova animation and redesigned project cards.

## The Transition: "Supernova → Nebula Dust"

### Narrative Arc

The transition tells a cosmic story: the black hole that consumed the hero elements reaches critical mass and explodes, leaving behind a serene nebula backdrop where projects emerge.

| Phase | Scroll % | Description |
|-------|----------|-------------|
| **Full Consumption** | Start | Black hole at peak. All hero elements absorbed. Orange accretion disk at maximum energy. |
| **Critical Mass** | 0-30% | Core pulses and distorts. Cracks of light appear. Tension builds. |
| **Supernova Burst** | 30-60% | Violent explosion. Blinding white/purple light radiates outward. Shockwave expands. |
| **Settling** | 60-100% | Intensity fades. Debris and nebula gas cool from white → orange → purple/blue. Dust settles into atmospheric Hubble-style nebula backdrop. |

**Emotional journey:** Tension → Release → Wonder → Calm anticipation

### Technical Implementation

1. **Generate video** using Runway/Pika with AI interpolation (start + end frames + description)
2. **Extract frames** using ffmpeg: `ffmpeg -i supernova.mp4 -vf "fps=30" frames/frame_%04d.webp`
3. **Preload frames** on component mount
4. **Map scroll progress** (0-1) to frame index using framer-motion's `useScroll` + `useTransform`
5. **Display frame** via single `<img>` tag with dynamic `src`

**Reduced motion:** Skip directly to final frame for `prefers-reduced-motion` users.

**Mobile:** Consider using every 2nd frame to reduce payload.

---

## AI Generation Prompts

### Prompt 1: Final Frame (Nebula Backdrop)

```
A dark cosmic nebula viewed from deep space, Hubble Space Telescope
photography style. Soft purple and blue gaseous wisps drift across
an OLED black void (#050505). The nebula is subtle and atmospheric,
not overwhelming - approximately 30% opacity wisps against pure
black. Scattered dim stars twinkle in the distance. The composition
is centered with nebula gas more dense in the upper third, gradually
fading to near-black in the lower two-thirds, leaving space for
content. Color palette: deep purples (#A855F7 at low opacity),
muted cyans (#0EA5E9 at low opacity), hints of residual orange
warmth from a recent stellar event. No planets, no bright stars,
no focal point - pure ambient atmosphere. Ultra high resolution,
16:9 aspect ratio, 1440x900 pixels.
```

### Prompt 2: Video Interpolation

Feed to Runway/Pika with first frame (black hole after hero absorption) and final frame (nebula):

```
A supernova explosion emanates from the center of frame. The black
hole reaches critical mass - its orange accretion disk intensifies
and destabilizes. The event horizon fractures with cracks of
brilliant white light.

A violent explosion erupts outward in all directions. Blinding
white and purple light floods the frame, completely overwhelming
the black void. Shockwaves of energy ripple across space. The
explosion reaches maximum intensity at the midpoint.

The brilliant light gradually fades and cools. Hot white transitions
to warm orange, then to purple and blue hues. Cosmic debris,
particles, and nebula gas spread outward from the explosion center.
The energy dissipates as particles scatter and drift.

The chaos slowly settles into calm. Dust and gas find equilibrium,
forming soft nebula wisps. Stars begin to appear through the
thinning debris. The scene transitions from violent explosion to
peaceful cosmic aftermath. The final state is a serene dark nebula
- atmospheric purple and blue wisps floating in the void of space.

Camera: Static, centered on explosion origin.
Duration: 5-8 seconds preferred.
Style: Photorealistic, cinematic, Interstellar/Hubble aesthetic.
```

---

## Projects Section Design

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    FEATURED PROJECTS                        │
│                                                             │
│   ┌─────────────────────┐     ┌─────────────────────┐      │
│   │                     │     │                     │      │
│   │    [Project 1       │     │    [Project 2       │      │
│   │     Image]          │     │     Image]          │      │
│   │                     │     │                     │      │
│   │  ▓▓▓▓▓ Title ▓▓▓▓▓▓ │     │  ▓▓▓▓▓ Title ▓▓▓▓▓▓ │      │
│   └─────────────────────┘     └─────────────────────┘      │
│                                                             │
│          ~ nebula backdrop from transition ~                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Background

- Dark nebula backdrop (carried from transition final frame)
- Soft purple/blue wisps on OLED black (#050505)
- Creates "floating in space" atmosphere

### Section Header

- Title: "FEATURED PROJECTS"
- Typography: Inter, bold, white (#FAFAFA)
- No subtitle (clean, minimal)

### Project Cards

| Property | Value |
|----------|-------|
| Background | #111111 |
| Corner radius | 12px |
| Dimensions | ~640px × 400px (16:10 ratio) |
| Gap between cards | 32px |

### Card Content

- **Image:** Full-bleed, `object-fit: cover`
- **Gradient overlay:** `linear-gradient(transparent 50%, rgba(17,17,17,0.9) 100%)`
- **Title:** Inter, 24px, weight 500, white (#FAFAFA), bottom-left with 24px padding

### Hover State

| Property | Value |
|----------|-------|
| Box shadow | `0 0 30px rgba(168, 85, 247, 0.3)` (purple glow) |
| Transform | `scale(1.02)` |
| Transition | `all 0.3s ease-out` |
| Cursor | `pointer` |

---

## Component Structure

```
<main>
  <Hero />                    <!-- Existing, ends with black hole suck -->
  <TransitionSection />       <!-- NEW: 300vh scroll-driven frame animation -->
  <ProjectsSection />         <!-- Redesigned with nebula backdrop -->
  <TimelineSection />
</main>
```

### TransitionSection

- Height: 300vh (provides scroll distance for frame playback)
- Contains sticky viewport-sized container
- Displays single `<img>` that cycles through preloaded frames based on scroll

### ProjectsSection

- Receives nebula backdrop (final transition frame or CSS recreation)
- Contains section header + 2-column card grid
- Cards link to individual project article pages

---

## Accessibility Considerations

- `prefers-reduced-motion`: Skip transition, show final state immediately
- Cards are keyboard focusable with visible focus states
- Images have descriptive `alt` text
- Semantic HTML: `<section>`, `<article>`, `<h2>` for structure

---

## Implementation Phases

1. **Phase 1:** Generate AI assets (final frame image, interpolated video)
2. **Phase 2:** Extract and optimize video frames (WebP, ~150-200 frames)
3. **Phase 3:** Build `TransitionSection` component with scroll-synced frame playback
4. **Phase 4:** Redesign `ProjectsSection` with nebula backdrop and new card styles
5. **Phase 5:** Connect sections and test scroll flow
6. **Phase 6:** Mobile optimization (reduced frames, touch behavior)
