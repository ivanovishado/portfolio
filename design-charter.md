# Design Charter: The Galactic Odyssey Portfolio

## 1. Vision & Vibe
Theme: High-End Space Engineering / "Mission Control" meets "Hubble Telescope."
Atmosphere: Dark, moody, cinematic, and professional.
Tone: Technical, precise, and impactful.
Narrative: A "scroll-scripted" journey where a centered starship navigates through career "galaxies" and projects.

## 2. Core Constraints (The "Never" List)
NO Glassmorphism: Avoid translucent frosted backgrounds. Use solid OLED blacks and sharp neon borders instead.
NO Astrology: No constellations that look like horoscopes. Use structural engineering diagrams or technical telemetry instead.
NO Percentage Bars: Proficiency is shown through "Data Analysis" visuals or simple, high-contrast labels, never arbitrary progress bars.
NO Manual Carousels: Navigation is driven by "Sticky-Scroll" storytelling.

## 3. Color Palette
Primary Background: #050505 (OLED Black) to ensure neon colors pop.
Hero Accent: Deep Purple Nebula (Supernova Purple) and Satellite Blue (Vibrant Cyan-Blue).
Secondary UI: #A1A1AA (Cool Gray) for secondary descriptions and metadata.
Interactive Accents:
Neon Purple: Primary CTA/Border (#A855F7).
Satellite Blue: Navigation/Data Lines (#0EA5E9).
Surface: #111111 (Solid dark gray for "Monolith" panels).

## 4. Typography (The Technical Stack)
Primary Headline: Inter or Montserrat (Sans-Serif).
Style: Bold (700), All-Caps for name/headers.
Data & Metadata: JetBrains Mono or IBM Plex Mono (Monospace).
Style: Regular (400) for tech stacks, mission data, and job descriptions.
Text Alignment: Headers centered; body text left-aligned within side-panels for the "refrence image" layout.

## 5. UI Components & Layout
The Starship (The Anchor): A minimalist, vector-style ship fixed to the center of the viewport during scroll.
Sticky Scroll Sections:
Each section (Galaxy, Project, Skill) occupies 100vh.
Transitions are "fade-in/fade-out" based on scroll-position.
The "Mission Data" Panel:
Sharp corners (0px or 2px radius).
Solid black background with a 1px neon stroke.
Positioned to the side of the central vertical timeline.
The "Projector" Card:
Large, centered project cards that "pulse" into view from the ship's center point.

## 6. Motion & Interaction Logic
Scroll Scripting: The starship's flight is tied to the scroll percentage.
Parallax: Background nebulae move slower than foreground galaxies/data.
Galaxy Transitions: As the ship "reaches" a milestone, the current galaxy image fades out while the next fades in, centered or side-aligned as per the sticky-scroll logic.