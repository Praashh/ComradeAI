import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/lib/payment/dodo";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await auth();
  const { productId } = (await request.json()) as { productId?: string };

  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 },
    );
  }

  if (!session?.userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Fetch user email from DB
  const user = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.clerkId, session.userId))
    .then((rows) => rows[0]);

  try {
    const checkoutSessionResponse = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      metadata: {
        product_id: productId,
        email: user?.email ?? "",
        userId: session.userId,
      },
      return_url: (process.env.DODO_PAYMENTS_RETURN_URL ?? "http://localhost:3000") + "/checkout/status",
    });

    console.log("[CHECKOUT] Session created:", checkoutSessionResponse.session_id);
    return NextResponse.json(checkoutSessionResponse);
  } catch (error) {
    console.error("[CHECKOUT] Error creating checkout session:", error);
    return NextResponse.json(
      {
        message: "Error creating checkout session",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
