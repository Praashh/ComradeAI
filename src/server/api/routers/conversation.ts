import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/db/drizzle";
import { conversations, messages } from "@/db/schema";
import { eq, and, asc, desc } from "drizzle-orm";
import { getUserIdByClerkId } from "@/server/api/helpers/get-user-id";
import { Memory } from "@/lib/memory";
import {
  retrieveChatContext,
  generateChatResponse,
  generateConversationTitle,
} from "@/server/api/services/chat-service";

const memoryInstance = Memory.getInstance();

export const conversationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const userId = await getUserIdByClerkId(ctx.session.userId!);

      const [conversation] = await db
        .insert(conversations)
        .values({ userId, title: input.title ?? null })
        .returning();

      return { conversation: conversation! };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = await getUserIdByClerkId(ctx.session.userId!);

    const allConversations = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));

    return { conversations: allConversations };
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const userId = await getUserIdByClerkId(ctx.session.userId!);

      const conversation = await db
        .select()
        .from(conversations)
        .where(
          and(
            eq(conversations.id, input.id),
            eq(conversations.userId, userId),
          ),
        )
        .then((rows) => rows[0]);

      if (!conversation) throw new Error("Conversation not found");

      const allMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, input.id))
        .orderBy(asc(messages.createdAt));

      return { conversation, messages: allMessages };
    }),

  updateTitle: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1, "Title cannot be empty").max(100, "Title is too long"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = await getUserIdByClerkId(ctx.session.userId!);

      const [updated] = await db
        .update(conversations)
        .set({
          title: input.title.trim(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(conversations.id, input.id),
            eq(conversations.userId, userId),
          ),
        )
        .returning();

      if (!updated) {
        throw new Error("Conversation not found");
      }

      return { conversation: updated };
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const clerkId = ctx.session.userId!;
      const userId = await getUserIdByClerkId(clerkId);

      // Verify ownership
      const conversation = await db
        .select()
        .from(conversations)
        .where(
          and(
            eq(conversations.id, input.conversationId),
            eq(conversations.userId, userId),
          ),
        )
        .then((rows) => rows[0]);

      if (!conversation) throw new Error("Conversation not found");

      // Save user message and Recall memories and user profile for context
      const [[userMessage], chatContext] = await Promise.all([
        db
          .insert(messages)
          .values({
            conversationId: input.conversationId,
            role: "user",
            content: input.content,
          })
          .returning(),
        retrieveChatContext(input.content, clerkId),
      ]);

      // Save user thought / context into Supermemory asynchronously
      void Promise.resolve(
        memoryInstance.saveInMemory(input.content, clerkId),
      ).catch((err) => {
        console.error(`[CHAT:MEMORY_SAVE] Failed to save chat memory: ${String(err)}`);
      });

      // Fetch conversation history for Groq
      const history = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, input.conversationId))
        .orderBy(asc(messages.createdAt));

      // Generate AI response with guardrails
      const assistantContent = await generateChatResponse(
        input.content,
        history,
        chatContext,
      );

      // Save assistant message
      const [assistantMessage] = await db
        .insert(messages)
        .values({
          conversationId: input.conversationId,
          role: "assistant",
          content: assistantContent,
        })
        .returning();

      // Auto-generate title on first user message
      if (!conversation.title && history.length <= 1) {
        let title = await generateConversationTitle(input.content);
        if (!title?.trim()) {
          const trimmed = input.content.trim();
          title = trimmed.length > 32 ? `${trimmed.slice(0, 32)}...` : trimmed;
        }
        await db
          .update(conversations)
          .set({ title, updatedAt: new Date() })
          .where(eq(conversations.id, input.conversationId));
      } else {
        await db
          .update(conversations)
          .set({ updatedAt: new Date() })
          .where(eq(conversations.id, input.conversationId));
      }

      return {
        userMessage: userMessage!,
        assistantMessage: assistantMessage!,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const userId = await getUserIdByClerkId(ctx.session.userId!);

      await db
        .delete(conversations)
        .where(
          and(
            eq(conversations.id, input.id),
            eq(conversations.userId, userId),
          ),
        );

      return { success: true };
    }),
});
