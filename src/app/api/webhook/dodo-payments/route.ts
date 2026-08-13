import { Webhooks } from "@dodopayments/nextjs";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY!,

  onSubscriptionActive: async (payload) => {
    console.log("[DODO WEBHOOK] Subscription active:", payload);

    const customerEmail =
      payload.data?.customer?.email ?? payload.data?.customer?.email;
    const subscriptionId = payload.data?.subscription_id;
    const customerId = payload.data?.customer?.customer_id;

    if (!customerEmail) {
      console.error("[DODO WEBHOOK] No customer email in payload");
      return;
    }

    await db
      .update(users)
      .set({
        subscriptionPlan: "pro",
        subscriptionId: subscriptionId ?? null,
        dodoCustId: customerId ?? null,
        subscriptionStatus: "active",
        subscriptionStartedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.email, customerEmail));

    console.log(
      `[DODO WEBHOOK] User ${customerEmail} upgraded to pro`,
    );
  },

  onSubscriptionCancelled: async (payload) => {
    console.log("[DODO WEBHOOK] Subscription cancelled:", payload);

    const customerEmail = payload.data?.customer?.email;

    if (!customerEmail) {
      console.error("[DODO WEBHOOK] No customer email in payload");
      return;
    }

    await db
      .update(users)
      .set({
        subscriptionPlan: "free",
        subscriptionStatus: "cancelled",
        subscriptionEndsAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.email, customerEmail));

    console.log(
      `[DODO WEBHOOK] User ${customerEmail} downgraded to free`,
    );
  },

  onSubscriptionPaused: async (payload) => {
    console.log("[DODO WEBHOOK] Subscription paused:", payload);

    const customerEmail = payload.data?.customer?.email;

    if (!customerEmail) return;

    await db
      .update(users)
      .set({
        subscriptionPlan: "free",
        subscriptionStatus: "paused",
        updatedAt: new Date(),
      })
      .where(eq(users.email, customerEmail));
  },

  onPayload: async (payload) => {
    // Catch-all for logging all webhook events
    console.log("[DODO WEBHOOK] Event received:", JSON.stringify(payload).slice(0, 500));
  },
});
