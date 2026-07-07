import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "@/app/_components/Hero";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock phosphor icons
vi.mock("@phosphor-icons/react", () => ({
  CaretDown: () => <span data-testid="caret-down">V</span>,
}));

describe("Hero", () => {
  it("renders the headline", () => {
    render(<Hero />);
    expect(screen.getByText(/The friend who/)).toBeInTheDocument();
    expect(screen.getByText(/remembers/)).toBeInTheDocument();
  });

  it("renders the introductory paragraph about Comrade AI", () => {
    render(<Hero />);
    expect(
      screen.getByText(/A safe harbor for your thoughts/),
    ).toBeInTheDocument();
  });

  it("renders the CTA button linking to /write", () => {
    render(<Hero />);
    const link = screen.getByRole("link", { name: /Start your journey/ });
    expect(link).toHaveAttribute("href", "/write");
  });
});
