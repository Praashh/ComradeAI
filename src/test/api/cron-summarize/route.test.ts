import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGroqCreate, mockSelect, mockUpdate } = vi.hoisted(() => ({
  mockGroqCreate: vi.fn(),
  mockSelect: vi.fn(),
  mockUpdate: vi.fn(),
}));

vi.mock("@/env", () => ({
  env: {
    GROQ_API_KEY: "test-groq-key",
    CRON_SECRET: "test-cron-secret",
    SUPERMEMORY_API_KEY: "test-key",
    DATABASE_URL: "postgres://test",
    CLERK_SECRET_KEY: "test-clerk",
    CLERK_WEBHOOK_SECRET: "test-webhook",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_123",
    NODE_ENV: "test",
  },
}));

vi.mock("groq-sdk", () => ({
  default: class MockGroq {
    chat = { completions: { create: mockGroqCreate } };
  },
}));

vi.mock("@/db/drizzle", () => ({
  db: {
    select: mockSelect,
    update: mockUpdate,
  },
}));

import { GET } from "@/app/api/cron/summarize/route";

function createRequest(token?: string) {
  const headers: Record<string, string> = {};
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  return new Request("http://localhost/api/cron/summarize", { headers });
}

describe("GET /api/cron/summarize", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 for missing auth", async () => {
    const res = await GET(createRequest());
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 401 for wrong token", async () => {
    const res = await GET(createRequest("wrong-token"));
    expect(res.status).toBe(401);
  });

  it("processes stale journals and returns counts", async () => {
    const staleJournals = [
      { id: 1, content: "Had a great day at work" },
      { id: 2, content: "Feeling a bit stressed today" },
    ];

    // db.select().from().where() chain
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(staleJournals),
    };
    mockSelect.mockReturnValue(selectChain);

    // Groq returns summary for both
    mockGroqCreate
      .mockResolvedValueOnce({
        choices: [{ message: { content: "Great day at work summary." } }],
      })
      .mockResolvedValueOnce({
        choices: [{ message: { content: "Stressed day summary." } }],
      });

    // db.update().set().where() chain
    const updateChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(undefined),
    };
    mockUpdate.mockReturnValue(updateChain);

    const res = await GET(createRequest("test-cron-secret"));
    expect(res.status).toBe(200);

    const body = (await res.json()) as {
      success: boolean;
      processed: number;
      total: number;
    };
    expect(body.success).toBe(true);
    expect(body.processed).toBe(2);
    expect(body.total).toBe(2);
    expect(mockGroqCreate).toHaveBeenCalledTimes(2);
  });

  it("handles Groq failure for individual journal gracefully", async () => {
    const staleJournals = [
      { id: 1, content: "Journal 1" },
      { id: 2, content: "Journal 2" },
    ];

    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(staleJournals),
    };
    mockSelect.mockReturnValue(selectChain);

    // First fails, second succeeds
    mockGroqCreate
      .mockRejectedValueOnce(new Error("Groq API error"))
      .mockResolvedValueOnce({
        choices: [{ message: { content: "Summary for journal 2." } }],
      });

    const updateChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(undefined),
    };
    mockUpdate.mockReturnValue(updateChain);

    const res = await GET(createRequest("test-cron-secret"));
    const body = (await res.json()) as {
      success: boolean;
      processed: number;
      total: number;
    };
    expect(body.processed).toBe(1);
    expect(body.total).toBe(2);
  });

  it("returns zero processed when no stale journals", async () => {
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([]),
    };
    mockSelect.mockReturnValue(selectChain);

    const res = await GET(createRequest("test-cron-secret"));
    const body = (await res.json()) as {
      success: boolean;
      processed: number;
      total: number;
    };
    expect(body.processed).toBe(0);
    expect(body.total).toBe(0);
    expect(mockGroqCreate).not.toHaveBeenCalled();
  });

  it("skips update when Groq returns no summary content", async () => {
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([{ id: 1, content: "Journal" }]),
    };
    mockSelect.mockReturnValue(selectChain);

    mockGroqCreate.mockResolvedValue({
      choices: [{ message: { content: null } }],
    });

    const res = await GET(createRequest("test-cron-secret"));
    const body = (await res.json()) as { processed: number };
    expect(body.processed).toBe(0);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
