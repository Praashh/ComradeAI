import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_KEY!;

interface DodoWebhookPayload {
  type: string;
  data?: {
    subscription_id?: string;
    status?: string;
    customer?: {
      customer_id?: string;
      email?: string;
    };
    metadata?: Record<string, unknown>;
  };
}

export async function POST(req: NextRequest) {
  try {
    const webhookId = req.headers.get("webhook-id");
    const webhookSignature = req.headers.get("webhook-signature");
    const webhookTimestamp = req.headers.get("webhook-timestamp");

    if (!webhookId || !webhookSignature || !webhookTimestamp) {
      console.error("[DODO WEBHOOK] Missing webhook headers");
      return NextResponse.json(
        { error: "Missing webhook headers" },
        { status: 400 },
      );
    }

    const body = await req.text();

    if (!webhookSecret) {
      console.error("[DODO WEBHOOK] Missing DODO_PAYMENTS_WEBHOOK_KEY env variable");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const webhook = new Webhook(webhookSecret);

    try {
      await webhook.verify(body, {
        "webhook-id": webhookId,
        "webhook-signature": webhookSignature,
        "webhook-timestamp": webhookTimestamp,
      });
    } catch (err) {
      console.error("[DODO WEBHOOK] Verification failed:", err);
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 },
      );
    }

    const payload = JSON.parse(body) as DodoWebhookPayload;
    console.log("[DODO WEBHOOK] Event type:", payload.type);
    console.log("[DODO WEBHOOK] Event data:", JSON.stringify(payload.data, null, 2));

    const metadata = payload.data?.metadata ?? {};
    const clerkUserId = typeof metadata.userId === "string" ? metadata.userId : undefined;
    const customerEmail =
      payload.data?.customer?.email ??
      (typeof metadata.email === "string" ? metadata.email : undefined);
    const subscriptionId = payload.data?.subscription_id;
    const customerId = payload.data?.customer?.customer_id;

    switch (payload.type) {
      case "payment.succeeded":
      case "subscription.active":
      case "subscription.created":
      case "subscription.renewed": {
        console.log("[DODO WEBHOOK] Activating subscription for user:", clerkUserId ?? customerEmail);

        if (clerkUserId) {
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
            .where(eq(users.clerkId, clerkUserId));
        } else if (customerEmail) {
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
        }
        break;
      }

      case "payment.failed":
      case "subscription.failed": {
        console.log("[DODO WEBHOOK] Payment/Subscription failed for user:", clerkUserId ?? customerEmail);

        if (clerkUserId) {
          await db
            .update(users)
            .set({
              subscriptionStatus: "failed",
              updatedAt: new Date(),
            })
            .where(eq(users.clerkId, clerkUserId));
        } else if (customerEmail) {
          await db
            .update(users)
            .set({
              subscriptionStatus: "failed",
              updatedAt: new Date(),
            })
            .where(eq(users.email, customerEmail));
        }
        break;
      }

      case "subscription.cancelled":
      case "subscription.expired": {
        console.log("[DODO WEBHOOK] Cancelling subscription for user:", clerkUserId ?? customerEmail);

        if (clerkUserId) {
          await db
            .update(users)
            .set({
              subscriptionPlan: "free",
              subscriptionStatus: "cancelled",
              subscriptionEndsAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(users.clerkId, clerkUserId));
        } else if (customerEmail) {
          await db
            .update(users)
            .set({
              subscriptionPlan: "free",
              subscriptionStatus: "cancelled",
              subscriptionEndsAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(users.email, customerEmail));
        }
        break;
      }

      case "subscription.paused": {
        console.log("[DODO WEBHOOK] Pausing subscription for user:", clerkUserId ?? customerEmail);

        if (clerkUserId) {
          await db
            .update(users)
            .set({
              subscriptionPlan: "free",
              subscriptionStatus: "paused",
              updatedAt: new Date(),
            })
            .where(eq(users.clerkId, clerkUserId));
        } else if (customerEmail) {
          await db
            .update(users)
            .set({
              subscriptionPlan: "free",
              subscriptionStatus: "paused",
              updatedAt: new Date(),
            })
            .where(eq(users.email, customerEmail));
        }
        break;
      }

      case "subscription.updated": {
        const newStatus = payload.data?.status ?? "updated";
        console.log("[DODO WEBHOOK] Subscription updated for user:", clerkUserId ?? customerEmail, "Status:", newStatus);

        const isNowActive = newStatus === "active";
        const newPlan = isNowActive ? "pro" : "free";

        if (clerkUserId) {
          await db
            .update(users)
            .set({
              subscriptionPlan: newPlan,
              subscriptionStatus: newStatus,
              updatedAt: new Date(),
            })
            .where(eq(users.clerkId, clerkUserId));
        } else if (customerEmail) {
          await db
            .update(users)
            .set({
              subscriptionPlan: newPlan,
              subscriptionStatus: newStatus,
              updatedAt: new Date(),
            })
            .where(eq(users.email, customerEmail));
        }
        break;
      }

      default:
        console.log("[DODO WEBHOOK] Unhandled event type:", payload.type);
    }

    return NextResponse.json({ received: true, type: payload.type }, { status: 200 });
  } catch (error) {
    console.error("[DODO WEBHOOK] Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
