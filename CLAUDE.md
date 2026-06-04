# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev              # Start dev server (Next.js with Turbo)
bun run build        # Production build
bun run check        # Lint + typecheck
bun run lint:fix     # Auto-fix lint issues
bun run format:write # Format with Prettier
bun run typecheck    # TypeScript validation only
```

## Architecture

**Stack**: Next.js 15 (App Router) + React 19 + TypeScript + tRPC 11 + Drizzle ORM + Clerk auth + SuperMemory + Tailwind CSS 4

**API layer**: tRPC with `publicProcedure` and `protectedProcedure` (Clerk session check). Server routers live in `src/server/api/routers/`. The root router is assembled in `src/server/api/root.ts`. Client-side tRPC provider and React Query setup are in `src/trpc/`.

**Database**: PostgreSQL via Neon serverless driver. Schema defined in `src/db/schema.ts`, client initialized in `src/db/drizzle.ts`. Migrations managed by Drizzle Kit (`drizzle.config.ts`, `/migrations`).

**Auth**: Clerk handles authentication. Middleware in `src/middleware.ts` protects `/chat` and `/write` routes. Clerk session is injected into tRPC context (`src/server/api/trpc.ts`).

**Memory system**: `src/lib/memory.ts` is a singleton wrapping SuperMemory SDK. Journal entries are saved/recalled via the `memory` tRPC router, using `containerTag` for per-user isolation.

**Editor**: Milkdown markdown editor, dynamically imported (no SSR) via `MilkdownEditorClient.tsx`. Uses imperative handle pattern to extract editor content from parent components.

**Styling**: Custom CSS variables in `src/styles/globals.css` define a warm/paper aesthetic. shadcn/ui components in `src/components/ui/`. Responsive breakpoints: tablet (860px), mobile (560px).

## Key Directories

- `src/app/` — Pages and route handlers (App Router)
- `src/app/_components/` — App-specific components (editor, landing sections, layout)
- `src/server/api/routers/` — tRPC route handlers
- `src/db/` — Drizzle schema and database client
- `src/lib/` — Utilities and service wrappers (memory, cn)
- `src/components/ui/` — shadcn/ui primitives

## Environment

Required env vars are validated in `src/env.js` using `@t3-oss/env-nextjs` with Zod. See `.env.example` for the full list: `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `SUPERMEMORY_API_KEY`, `DATABASE_URL`.
