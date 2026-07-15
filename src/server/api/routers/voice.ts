import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

const VOICE_QUOTA_SECONDS = 300; // 5 minutes

export const voiceRouter = createTRPCRouter({
  getQuota: protectedProcedure.query(async ({ ctx }) => {
    const user = await db
      .select({ voiceSecondsUsed: users.voiceSecondsUsed })
      .from(users)
      .where(eq(users.clerkId, ctx.session.userId!))
      .then((rows) => rows[0]);

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    const used = user.voiceSecondsUsed;
    const remaining = Math.max(0, VOICE_QUOTA_SECONDS - used);

    return { used, limit: VOICE_QUOTA_SECONDS, remaining };
  }),

  recordUsage: protectedProcedure
    .input(z.object({ seconds: z.number().int().min(1) }))
    .mutation(async ({ input, ctx }) => {
      await db
        .update(users)
        .set({
          voiceSecondsUsed: sql`LEAST(${sql.raw(String(VOICE_QUOTA_SECONDS))}, ${users.voiceSecondsUsed} + ${input.seconds})`,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, ctx.session.userId!));

      return { success: true };
    }),
});
