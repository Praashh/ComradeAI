import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies before imports
vi.mock("@/db/drizzle", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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

import { db } from "@/db/drizzle";
import {
  createAuthenticatedCaller,
  createUnauthenticatedCaller,
} from "@/test/helpers/trpc";

// Helper to create a chainable mock for Drizzle queries
function mockChain(resolvedValue: unknown) {
  const chain: Record<string, unknown> = {};
  const methods = [
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
    "returning",
  ];
  for (const m of methods) {
    chain[m] = vi.fn().mockReturnValue(chain);
  }
  // Make it thenable
  chain.then = vi
    .fn()
    .mockImplementation((resolve) =>
      Promise.resolve(resolvedValue).then(resolve),
    );
  return chain;
}

describe("journal router", () => {
  let caller: ReturnType<typeof createAuthenticatedCaller>;

  beforeEach(() => {
    vi.clearAllMocks();
    caller = createAuthenticatedCaller();
  });

  describe("create", () => {
    it("creates a journal with title", async () => {
      const mockJournal = {
        id: 1,
        userId: 1,
        title: "My Journal",
        content: "",
        mood: null,
        icon: null,
        color: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // getUserId lookup
      const selectChain = mockChain([{ id: 1 }]);
      vi.mocked(db.select).mockReturnValue(selectChain as never);

      // insert chain
      const insertChain = mockChain(undefined);
      (insertChain.returning as ReturnType<typeof vi.fn>).mockResolvedValue([
        mockJournal,
      ]);
      vi.mocked(db.insert).mockReturnValue(insertChain as never);

      const result = await caller.journal.create({ title: "My Journal" });
      expect(result.journal).toEqual(mockJournal);
      expect(result.journal.title).toBe("My Journal");
    });

    it("creates a journal with optional mood, icon, and color", async () => {
      const mockJournal = {
        id: 2,
        userId: 1,
        title: "Mood Journal",
        content: "",
        mood: "happy",
        icon: "Sun",
        color: "#FFD700",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const selectChain = mockChain([{ id: 1 }]);
      vi.mocked(db.select).mockReturnValue(selectChain as never);

      const insertChain = mockChain(undefined);
      (insertChain.returning as ReturnType<typeof vi.fn>).mockResolvedValue([
        mockJournal,
      ]);
      vi.mocked(db.insert).mockReturnValue(insertChain as never);

      const result = await caller.journal.create({
        title: "Mood Journal",
        mood: "happy",
        icon: "Sun",
        color: "#FFD700",
      });

      expect(result.journal.mood).toBe("happy");
      expect(result.journal.icon).toBe("Sun");
      expect(result.journal.color).toBe("#FFD700");
    });

    it("rejects empty title (Zod validation)", async () => {
      await expect(caller.journal.create({ title: "" })).rejects.toThrow();
    });
  });

  describe("get", () => {
    it("returns a journal by id for the owner", async () => {
      const mockJournal = {
        id: 1,
        userId: 1,
        title: "Test",
        content: "Hello",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // getUserId
      const selectChain1 = mockChain([{ id: 1 }]);
      // journal lookup — second call to db.select
      const selectChain2 = mockChain([mockJournal]);

      vi.mocked(db.select)
        .mockReturnValueOnce(selectChain1 as never)
        .mockReturnValueOnce(selectChain2 as never);

      const result = await caller.journal.get({ id: 1 });
      expect(result.journal).toEqual(mockJournal);
    });

    it("throws when journal is not found", async () => {
      const selectChain1 = mockChain([{ id: 1 }]);
      const selectChain2 = mockChain([]);

      vi.mocked(db.select)
        .mockReturnValueOnce(selectChain1 as never)
        .mockReturnValueOnce(selectChain2 as never);

      await expect(caller.journal.get({ id: 999 })).rejects.toThrow(
        "Journal not found",
      );
    });

    it("throws when user is not found", async () => {
      const selectChain = mockChain([]);
      vi.mocked(db.select).mockReturnValue(selectChain as never);

      await expect(caller.journal.get({ id: 1 })).rejects.toThrow(
        "User not found",
      );
    });
  });

  describe("save", () => {
    it("updates journal content", async () => {
      const updated = {
        id: 1,
        userId: 1,
        title: "Test",
        content: "Updated content",
        updatedAt: new Date(),
      };

      // getUserId
      const selectChain = mockChain([{ id: 1 }]);
      vi.mocked(db.select).mockReturnValue(selectChain as never);

      // update chain
      const updateChain = mockChain(undefined);
      (updateChain.returning as ReturnType<typeof vi.fn>).mockResolvedValue([
        updated,
      ]);
      vi.mocked(db.update).mockReturnValue(updateChain as never);

      const result = await caller.journal.save({
        id: 1,
        content: "Updated content",
      });
      expect(result.journal).toEqual(updated);
    });
  });

  describe("getAllJournals", () => {
    it("returns all journals for the authenticated user", async () => {
      const mockJournals = [
        { id: 1, userId: 1, title: "Journal 1" },
        { id: 2, userId: 1, title: "Journal 2" },
      ];

      // getUserId
      const selectChain1 = mockChain([{ id: 1 }]);
      // getAllJournals
      const selectChain2 = mockChain(mockJournals);

      vi.mocked(db.select)
        .mockReturnValueOnce(selectChain1 as never)
        .mockReturnValueOnce(selectChain2 as never);

      const result = await caller.journal.getAllJournals();
      expect(result.journals).toEqual(mockJournals);
      expect(result.journals).toHaveLength(2);
    });
  });

  describe("authentication", () => {
    it("rejects unauthenticated calls", async () => {
      const unauthCaller = createUnauthenticatedCaller();
      await expect(unauthCaller.journal.getAllJournals()).rejects.toThrow(
        "Unauthorized",
      );
    });
  });
});
