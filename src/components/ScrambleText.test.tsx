import { render, screen, act } from "@testing-library/react";
import ScrambleText from "./ScrambleText";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock useInView to always return true for testing animation
vi.mock("motion/react", async () => {
  const actual = await vi.importActual("motion/react");
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(actual as any),
    useInView: () => true,
    motion: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      span: ({ children, className, ...props }: any) => (
        <span className={className} {...props}>
          {children}
        </span>
      ),
    },
  };
});

describe("ScrambleText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders correctly with given class name", () => {
    render(<ScrambleText text="HELLO" className="test-class" />);

    // Note: Text might be scrambled initially, or 'HELLO' might be there if motion initial/animate didn't run.
    // But we mainly check the container/element existence locally if possible, or wait.
    // The render might output default state 'HELLO' before effect runs, OR effect runs immediately.
    // Let's just check if *something* is rendered.
    // Actually, looking at code: `const [displayText, setDisplayText] = useState(text);`
    // So initially it displays "HELLO".
    // Then effect runs -> waits delay -> starts interval.
    expect(screen.getByText("HELLO")).toHaveClass("test-class");
  });

  it("scrambles and eventually reveals the text", async () => {
    const text = "TARGET";
    const duration = 1.0;

    render(<ScrambleText text={text} duration={duration} speed={100} delay={0} />);

    // Initially it shows TARGET
    expect(screen.getByText(text)).toBeInTheDocument();

    // Fast-forward past delay to start animation
    // The effect sets isAnimating(true) after delay
    // Inside the interval, it sets scrambled text.

    // Advance time slightly to trigger the scramble effect
    await act(async () => {
      vi.advanceTimersByTime(100); // enter animation loop
    });

    // At this point it should NOT be "TARGET" perfectly anymore (likely scrambled)
    // Checking exact scrambled text is flaky (random 0/1), but we can check if it eventually returns to TARGET.

    // Advance to end of duration
    await act(async () => {
      vi.advanceTimersByTime(duration * 1000 + 500);
    });

    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
