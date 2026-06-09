import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockSaveInMemory, mockRecallMemory, mockGetUserProfile } = vi.hoisted(
  () => ({
    mockSaveInMemory: vi.fn(),
    mockRecallMemory: vi.fn(),
    mockGetUserProfile: vi.fn(),
  }),
);

vi.mock("@/lib/memory", () => ({
  Memory: {
    getInstance: vi.fn().mockReturnValue({
      saveInMemory: mockSaveInMemory,
      recallMemory: mockRecallMemory,
      getUserProfile: mockGetUserProfile,
    }),
  },
}));

vi.mock("@/env", () => ({
  env: {
    SUPERMEMORY_API_KEY: "test-key",
    GROQ_API_KEY: "test-groq-key",
    CRON_SECRET: "test-cron",
    DATABASE_URL: "postgres://test",
    CLERK_SECRET_KEY: "test-clerk",
    CLERK_WEBHOOK_SECRET: "test-webhook",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_123",
    NODE_ENV: "test",
  },
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn().mockResolvedValue({ userId: "user_test_123" }),
}));

vi.mock("groq-sdk", () => ({
  default: class MockGroq {
    chat = { completions: { create: vi.fn() } };
  },
}));

vi.mock("@/db/drizzle", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("supermemory", () => ({
  default: vi.fn(),
}));

import {
  createAuthenticatedCaller,
  createUnauthenticatedCaller,
} from "@/test/helpers/trpc";

describe("memory router", () => {
  let caller: ReturnType<typeof createAuthenticatedCaller>;

  beforeEach(() => {
    vi.clearAllMocks();
    caller = createAuthenticatedCaller();
  });

  describe("saveMemory", () => {
    it("saves memory and returns success", async () => {
      mockSaveInMemory.mockResolvedValue({ id: "doc_123" });

      const result = await caller.memory.saveMemory({
        journalText: "Today was a great day",
      });

      expect(result).toEqual({ success: true });
      expect(mockSaveInMemory).toHaveBeenCalledWith(
        "Today was a great day",
        "user_test_123",
      );
    });

    it("returns success: false when saveInMemory returns falsy", async () => {
      mockSaveInMemory.mockResolvedValue(null);

      const result = await caller.memory.saveMemory({
        journalText: "Some text",
      });

      expect(result).toEqual({ success: false });
    });

    it("returns success: false when saveInMemory throws", async () => {
      mockSaveInMemory.mockRejectedValue(new Error("API error"));

      const result = await caller.memory.saveMemory({
        journalText: "Some text",
      });

      expect(result).toEqual({ success: false });
    });
  });

  describe("recallMemory", () => {
    it("recalls memory and returns results", async () => {
      const mockResults = {
        results: [{ content: "Past journal entry" }],
      };
      mockRecallMemory.mockResolvedValue(mockResults);

      const result = await caller.memory.recallMemory({
        journalText: "What did I write about?",
      });

      expect(result).toEqual({ success: true, memory: mockResults });
      expect(mockRecallMemory).toHaveBeenCalledWith(
        "What did I write about?",
        "user_test_123",
      );
    });

    it("returns success: false when recallMemory returns falsy", async () => {
      mockRecallMemory.mockResolvedValue(null);

      const result = await caller.memory.recallMemory({
        journalText: "query",
      });

      expect(result).toEqual({ success: false });
    });

    it("returns success: false when recallMemory throws", async () => {
      mockRecallMemory.mockRejectedValue(new Error("Search failed"));

      const result = await caller.memory.recallMemory({
        journalText: "query",
      });

      expect(result).toEqual({ success: false });
    });
  });

  describe("authentication", () => {
    it("rejects unauthenticated saveMemory calls", async () => {
      const unauthCaller = createUnauthenticatedCaller();
      await expect(
        unauthCaller.memory.saveMemory({ journalText: "test" }),
      ).rejects.toThrow("Unauthorized");
    });

    it("rejects unauthenticated recallMemory calls", async () => {
      const unauthCaller = createUnauthenticatedCaller();
      await expect(
        unauthCaller.memory.recallMemory({ journalText: "test" }),
      ).rejects.toThrow("Unauthorized");
    });
  });
});
