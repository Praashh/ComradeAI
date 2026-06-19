import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "@/app/_components/Hero";

// Mock Transcript since it's a child component
vi.mock("@/app/_components/Transcript", () => ({
  default: () => <div data-testid="transcript">Transcript</div>,
}));

// Mock RevealOnScroll (used by Transcript)
vi.mock("@/app/_components/RevealOnScroll", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Hero", () => {
  it("renders the headline", () => {
    render(<Hero />);
    expect(screen.getByText(/The friend who/)).toBeInTheDocument();
    expect(screen.getByText(/forgets/)).toBeInTheDocument();
  });

  it("renders the introductory paragraph about Comrade AI", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Comrade AI is the friend who stays/),
    ).toBeInTheDocument();
  });

  it("renders the CTA button linking to /write", () => {
    render(<Hero />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/write");
    expect(
      screen.getByText(/Start your journal/),
    ).toBeInTheDocument();
  });

  it("renders the Transcript component", () => {
    render(<Hero />);
    expect(screen.getByTestId("transcript")).toBeInTheDocument();
  });
});
