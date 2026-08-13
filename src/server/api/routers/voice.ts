import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { PLANS } from "@/lib/products";
import type { PlanKey } from "@/lib/products";

export const voiceRouter = createTRPCRouter({
  getQuota: protectedProcedure.query(async ({ ctx }) => {
    const user = await db
      .select({
        voiceSecondsUsed: users.voiceSecondsUsed,
        subscriptionPlan: users.subscriptionPlan,
      })
      .from(users)
      .where(eq(users.clerkId, ctx.session.userId!))
      .then((rows) => rows[0]);

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    const plan = (user.subscriptionPlan as PlanKey) ?? "free";
    const limit =
      PLANS[plan]?.voiceQuotaSeconds ?? PLANS.free.voiceQuotaSeconds;
    const used = user.voiceSecondsUsed;
    const remaining = Math.max(0, limit - used);

    return { used, limit, remaining, plan };
  }),

  recordUsage: protectedProcedure
    .input(z.object({ seconds: z.number().int().min(1) }))
    .mutation(async ({ input, ctx }) => {
      // Fetch user to get plan-aware limit
      const user = await db
        .select({ subscriptionPlan: users.subscriptionPlan })
        .from(users)
        .where(eq(users.clerkId, ctx.session.userId!))
        .then((rows) => rows[0]);

      const plan = (user?.subscriptionPlan as PlanKey) ?? "free";
      const limit =
        PLANS[plan]?.voiceQuotaSeconds ?? PLANS.free.voiceQuotaSeconds;

      await db
        .update(users)
        .set({
          voiceSecondsUsed: sql`LEAST(${sql.raw(String(limit))}, ${users.voiceSecondsUsed} + ${input.seconds})`,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, ctx.session.userId!));

      return { success: true };
    }),
});

