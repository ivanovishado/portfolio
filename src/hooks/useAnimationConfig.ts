"use client";

import { useReducedMotion, type Transition } from "motion/react";

/**
 * useAnimationConfig Hook
 *
 * Provides consistent animation configuration across the app while
 * respecting user's `prefers-reduced-motion` accessibility preference.
 *
 * Usage:
 * ```tsx
 * const { shouldReduceMotion, springConfig, fadeConfig, easeConfig } = useAnimationConfig();
 * ```
 */
export function useAnimationConfig() {
  const shouldReduceMotion = useReducedMotion();

  // Spring physics for interactive elements (buttons, cards, gestures)
  const springConfig: Transition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: "spring", stiffness: 300, damping: 20 };

  // Snappy spring for small elements (toggles, icons)
  const snappySpringConfig: Transition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: "spring", stiffness: 400, damping: 25 };

  // Fade/entrance animations with Apple-style easing curve
  const fadeConfig: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.22, 1, 0.36, 1] };

  // Quick transitions for UI feedback
  const quickConfig: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

  // Premium easing curve (Apple/Jon Ive style)
  const easeConfig = [0.22, 1, 0.36, 1] as const;

  return {
    shouldReduceMotion,
    springConfig,
    snappySpringConfig,
    fadeConfig,
    quickConfig,
    easeConfig,
  };
}

/**
 * Animation presets for common patterns
 * These can be used directly in motion components without the hook
 * when reduced-motion handling isn't critical (e.g., decorative animations)
 */
export const ANIMATION_PRESETS = {
  // Apple-style easing curve
  EASE_OUT: [0.22, 1, 0.36, 1] as const,

  // Standard spring for most UI elements
  SPRING_DEFAULT: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
  },

  // Snappy spring for small/fast elements
  SPRING_SNAPPY: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
  },

  // Bouncy spring for playful elements
  SPRING_BOUNCY: {
    type: "spring" as const,
    stiffness: 400,
    damping: 12,
  },

  // Smooth spring for starship-like tracking
  SPRING_SMOOTH: {
    type: "spring" as const,
    stiffness: 350,
    damping: 25,
  },
} as const;
