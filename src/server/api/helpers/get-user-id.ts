import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function getUserIdByClerkId(clerkId: string): Promise<number> {
  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .then((rows) => rows[0]);

  if (!user) throw new Error("User not found");
  return user.id;
}
