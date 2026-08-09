import "server-only";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getUserOnboardingStatus(userId: string) {
  return db
    .select({ isOnboarded: users.isOnboarded })
    .from(users)
    .where(eq(users.clerkId, userId))
    .then((rows) => rows[0]);
}

export async function requireOnboarded() {
  const { userId } = await auth();
  if (!userId) return;

  const user = await getUserOnboardingStatus(userId);

  // User row might not exist yet if Clerk webhook hasn't fired
  if (!user) return;

  if (!user.isOnboarded) {
    redirect("/onboarding");
  }
}

export async function requireNotOnboarded() {
  const { userId } = await auth();
  if (!userId) return;

  const user = await getUserOnboardingStatus(userId);

  if (user?.isOnboarded) {
    redirect("/write");
  }
}
