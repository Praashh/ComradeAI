import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockSaveInMemory, mockSelect, mockUpdate } = vi.hoisted(() => ({
  mockSaveInMemory: vi.fn(),
  mockSelect: vi.fn(),
  mockUpdate: vi.fn(),
}));

vi.mock("@/lib/memory", () => ({
  Memory: {
    getInstance: vi.fn().mockReturnValue({
      saveInMemory: mockSaveInMemory,
      recallMemory: vi.fn(),
      getUserProfile: vi.fn(),
    }),
  },
}));

vi.mock("supermemory", () => ({
  default: vi.fn(),
}));

vi.mock("@/env", () => ({
  env: {
    CRON_SECRET: "test-cron-secret",
    SUPERMEMORY_API_KEY: "test-key",
    GROQ_API_KEY: "test-groq-key",
    DATABASE_URL: "postgres://test",
    CLERK_SECRET_KEY: "test-clerk",
    CLERK_WEBHOOK_SECRET: "test-webhook",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_123",
    NODE_ENV: "test",
  },
}));

vi.mock("@/db/drizzle", () => ({
  db: {
    select: mockSelect,
    update: mockUpdate,
  },
}));

import { GET } from "@/app/api/cron/sync-memory/route";

function createRequest(token?: string) {
  const headers: Record<string, string> = {};
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  return new Request("http://localhost/api/cron/sync-memory", { headers });
}

describe("GET /api/cron/sync-memory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // This route reads CRON_SECRET from process.env directly
    process.env.CRON_SECRET = "test-cron-secret";
  });

  it("returns 401 for missing auth", async () => {
    const res = await GET(createRequest());
    expect(res.status).toBe(401);
  });

  it("returns 401 for wrong token", async () => {
    const res = await GET(createRequest("wrong-token"));
    expect(res.status).toBe(401);
  });

  it("syncs stale journals to memory", async () => {
    const staleJournals = [
      { id: 1, content: "My journal entry", clerkId: "user_1" },
      { id: 2, content: "Another entry", clerkId: "user_2" },
    ];

    const selectChain = {
      from: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(staleJournals),
    };
    mockSelect.mockReturnValue(selectChain);

    mockSaveInMemory.mockResolvedValue({ id: "doc_123" });

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

    expect(body.success).toBe(true);
    expect(body.processed).toBe(2);
    expect(body.total).toBe(2);
    expect(mockSaveInMemory).toHaveBeenCalledWith("My journal entry", "user_1");
    expect(mockSaveInMemory).toHaveBeenCalledWith("Another entry", "user_2");
  });

  it("handles memory save failure per journal gracefully", async () => {
    const staleJournals = [
      { id: 1, content: "Entry 1", clerkId: "user_1" },
      { id: 2, content: "Entry 2", clerkId: "user_2" },
    ];

    const selectChain = {
      from: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(staleJournals),
    };
    mockSelect.mockReturnValue(selectChain);

    mockSaveInMemory
      .mockRejectedValueOnce(new Error("Memory API error"))
      .mockResolvedValueOnce({ id: "doc_2" });

    const updateChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(undefined),
    };
    mockUpdate.mockReturnValue(updateChain);

    const res = await GET(createRequest("test-cron-secret"));
    const body = (await res.json()) as { processed: number; total: number };

    expect(body.processed).toBe(1);
    expect(body.total).toBe(2);
  });

  it("returns zero processed when no stale journals", async () => {
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([]),
    };
    mockSelect.mockReturnValue(selectChain);

    const res = await GET(createRequest("test-cron-secret"));
    const body = (await res.json()) as { processed: number; total: number };

    expect(body.processed).toBe(0);
    expect(body.total).toBe(0);
    expect(mockSaveInMemory).not.toHaveBeenCalled();
  });
});
