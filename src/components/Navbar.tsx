"use client";

import { useState, useEffect, useRef, useSyncExternalStore, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import HamburgerButton from "./HamburgerButton";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { href: "#", label: "Home" },
  { href: "#journey", label: "Journey" },
  // Uncomment as sections are added:
  // { href: "#work", label: "Work" },
  // { href: "#stack", label: "Stack" },
  // { href: "#contact", label: "Contact" },
];

/**
 * Navbar Component
 *
 * Handles navigation with scroll-based state transitions:
 * - Desktop: Shows horizontal links in hero, switches to hamburger when navbar scrolls out
 * - Mobile: Always shows hamburger menu
 *
 * Uses IntersectionObserver to detect when navbar leaves viewport.
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

  // Safe subscription to media query that handles SSR correctly
  const isMobile = useSyncExternalStore(
    useCallback((onStoreChange) => {
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      mediaQuery.addEventListener("change", onStoreChange);
      return () => mediaQuery.removeEventListener("change", onStoreChange);
    }, []),
    () => window.matchMedia("(max-width: 768px)").matches,
    () => false,
  );

  // Detect when navbar scrolls out of viewport
  useEffect(() => {
    if (!navbarRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When navbar is NOT intersecting (scrolled out), switch to compact mode
        setIsCompactMode(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "0px",
      },
    );

    observer.observe(navbarRef.current);
    return () => observer.disconnect();
  }, []);

  const showHamburger = isMobile || isCompactMode;

  return (
    <>
      {/* Original navbar in hero - used as scroll detection anchor */}
      <header ref={navbarRef} className="navbar">
        <Link href="/" className="navbar-logo">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            IG
          </motion.span>
        </Link>

        {!showHamburger && (
          <motion.nav
            className="navbar-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {NAV_LINKS.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="navbar-link"
                whileHover="hover"
                initial="rest"
              >
                {link.label}
                <motion.span
                  className="navbar-link-underline"
                  variants={{
                    rest: { scaleX: 0 },
                    hover: { scaleX: 1 },
                  }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.a>
            ))}
          </motion.nav>
        )}

        {/* Hamburger button in original position (mobile only when in hero) */}
        {isMobile && !isCompactMode && (
          <HamburgerButton
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen(!isMenuOpen)}
            enableMagnetic={false}
          />
        )}
      </header>

      {/* Fixed compact navbar - Floating Circle Hamburger */}
      <AnimatePresence>
        {showHamburger && isCompactMode && (
          <motion.header
            key="compact-navbar"
            className="navbar--compact"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <HamburgerButton
              isOpen={isMenuOpen}
              onToggle={() => setIsMenuOpen(!isMenuOpen)}
              enableMagnetic={!isMobile}
            />
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile menu overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} links={NAV_LINKS} />
    </>
  );
}
