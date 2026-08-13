import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/chat(.*)", "/write(.*)", "/mind(.*)", "/talk(.*)", "/onboarding(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and dodo webhook
    "/((?!_next|api/cron|api/webhook/dodo-payments|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes (except cron and dodo webhook)
    "/(api(?!/cron|/webhook/dodo-payments)|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
