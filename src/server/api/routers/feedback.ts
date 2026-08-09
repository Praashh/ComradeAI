import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/env";
import { getUserIdByClerkId } from "@/server/api/helpers/get-user-id";

export const feedbackRouter = createTRPCRouter({
  submit: protectedProcedure
    .input(
      z.object({
        type: z.enum(["feature", "bug", "general", "improvements"]),
        message: z.string().min(5, "Message must be at least 5 characters"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Get DB user details
      const userId = await getUserIdByClerkId(ctx.session.userId!);
      const dbUser = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.clerkId, ctx.session.userId!))
        .then((rows) => rows[0]);

      const email = dbUser?.email ?? "unknown";

      // Send to Discord Webhook
      try {
        const discordResponse = await fetch(env.FEEDBACK_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            embeds: [
              {
                title: "New Feedback Received",
                color: 13318704, // Comrade red (#cb3a28 in decimal)
                fields: [
                  {
                    name: "Type",
                    value: input.type.toUpperCase(),
                    inline: true,
                  },
                  {
                    name: "User Email",
                    value: email,
                    inline: true,
                  },
                  {
                    name: "User ID (DB / Clerk)",
                    value: `${userId ?? "N/A"} / ${ctx.session.userId}`,
                    inline: false,
                  },
                  {
                    name: "Message",
                    value: input.message,
                    inline: false,
                  },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });

        if (!discordResponse.ok) {
          const errorText = await discordResponse.text();
          console.error("Failed to send feedback to Discord:", errorText);
          throw new Error("Failed to forward feedback to notifications channel.");
        }
      } catch (error) {
        console.error("Error sending feedback to Discord:", error);
        throw new Error("Could not send feedback. Please try again later.");
      }

      return { success: true };
    }),
});
