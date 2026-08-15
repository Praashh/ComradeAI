import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mocks (vi.hoisted so they're available in vi.mock factories) ---

const {
  mockSaveInMemory,
  mockRecallMemory,
  mockGetUserProfile,
  mockGroqCreate,
} = vi.hoisted(() => ({
  mockSaveInMemory: vi.fn(),
  mockRecallMemory: vi.fn(),
  mockGetUserProfile: vi.fn(),
  mockGroqCreate: vi.fn(),
}));

vi.mock("@/lib/memory", () => ({
  Memory: {
    getInstance: vi.fn().mockReturnValue({
      saveInMemory: mockSaveInMemory,
      recallMemory: mockRecallMemory,
      getUserProfile: mockGetUserProfile,
    }),
  },
}));

vi.mock("groq-sdk", () => ({
  default: class MockGroq {
    chat = {
      completions: {
        create: mockGroqCreate,
      },
    };
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

import { db } from "@/db/drizzle";
import {
  createAuthenticatedCaller,
  createUnauthenticatedCaller,
} from "@/test/helpers/trpc";

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
  chain.then = vi
    .fn()
    .mockImplementation((resolve) =>
      Promise.resolve(resolvedValue).then(resolve),
    );
  return chain;
}

describe("conversation router", () => {
  let caller: ReturnType<typeof createAuthenticatedCaller>;

  beforeEach(() => {
    vi.clearAllMocks();
    caller = createAuthenticatedCaller();
  });

  describe("create", () => {
    it("creates a conversation", async () => {
      const mockConversation = {
        id: 1,
        userId: 1,
        title: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // getUserId
      const selectChain = mockChain([{ id: 1 }]);
      vi.mocked(db.select).mockReturnValue(selectChain as never);

      // insert
      const insertChain = mockChain(undefined);
      (insertChain.returning as ReturnType<typeof vi.fn>).mockResolvedValue([
        mockConversation,
      ]);
      vi.mocked(db.insert).mockReturnValue(insertChain as never);

      const result = await caller.conversation.create({});
      expect(result.conversation).toEqual(mockConversation);
    });

    it("creates a conversation with a title", async () => {
      const mockConversation = {
        id: 2,
        userId: 1,
        title: "Chat about work",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const selectChain = mockChain([{ id: 1 }]);
      vi.mocked(db.select).mockReturnValue(selectChain as never);

      const insertChain = mockChain(undefined);
      (insertChain.returning as ReturnType<typeof vi.fn>).mockResolvedValue([
        mockConversation,
      ]);
      vi.mocked(db.insert).mockReturnValue(insertChain as never);

      const result = await caller.conversation.create({
        title: "Chat about work",
      });
      expect(result.conversation.title).toBe("Chat about work");
    });
  });

  describe("getAll", () => {
    it("returns all conversations for the user", async () => {
      const mockConversations = [
        { id: 1, userId: 1, title: "Chat 1" },
        { id: 2, userId: 1, title: "Chat 2" },
      ];

      // getUserId
      const selectChain1 = mockChain([{ id: 1 }]);
      // getAll query
      const selectChain2 = mockChain(mockConversations);

      vi.mocked(db.select)
        .mockReturnValueOnce(selectChain1 as never)
        .mockReturnValueOnce(selectChain2 as never);

      const result = await caller.conversation.getAll();
      expect(result.conversations).toEqual(mockConversations);
      expect(result.conversations).toHaveLength(2);
    });
  });

  describe("get", () => {
    it("returns a conversation with its messages", async () => {
      const mockConversation = { id: 1, userId: 1, title: "Test Chat" };
      const mockMessages = [
        { id: 1, conversationId: 1, role: "user", content: "Hello" },
        { id: 2, conversationId: 1, role: "assistant", content: "Hi there!" },
      ];

      // getUserId
      const selectChain1 = mockChain([{ id: 1 }]);
      // conversation lookup
      const selectChain2 = mockChain([mockConversation]);
      // messages lookup
      const selectChain3 = mockChain(mockMessages);

      vi.mocked(db.select)
        .mockReturnValueOnce(selectChain1 as never)
        .mockReturnValueOnce(selectChain2 as never)
        .mockReturnValueOnce(selectChain3 as never);

      const result = await caller.conversation.get({ id: 1 });
      expect(result.conversation).toEqual(mockConversation);
      expect(result.messages).toEqual(mockMessages);
    });

    it("throws when conversation is not found", async () => {
      const selectChain1 = mockChain([{ id: 1 }]);
      const selectChain2 = mockChain([]);

      vi.mocked(db.select)
        .mockReturnValueOnce(selectChain1 as never)
        .mockReturnValueOnce(selectChain2 as never);

      await expect(caller.conversation.get({ id: 999 })).rejects.toThrow(
        "Conversation not found",
      );
    });
  });

  describe("sendMessage", () => {
    const mockUserMessage = {
      id: 1,
      conversationId: 1,
      role: "user",
      content: "How am I doing?",
      createdAt: new Date(),
    };
    const mockAssistantMessage = {
      id: 2,
      conversationId: 1,
      role: "assistant",
      content: "You're doing great!",
      createdAt: new Date(),
    };

    function setupSendMessageMocks(opts?: {
      conversationTitle?: string | null;
      historyLength?: number;
    }) {
      const title = opts?.conversationTitle ?? null;
      const historyLen = opts?.historyLength ?? 0;

      const mockConversation = {
        id: 1,
        userId: 1,
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const history = Array.from({ length: historyLen }, (_, i) => ({
        id: i + 1,
        conversationId: 1,
        role: i % 2 === 0 ? "user" : "assistant",
        content: `Message ${i + 1}`,
        createdAt: new Date(),
      }));

      // getUserId
      const selectChain1 = mockChain([{ id: 1 }]);
      // verify ownership
      const selectChain2 = mockChain([mockConversation]);
      // fetch history
      const selectChain3 = mockChain(history);

      vi.mocked(db.select)
        .mockReturnValueOnce(selectChain1 as never)
        .mockReturnValueOnce(selectChain2 as never)
        .mockReturnValueOnce(selectChain3 as never);

      // insert user message, then assistant message
      const insertChain1 = mockChain(undefined);
      (insertChain1.returning as ReturnType<typeof vi.fn>).mockResolvedValue([
        mockUserMessage,
      ]);
      const insertChain2 = mockChain(undefined);
      (insertChain2.returning as ReturnType<typeof vi.fn>).mockResolvedValue([
        mockAssistantMessage,
      ]);
      vi.mocked(db.insert)
        .mockReturnValueOnce(insertChain1 as never)
        .mockReturnValueOnce(insertChain2 as never);

      // update conversation updatedAt
      const updateChain = mockChain(undefined);
      vi.mocked(db.update).mockReturnValue(updateChain as never);

      // Memory mocks
      mockRecallMemory.mockResolvedValue({
        results: [{ chunks: [{ content: "Past memory" }] }],
      });
      mockGetUserProfile.mockResolvedValue("User is a developer");

      // Groq mock
      mockGroqCreate.mockResolvedValue({
        choices: [{ message: { content: "You're doing great!" } }],
      });
    }

    it("sends a message and returns user + assistant messages", async () => {
      setupSendMessageMocks({ conversationTitle: "Existing Title" });

      const result = await caller.conversation.sendMessage({
        conversationId: 1,
        content: "How am I doing?",
      });

      expect(result.userMessage).toEqual(mockUserMessage);
      expect(result.assistantMessage).toEqual(mockAssistantMessage);
    });

    it("calls memory recall and user profile", async () => {
      setupSendMessageMocks({ conversationTitle: "Existing Title" });

      await caller.conversation.sendMessage({
        conversationId: 1,
        content: "How am I doing?",
      });

      expect(mockRecallMemory).toHaveBeenCalledWith(
        "How am I doing?",
        "user_test_123",
      );
      expect(mockGetUserProfile).toHaveBeenCalledWith("user_test_123");
    });

    it("calls Groq with system prompt and history", async () => {
      setupSendMessageMocks({ conversationTitle: "Existing Title" });

      await caller.conversation.sendMessage({
        conversationId: 1,
        content: "How am I doing?",
      });

      expect(mockGroqCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "openai/gpt-oss-120b",
          temperature: 0.7,
          max_tokens: 1024,
        }),
      );

      // Verify system message includes memory context
      const callArgs = mockGroqCreate.mock.calls[0]![0] as {
        messages: Array<{ role: string; content: string }>;
      };
      const systemMsg = callArgs.messages[0]!;
      expect(systemMsg.role).toBe("system");
      expect(systemMsg.content).toContain("Comrade AI");
      expect(systemMsg.content).toContain("Past memory");
      expect(systemMsg.content).toContain("User is a developer");
    });

    it("auto-generates title on first message when no title exists", async () => {
      setupSendMessageMocks({
        conversationTitle: null,
        historyLength: 0,
      });

      // Title generation Groq call (second call)
      mockGroqCreate
        .mockResolvedValueOnce({
          choices: [{ message: { content: "You're doing great!" } }],
        })
        .mockResolvedValueOnce({
          choices: [{ message: { content: "Career Check-in" } }],
        });

      await caller.conversation.sendMessage({
        conversationId: 1,
        content: "How am I doing?",
      });

      // Groq called twice: response + title
      expect(mockGroqCreate).toHaveBeenCalledTimes(2);
    });

    it("skips title generation when conversation already has a title", async () => {
      setupSendMessageMocks({
        conversationTitle: "Already Named",
        historyLength: 4,
      });

      await caller.conversation.sendMessage({
        conversationId: 1,
        content: "How am I doing?",
      });

      // Groq called once only (response, not title)
      expect(mockGroqCreate).toHaveBeenCalledTimes(1);
    });

    it("handles memory recall failure gracefully", async () => {
      setupSendMessageMocks({ conversationTitle: "Test" });
      mockRecallMemory.mockRejectedValue(new Error("Memory unavailable"));

      const result = await caller.conversation.sendMessage({
        conversationId: 1,
        content: "Hello",
      });

      // Should still return a response despite memory failure
      expect(result.assistantMessage).toBeDefined();
    });

    it("throws when conversation is not owned by user", async () => {
      // getUserId
      const selectChain1 = mockChain([{ id: 1 }]);
      // conversation not found for this user
      const selectChain2 = mockChain([]);

      vi.mocked(db.select)
        .mockReturnValueOnce(selectChain1 as never)
        .mockReturnValueOnce(selectChain2 as never);

      await expect(
        caller.conversation.sendMessage({
          conversationId: 999,
          content: "Hello",
        }),
      ).rejects.toThrow("Conversation not found");
    });

    it("rejects empty message content (Zod validation)", async () => {
      await expect(
        caller.conversation.sendMessage({
          conversationId: 1,
          content: "",
        }),
      ).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("deletes a conversation", async () => {
      // getUserId
      const selectChain = mockChain([{ id: 1 }]);
      vi.mocked(db.select).mockReturnValue(selectChain as never);

      // delete
      const deleteChain = mockChain(undefined);
      vi.mocked(db.delete).mockReturnValue(deleteChain as never);

      const result = await caller.conversation.delete({ id: 1 });
      expect(result).toEqual({ success: true });
    });
  });

  describe("authentication", () => {
    it("rejects unauthenticated calls", async () => {
      const unauthCaller = createUnauthenticatedCaller();
      await expect(unauthCaller.conversation.getAll()).rejects.toThrow(
        "Unauthorized",
      );
    });
  });
});
