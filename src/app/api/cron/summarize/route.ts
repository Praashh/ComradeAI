import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { journals } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import Groq from "groq-sdk";
import { env } from "@/env";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Journals that were never summarized OR were updated after last summary
  const stale = await db
    .select({ id: journals.id, content: journals.content })
    .from(journals)
    .where(
      sql`${journals.content} != '' AND (${journals.summarizedAt} IS NULL OR ${journals.summarizedAt} < ${journals.updatedAt})`,
    );

  const results = await Promise.allSettled(
    stale.map(async (journal) => {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that summarizes journal entries. Provide a concise 2-3 sentence summary capturing the key themes, emotions, and events. Be warm and empathetic.",
          },
          {
            role: "user",
            content: journal.content,
          },
        ],
        temperature: 0.3,
        max_tokens: 256,
      });

      const summary = completion.choices[0]?.message?.content;

      if (summary) {
        await db
          .update(journals)
          .set({ summary, summarizedAt: new Date() })
          .where(eq(journals.id, journal.id));
        return true;
      }
      return false;
    }),
  );

  const processed = results.filter(
    (r) => r.status === "fulfilled" && r.value === true,
  ).length;

  return NextResponse.json({
    success: true,
    processed,
    total: stale.length,
  });
}
