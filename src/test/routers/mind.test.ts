import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/env", () => ({
  env: {
    SUPERMEMORY_API_KEY: "test-supermemory-key",
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

vi.mock("@/lib/memory", () => ({
  Memory: {
    getInstance: vi.fn().mockReturnValue({
      saveInMemory: vi.fn(),
      recallMemory: vi.fn(),
      getUserProfile: vi.fn(),
    }),
  },
}));

vi.mock("supermemory", () => ({
  default: vi.fn(),
}));

import {
  createAuthenticatedCaller,
  createUnauthenticatedCaller,
} from "@/test/helpers/trpc";

describe("mind router", () => {
  let caller: ReturnType<typeof createAuthenticatedCaller>;

  beforeEach(() => {
    vi.clearAllMocks();
    caller = createAuthenticatedCaller();
  });

  describe("getDocuments", () => {
    it("fetches documents from SuperMemory API", async () => {
      const mockResponse = {
        documents: [{ id: "doc1", content: "Journal entry" }],
        pagination: { currentPage: 1, totalPages: 1, total: 1 },
      };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponse),
        }),
      );

      const result = await caller.mind.getDocuments({
        page: 1,
        limit: 10,
      });

      expect(result.documents).toEqual(mockResponse.documents);
      expect(result.pagination).toEqual(mockResponse.pagination);

      expect(fetch).toHaveBeenCalledWith(
        "https://api.supermemory.ai/v3/documents/documents",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer test-supermemory-key",
          }),
        }),
      );

      // Verify the body includes the user's containerTag
      const callArgs = vi.mocked(fetch).mock.calls[0]!;
      const body = JSON.parse(callArgs[1]!.body as string) as {
        page: number;
        limit: number;
        sort: string;
        order: string;
        filters: { containerTags: string[] };
      };
      expect(body.filters.containerTags).toEqual(["user_test_123"]);
      expect(body.page).toBe(1);
      expect(body.limit).toBe(10);
    });

    it("uses default page and limit values", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({ documents: [] }),
        }),
      );

      await caller.mind.getDocuments({});

      const callArgs = vi.mocked(fetch).mock.calls[0]!;
      const body = JSON.parse(callArgs[1]!.body as string) as {
        page: number;
        limit: number;
      };
      expect(body.page).toBe(1);
      expect(body.limit).toBe(100);
    });

    it("throws when SuperMemory API returns an error", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
        }),
      );

      await expect(
        caller.mind.getDocuments({ page: 1, limit: 10 }),
      ).rejects.toThrow("SuperMemory API error: 500");
    });

    it("throws when fetch itself fails", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new Error("Network error")),
      );

      await expect(
        caller.mind.getDocuments({ page: 1, limit: 10 }),
      ).rejects.toThrow("Network error");
    });
  });

  describe("authentication", () => {
    it("rejects unauthenticated calls", async () => {
      const unauthCaller = createUnauthenticatedCaller();
      await expect(
        unauthCaller.mind.getDocuments({ page: 1, limit: 10 }),
      ).rejects.toThrow("Unauthorized");
    });
  });
});
