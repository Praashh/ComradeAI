import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RevealOnScroll from "@/app/_components/RevealOnScroll";

// Mock IntersectionObserver as a proper class
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

let observerCallback: IntersectionObserverCallback;

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }
  observe = mockObserve;
  unobserve = mockUnobserve;
  disconnect = mockDisconnect;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

describe("RevealOnScroll", () => {
  it("renders children", () => {
    render(
      <RevealOnScroll>
        <span>Hello World</span>
      </RevealOnScroll>,
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("applies the 'reveal' CSS class", () => {
    const { container } = render(
      <RevealOnScroll>
        <span>Content</span>
      </RevealOnScroll>,
    );
    expect(container.firstChild).toHaveClass("reveal");
  });

  it("applies additional className", () => {
    const { container } = render(
      <RevealOnScroll className="custom-class">
        <span>Content</span>
      </RevealOnScroll>,
    );
    expect(container.firstChild).toHaveClass("reveal");
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders with custom 'as' element type", () => {
    const { container } = render(
      <RevealOnScroll as="section">
        <span>Content</span>
      </RevealOnScroll>,
    );
    expect(container.firstChild!.nodeName).toBe("SECTION");
  });

  it("observes the element on mount", () => {
    render(
      <RevealOnScroll>
        <span>Content</span>
      </RevealOnScroll>,
    );
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });

  it("adds 'in' class when element intersects", () => {
    const { container } = render(
      <RevealOnScroll>
        <span>Content</span>
      </RevealOnScroll>,
    );

    const el = container.firstChild as HTMLElement;

    observerCallback(
      [{ target: el, isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(el).toHaveClass("in");
    expect(mockUnobserve).toHaveBeenCalledWith(el);
  });

  it("does not add 'in' class when not intersecting", () => {
    const { container } = render(
      <RevealOnScroll>
        <span>Content</span>
      </RevealOnScroll>,
    );

    const el = container.firstChild as HTMLElement;

    observerCallback(
      [{ target: el, isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(el).not.toHaveClass("in");
    expect(mockUnobserve).not.toHaveBeenCalled();
  });

  it("disconnects observer on unmount", () => {
    const { unmount } = render(
      <RevealOnScroll>
        <span>Content</span>
      </RevealOnScroll>,
    );

    unmount();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
