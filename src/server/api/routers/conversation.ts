import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/db/drizzle";
import { conversations, messages, users } from "@/db/schema";
import { eq, and, asc, desc } from "drizzle-orm";
import { Memory } from "@/lib/memory";
import { env } from "@/env";
import Groq from "groq-sdk";

const memoryInstance = Memory.getInstance();
const groq = new Groq({ apiKey: env.GROQ_API_KEY });

async function getUserId(clerkId: string) {
  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .then((rows) => rows[0]);

  if (!user) throw new Error("User not found");
  return user.id;
}

export const conversationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const userId = await getUserId(ctx.session.userId!);

      const [conversation] = await db
        .insert(conversations)
        .values({ userId, title: input.title ?? null })
        .returning();

      return { conversation: conversation! };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = await getUserId(ctx.session.userId!);

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
      const userId = await getUserId(ctx.session.userId!);

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
      const userId = await getUserId(clerkId);

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
      let memoryContext = "";
      let userProfile = "";

      const [recallResult, profileResult] = await Promise.allSettled([
        memoryInstance.recallMemory(input.content, clerkId),
        memoryInstance.getUserProfile(clerkId),
      ]);

      if (recallResult.status === "fulfilled" && recallResult.value?.results?.length) {
        memoryContext = recallResult.value.results
          .flatMap((r: { chunks?: Array<{ content: string }>; content?: string | null }) => {
            // chunks contain the actual matching content; content is only present with includeFullDocs
            if (r.chunks?.length) {
              const joined = r.chunks.map((c) => c.content).join("\n");
              return joined ? [joined] : [];
            }
            const text = r.content ?? "";
            return text ? [text] : [];
          })
          .join("\n\n");
        console.log(`[CHAT]: Memory context retrieved, length=${memoryContext.length}`);
      } else {
        console.log(`[CHAT]: Memory recall ${recallResult.status === "rejected" ? `failed: ${String(recallResult.reason)}` : "returned no results"}`);
      }

      if (profileResult.status === "fulfilled" && profileResult.value) {
        const profile = profileResult.value;
        userProfile = typeof profile === "string" ? profile : JSON.stringify(profile);
        console.log(`[CHAT]: User profile retrieved, length=${userProfile.length}`);
      } else {
        console.log(`[CHAT]: Profile fetch ${profileResult.status === "rejected" ? "failed" : "returned empty"}`);
      }

      // Fetch conversation history for Groq
      const history = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, input.conversationId))
        .orderBy(asc(messages.createdAt));

      const systemParts = [
        `You are Mira, a warm and thoughtful personal companion. You have access to the user's journal entries and memories to provide personalized, empathetic responses. Be conversational, supportive, and insightful. Keep responses concise but meaningful.`,
        `IMPORTANT: When the user asks personal questions (like "who am I", "what do I do", etc.), you MUST use the context provided below to answer with specific details. Never say you don't know something if the information is available in the context.`,
      ];

      if (userProfile) {
        systemParts.push(`Here is the user's profile summary:\n\n${userProfile}`);
      }

      if (memoryContext) {
        systemParts.push(`Here is relevant context from the user's journals and memories:\n\n${memoryContext}`);
      }

      if (!userProfile && !memoryContext) {
        systemParts.push(`Note: No memories or profile data were found for this user yet. Let them know you'll learn more about them as they write journal entries.`);
      }

      const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: systemParts.join("\n\n"),
        },
        ...history.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      // Call Groq
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const assistantContent =
        completion.choices[0]?.message?.content ?? "I'm sorry, I couldn't generate a response.";

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
        try {
          const titleCompletion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content:
                  "Generate a short title (3-5 words max) for this conversation. Return only the title, nothing else.",
              },
              { role: "user", content: input.content },
            ],
            temperature: 0.5,
            max_tokens: 20,
          });
          const title = titleCompletion.choices[0]?.message?.content?.trim();
          if (title) {
            await db
              .update(conversations)
              .set({ title, updatedAt: new Date() })
              .where(eq(conversations.id, input.conversationId));
          }
        } catch {
          console.log("[CHAT]: Title generation failed");
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
      const userId = await getUserId(ctx.session.userId!);

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
