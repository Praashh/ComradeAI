import { createCaller } from "@/server/api/root";
import type { createTRPCContext } from "@/server/api/trpc";

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Creates an authenticated tRPC caller with a fake Clerk session.
 */
export function createAuthenticatedCaller(userId = "user_test_123") {
  const ctx: Context = {
    headers: new Headers(),
    session: {
      userId,
    } as Context["session"],
  };
  return createCaller(ctx);
}

/**
 * Creates an unauthenticated tRPC caller (no session).
 */
export function createUnauthenticatedCaller() {
  const ctx: Context = {
    headers: new Headers(),
    session: null as unknown as Context["session"],
  };
  return createCaller(ctx);
}
