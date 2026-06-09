import { vi } from "vitest";

/**
 * Creates a mock Drizzle query builder that supports method chaining.
 * Set the resolved value via `mockResolvedValue` on the terminal method.
 *
 * Usage:
 *   const mock = createMockQueryBuilder([{ id: 1, title: "Test" }]);
 *   vi.mocked(db.select).mockReturnValue(mock);
 */
export function createMockQueryBuilder<T>(resolvedValue: T = [] as T) {
  const builder: Record<string, ReturnType<typeof vi.fn>> = {};

  const chainMethods = [
    "select",
    "insert",
    "update",
    "delete",
    "from",
    "where",
    "set",
    "values",
    "orderBy",
    "limit",
    "offset",
    "innerJoin",
    "leftJoin",
    "rightJoin",
    "groupBy",
    "having",
  ];

  const terminalMethods = ["returning", "execute", "then"];

  for (const method of chainMethods) {
    builder[method] = vi.fn().mockReturnValue(builder);
  }

  for (const method of terminalMethods) {
    if (method === "then") {
      // Make the builder thenable so `await db.select()...` resolves
      builder[method] = vi.fn().mockImplementation((resolve) => {
        return Promise.resolve(resolvedValue).then(resolve);
      });
    } else {
      builder[method] = vi.fn().mockResolvedValue(resolvedValue);
    }
  }

  return builder;
}
