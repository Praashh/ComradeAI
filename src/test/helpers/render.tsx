import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

function AllProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/**
 * Custom render that wraps components with necessary providers.
 * Extend AllProviders as needed when tests require context providers.
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export { render };
