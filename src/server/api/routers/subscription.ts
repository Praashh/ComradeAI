import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

export const subscriptionRouter = createTRPCRouter({
  /**
   * Get the current user's subscription status.
   */
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await db
      .select({
        subscriptionPlan: users.subscriptionPlan,
        subscriptionStatus: users.subscriptionStatus,
        subscriptionId: users.subscriptionId,
        dodoCustId: users.dodoCustId,
        subscriptionStartedAt: users.subscriptionStartedAt,
        subscriptionEndsAt: users.subscriptionEndsAt,
      })
      .from(users)
      .where(eq(users.clerkId, ctx.session.userId!))
      .then((rows) => rows[0]);

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return {
      plan: user.subscriptionPlan,
      status: user.subscriptionStatus,
      subscriptionId: user.subscriptionId,
      customerId: user.dodoCustId,
      startedAt: user.subscriptionStartedAt,
      endsAt: user.subscriptionEndsAt,
    };
  }),

  /**
   * Get the customer portal URL for the current user.
   * Returns null if the user has no Dodo customer ID.
   */
  getPortalUrl: protectedProcedure.query(async ({ ctx }) => {
    const user = await db
      .select({ dodoCustId: users.dodoCustId })
      .from(users)
      .where(eq(users.clerkId, ctx.session.userId!))
      .then((rows) => rows[0]);

    if (!user?.dodoCustId) {
      return { url: null };
    }

    return {
      url: `/api/customer-portal?customer_id=${user.dodoCustId}`,
    };
  }),
});
