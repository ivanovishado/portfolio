import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { MotionValue } from "motion/react";

// Mock motion/react to avoid animation complexities
vi.mock("motion/react", async () => {
  const actual = await vi.importActual("motion/react");
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(actual as any),
    useScroll: () => ({
      scrollYProgress: { get: () => 0.5 },
      scrollY: { get: () => 0, getPrevious: () => 0, on: () => () => {} },
    }),
    useTransform: () => ({ get: () => 1 }),
    useSpring: (v: unknown) => v,
    useVelocity: () => ({ get: () => 0 }),
    useMotionValue: (v: number) => ({ get: () => v, set: () => {} }),
    useMotionValueEvent: () => {},
    motion: {
      div: ({
        children,
        className,
        style,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        whileHover,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        whileTap,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        transition,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        initial,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        animate,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        variants,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        viewport,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        whileInView,

        ...props
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }: any) => (
        <div className={className} style={style} {...props}>
          {children}
        </div>
      ),
    },
  };
});

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    alt,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fill,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    priority,
    ...props
  }: {
    alt: string;
    fill?: boolean;
    priority?: boolean;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}));

describe("Card Positioning Symmetry", () => {
  describe("Spaceship", () => {
    it("should use absolute positioning (not sticky) to avoid affecting flex layout", async () => {
      const { default: Spaceship } = await import("./Spaceship");
      const { container } = render(<Spaceship />);

      const spaceshipContainer = container.firstChild as HTMLElement;
      expect(spaceshipContainer).toBeInTheDocument();

      // Verify it has 'absolute' class and NOT 'sticky'
      expect(spaceshipContainer.className).toContain("absolute");
      expect(spaceshipContainer.className).not.toContain("sticky");
    });
  });

  describe("TimelineCardWrapper", () => {
    it("should apply symmetric padding classes for left and right sides", async () => {
      const { default: TimelineCardWrapper } = await import("./TimelineCardWrapper");

      // Create a mock MotionValue
      const mockProgress = {
        get: () => 0.5,
        on: () => () => {},
      } as unknown as MotionValue<number>;

      // Test LEFT side
      const { container: leftContainer, unmount: unmountLeft } = render(
        <TimelineCardWrapper
          index={0}
          total={4}
          progress={mockProgress}
          data={{
            company: "Test Company",
            position: "Test Position",
            description: "Test description",
            dateRange: "2024 - Present",
            side: "left",
          }}
        />,
      );

      const leftWrapper = leftContainer.firstChild as HTMLElement;
      expect(leftWrapper.className).toContain("right-1/2");
      expect(leftWrapper.className).toContain("left-0");
      expect(leftWrapper.className).toContain("justify-end");
      // Check for padding-right (pr-*) for left cards
      expect(leftWrapper.className).toMatch(/pr-\d+/);
      expect(leftWrapper.className).toMatch(/md:pr-\d+/);

      unmountLeft();

      // Test RIGHT side
      const { container: rightContainer } = render(
        <TimelineCardWrapper
          index={1}
          total={4}
          progress={mockProgress}
          data={{
            company: "Test Company",
            position: "Test Position",
            description: "Test description",
            dateRange: "2024 - Present",
            side: "right",
          }}
        />,
      );

      const rightWrapper = rightContainer.firstChild as HTMLElement;
      expect(rightWrapper.className).toContain("left-1/2");
      expect(rightWrapper.className).toContain("right-0");
      expect(rightWrapper.className).toContain("justify-start");
      // Check for padding-left (pl-*) for right cards
      expect(rightWrapper.className).toMatch(/pl-\d+/);
      expect(rightWrapper.className).toMatch(/md:pl-\d+/);
    });

    it("should constrain left cards to left half and right cards to right half", async () => {
      const { default: TimelineCardWrapper } = await import("./TimelineCardWrapper");

      const mockProgress = {
        get: () => 0.5,
        on: () => () => {},
      } as unknown as MotionValue<number>;

      // Left card should have: left-0 right-1/2 (constrains to left half)
      const { container: leftContainer } = render(
        <TimelineCardWrapper
          index={0}
          total={4}
          progress={mockProgress}
          data={{
            company: "Test",
            position: "Test",
            description: "Test",
            dateRange: "2024",
            side: "left",
          }}
        />,
      );

      const leftWrapper = leftContainer.firstChild as HTMLElement;
      // Left cards: positioned in left half, content pushed to right edge of that half
      expect(leftWrapper.className).toContain("left-0");
      expect(leftWrapper.className).toContain("right-1/2");

      // Right card should have: left-1/2 right-0 (constrains to right half)
      const { container: rightContainer } = render(
        <TimelineCardWrapper
          index={1}
          total={4}
          progress={mockProgress}
          data={{
            company: "Test",
            position: "Test",
            description: "Test",
            dateRange: "2024",
            side: "right",
          }}
        />,
      );

      const rightWrapper = rightContainer.firstChild as HTMLElement;
      // Right cards: positioned in right half, content pushed to left edge of that half
      expect(rightWrapper.className).toContain("left-1/2");
      expect(rightWrapper.className).toContain("right-0");
    });
  });
});
