# Coding Conventions

## Framework Specifics (Next.js 16 App Router)
- **Directory Structure:** usage of `src/app`.
- **Server Components:** Default. Use `"use client"` at the top of files that use React hooks or interactivity.
- **Image Optimization:** Use `next/image` where possible.
- **Fonts:** Use `next/font` (Geist / Inter / JetBrains Mono).

## Component Architecture
- **HeroUI:** Use HeroUI v3 beta components. Note the compound component pattern (e.g. `Card.Header` instead of flat props).
- **Tailwind CSS v4:** Use utility classes for layout and spacing. Use `tailwind-variants` for complex component states.
- **Animation:** Use `motion` (framer-motion v12) for enter/exit and scroll-linked animations.

## State Management
- Prefer localized state or URL state (search params) over global stores unless necessary.
