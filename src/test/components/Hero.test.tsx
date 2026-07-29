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
    const { container } = render(<Hero />);
    const normalizedText = container.textContent?.replace(/\u00a0/g, " ");
    expect(normalizedText).toContain("The friend who listens,");
    expect(normalizedText).toContain("understands, and remembers.");
  });

  it("renders the introductory paragraph about Comrade AI", () => {
    const { container } = render(<Hero />);
    const normalizedText = container.textContent?.replace(/\u00a0/g, " ");
    expect(normalizedText).toContain(
      "A safe harbor for your thoughts - an intelligent journal that feels human.",
    );
  });

  it("renders the CTA button linking to /sign-up", () => {
    render(<Hero />);
    const link = screen.getByRole("link", { name: /Start your journey/ });
    expect(link).toHaveAttribute("href", "/sign-up");
  });
});

