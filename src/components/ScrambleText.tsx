"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "motion/react";

interface ScrambleTextProps {
  text: string;
  className?: string;
  duration?: number; // Total animation duration in seconds
  speed?: number; // Speed of character cycling (ms)
  delay?: number; // Start delay in seconds
}

export default function ScrambleText({
  text,
  className = "",
  duration = 1.5,
  speed = 40,
  delay = 0,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, { once: true, amount: 0.5 });
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    let interval: NodeJS.Timeout;

    const timeout = setTimeout(() => {
      const length = text.length;
      let frame = 0;
      const totalFrames = (duration * 1000) / speed;

      interval = setInterval(() => {
        const progress = frame / totalFrames;
        const revealProgress = Math.max(0, (progress - 0.2) / 0.8);
        const charsSolved = Math.floor(revealProgress * length);

        let output = "";
        for (let i = 0; i < length; i++) {
          if (i < charsSolved) {
            output += text[i];
          } else {
            if (text[i] === " ") {
              output += " ";
            } else {
              output += Math.random() > 0.5 ? "1" : "0";
            }
          }
        }

        setDisplayText(output);

        frame++;
        if (progress >= 1) {
          setDisplayText(text);
          clearInterval(interval);
        }
      }, speed);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [isInView, delay, text, duration, speed]);

  return (
    <motion.span
      ref={elementRef}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {displayText}
    </motion.span>
  );
}
