import { describe, it, expect } from "vitest";

describe("test setup", () => {
  it("vitest runs correctly", () => {
    expect(1 + 1).toBe(2);
  });

  it("env validation is skipped", () => {
    expect(process.env.SKIP_ENV_VALIDATION).toBe("1");
  });
});
