import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Z-Index Hierarchy Tests
 *
 * Ensures the visual stacking order of site elements is correct.
 * The hierarchy (lowest to highest):
 *   - hero-background: 0
 *   - hero-content: 10
 *   - navbar: 50
 *   - mobile-menu-overlay: 100
 *   - mobile-menu-panel: 101
 *   - (future) floating-sound-button: 200+
 */
describe("Z-Index Hierarchy", () => {
  // Read CSS files to extract z-index values
  const navbarCss = readFileSync(resolve(__dirname, "../app/navbar.css"), "utf-8");
  const heroCss = readFileSync(resolve(__dirname, "../app/hero.css"), "utf-8");

  // Helper to extract z-index from a CSS rule by selector
  const extractZIndex = (css: string, selector: string): number | null => {
    // Create regex to match the selector and its z-index
    // Handles both `.class {` and `/* comment */ .class {` patterns
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`${escapedSelector}\\s*\\{[^}]*z-index:\\s*(\\d+)`, "s");
    const match = css.match(regex);
    return match ? parseInt(match[1], 10) : null;
  };

  describe("Mobile Menu stacking", () => {
    it("should have menu panel above menu overlay", () => {
      const overlayZ = extractZIndex(navbarCss, ".mobile-menu-overlay");
      const panelZ = extractZIndex(navbarCss, ".mobile-menu-panel");

      expect(overlayZ).not.toBeNull();
      expect(panelZ).not.toBeNull();
      expect(panelZ).toBeGreaterThan(overlayZ!);
    });

    it("should have menu overlay above navbar", () => {
      const navbarZ = extractZIndex(navbarCss, ".navbar");
      const overlayZ = extractZIndex(navbarCss, ".mobile-menu-overlay");

      expect(navbarZ).not.toBeNull();
      expect(overlayZ).not.toBeNull();
      expect(overlayZ).toBeGreaterThan(navbarZ!);
    });

    it("should have menu panel above hero content", () => {
      const heroContentZ = extractZIndex(heroCss, ".hero-content");
      const panelZ = extractZIndex(navbarCss, ".mobile-menu-panel");

      expect(heroContentZ).not.toBeNull();
      expect(panelZ).not.toBeNull();
      expect(panelZ).toBeGreaterThan(heroContentZ!);
    });
  });

  describe("Expected z-index values", () => {
    it("should have hero-background at z-index 0", () => {
      const zIndex = extractZIndex(heroCss, ".hero-background");
      expect(zIndex).toBe(0);
    });

    it("should have hero-content at z-index 10", () => {
      const zIndex = extractZIndex(heroCss, ".hero-content");
      expect(zIndex).toBe(10);
    });

    it("should have navbar at z-index 50", () => {
      const zIndex = extractZIndex(navbarCss, ".navbar");
      expect(zIndex).toBe(50);
    });

    it("should have mobile-menu-overlay at z-index 100", () => {
      const zIndex = extractZIndex(navbarCss, ".mobile-menu-overlay");
      expect(zIndex).toBe(100);
    });

    it("should have mobile-menu-panel at z-index 101", () => {
      const zIndex = extractZIndex(navbarCss, ".mobile-menu-panel");
      expect(zIndex).toBe(101);
    });

    it("should reserve z-index range 200+ for future floating elements", () => {
      // This test documents the intended hierarchy
      // Floating sound button should use z-index >= 200
      const maxMenuZ = extractZIndex(navbarCss, ".mobile-menu-panel");
      expect(maxMenuZ).toBeLessThan(200);
    });
  });
});
