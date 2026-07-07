import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { journals, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Memory } from "@/lib/memory";
import { env } from "process";

const memoryInstance = Memory.getInstance();

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Journals that were never synced OR were updated after last sync
  const stale = await db
    .select({
      id: journals.id,
      content: journals.content,
      clerkId: users.clerkId,
    })
    .from(journals)
    .innerJoin(users, eq(journals.userId, users.id))
    .where(
      sql`${journals.content} != '' AND (${journals.memorySyncedAt} IS NULL OR ${journals.memorySyncedAt} < ${journals.updatedAt})`,
    );

  console.log('[SYNC-MEMORY]: got this stale', stale);

  const results = await Promise.allSettled(
    stale.map(async (journal) => {
      await memoryInstance.saveInMemory(journal.content, journal.clerkId);
      await db
        .update(journals)
        .set({ memorySyncedAt: new Date() })
        .where(eq(journals.id, journal.id));
    }),
  );

  const processed = results.filter((r) => r.status === "fulfilled").length;

  return NextResponse.json({
    success: true,
    processed,
    total: stale.length,
  });
}
