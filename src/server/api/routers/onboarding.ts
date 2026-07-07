import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { VALID_CHARACTER_IDS } from "@/lib/characters";
import { Memory } from "@/lib/memory";
import { splitByMarkdownSections } from "@/lib/text-utils";

const memoryInstance = Memory.getInstance();

export const onboardingRouter = createTRPCRouter({
  getOnboardingStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await db
      .select({
        isOnboarded: users.isOnboarded,
        nickname: users.nickname,
        pronouns: users.pronouns,
        dob: users.dob,
        preferredSpeaker: users.preferredSpeaker,
      })
      .from(users)
      .where(eq(users.clerkId, ctx.session.userId!))
      .then((rows) => rows[0]);

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return user;
  }),

  completeOnboarding: protectedProcedure
    .input(
      z.object({
        nickname: z.string().min(1).max(50),
        pronouns: z.enum(["he/him", "she/her", "they/them"]),
        dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        preferredSpeaker: z.enum(
          VALID_CHARACTER_IDS as unknown as [string, ...string[]],
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await db
        .update(users)
        .set({
          nickname: input.nickname,
          pronouns: input.pronouns,
          dob: input.dob,
          preferredSpeaker: input.preferredSpeaker,
          isOnboarded: true,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, ctx.session.userId!));

      return { success: true };
    }),

  importMemory: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.userId!;
      const chunks = splitByMarkdownSections(input.content);

      const results = await Promise.allSettled(
        chunks.map((chunk) =>
          memoryInstance.saveInMemory(
            `[Imported memory] ${chunk}`,
            userId,
          ),
        ),
      );

      const successCount = results.filter(
        (r) => r.status === "fulfilled",
      ).length;

      return { imported: successCount, total: chunks.length };
    }),
});
