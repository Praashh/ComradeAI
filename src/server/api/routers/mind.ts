import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { env } from "@/env";

export const mindRouter = createTRPCRouter({
  getDocuments: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(500).default(100),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.userId!;

      const response = await fetch(
        "https://api.supermemory.ai/v3/documents/documents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.SUPERMEMORY_API_KEY}`,
          },
          body: JSON.stringify({
            page: input.page,
            limit: input.limit,
            sort: "createdAt",
            order: "desc",
            containerTags: [userId],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`SuperMemory API error: ${response.status}`);
      }

      const data = (await response.json()) as {
        documents: unknown[];
        pagination?: {
          currentPage: number;
          totalPages: number;
          total: number;
        };
      };
      return data;
    }),
});
