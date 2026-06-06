import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/db/drizzle";
import { journals, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

async function getUserId(clerkId: string) {
  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .then((rows) => rows[0]);

  if (!user) {
    throw new Error("User not found");
  }
  return user.id;
}

export const journalRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        mood: z.string().optional(),
        icon: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = await getUserId(ctx.session.userId!);

      const [journal] = await db
        .insert(journals)
        .values({
          userId,
          title: input.title,
          content: "",
          mood: input.mood,
          icon: input.icon,
          color: input.color,
        })
        .returning();

      return { journal: journal! };
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const userId = await getUserId(ctx.session.userId!);

      const journal = await db
        .select()
        .from(journals)
        .where(and(eq(journals.id, input.id), eq(journals.userId, userId)))
        .then((rows) => rows[0]);

      if (!journal) {
        throw new Error("Journal not found");
      }

      return { journal };
    }),

  save: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string(),
        mood: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = await getUserId(ctx.session.userId!);

      const [updated] = await db
        .update(journals)
        .set({
          title: input.title,
          content: input.content,
          mood: input.mood,
          updatedAt: new Date(),
        })
        .where(
          and(eq(journals.id, input.id), eq(journals.userId, userId)),
        )
        .returning();

      return { journal: updated };
    }),
});
