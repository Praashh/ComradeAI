import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/db/drizzle";
import { conversations, messages } from "@/db/schema";
import { eq, and, asc, desc } from "drizzle-orm";
import { getUserIdByClerkId } from "@/server/api/helpers/get-user-id";
import {
  retrieveChatContext,
  generateChatResponse,
  generateConversationTitle,
} from "@/server/api/services/chat-service";

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

      // Save user message
      const [userMessage] = await db
        .insert(messages)
        .values({
          conversationId: input.conversationId,
          role: "user",
          content: input.content,
        })
        .returning();

      // Recall memories and user profile for context
      const chatContext = await retrieveChatContext(input.content, clerkId);

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
        const title = await generateConversationTitle(input.content);
        if (title) {
          await db
            .update(conversations)
            .set({ title, updatedAt: new Date() })
            .where(eq(conversations.id, input.conversationId));
        }
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
