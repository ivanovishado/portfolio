"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, stagger, useAnimate } from "motion/react";

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
}

/**
 * Mobile Menu Component
 *
 * Full-screen overlay with inset panel that expands from top-right.
 * Features:
 * - Elevated dark surface (not glassmorphism)
 * - 500ms elegant expansion animation
 * - Staggered link animations (triggered after panel animation completes)
 * - Closes on escape key and link click
 */
export default function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  const [scope, animate] = useAnimate();
  const isOpenRef = useRef(isOpen);

  // Keep ref in sync with prop
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Animate links - triggered by onAnimationComplete of the panel
  const animateLinks = useCallback(() => {
    if (scope.current) {
      animate(
        ".mobile-nav-link",
        { opacity: 1, y: 0 },
        { delay: stagger(0.05), duration: 0.3, ease: "easeOut" },
      );
    }
  }, [animate, scope]);

  // Handle escape key and body scroll lock when menu is open
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <motion.div
            ref={scope}
            className="mobile-menu-panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            onAnimationComplete={() => {
              // Only animate links when opening, not when closing
              if (isOpenRef.current) {
                animateLinks();
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Close button */}
            <button className="mobile-menu-close" onClick={onClose} aria-label="Close menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Welcome message */}
            <div className="menu-welcome">
              <motion.span
                className="menu-welcome-wave"
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut",
                }}
                style={{ display: "inline-block", transformOrigin: "70% 70%" }}
              >
                👋
              </motion.span>{" "}
              Hello, traveler.
            </div>

            {/* Navigation links - prominent */}
            <nav className="mobile-menu-nav">
              {links.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={handleLinkClick}
                  initial={{ opacity: 0, y: 30 }}
                >
                  {link.label}
                  <span className="nav-link-decorator">+</span>
                </motion.a>
              ))}
            </nav>

            {/* Footer */}
            <motion.footer
              className="menu-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
            >
              <p>Ivan Galaviz — High-end Tech Portfolio</p>
              <p>© {new Date().getFullYear()}</p>
            </motion.footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
