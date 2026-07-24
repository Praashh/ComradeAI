# Comrade AI

The friend who listens, understands, and remembers.

Comrade AI is an AI journaling companion that learns from your writing and provides personalized emotional support through intelligent journaling, voice conversations, text chat, and emotional insights.

## Features

### Intelligent Journaling (`/write`)
Rich markdown editor with mood tagging. Journal entries are semantically indexed via SuperMemory so the AI understands your history and emotional patterns over time.

### Voice Conversations (`/talk`)
Real-time voice calls powered by LiveKit. Choose from multiple AI speaker personas. Includes a per-user quota system (5 minutes free).

### AskComrade Chat (`/chat`)
Text-based conversations backed by memory-aware context. The AI recalls relevant journal entries and your profile to provide personalized responses. Conversations are persisted with auto-generated titles.

### Mind Graph (`/mind`)
Visual knowledge graph of your memories and emotional patterns using SuperMemory's memory graph component.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| API | tRPC 11 with React Query |
| Database | PostgreSQL (Neon serverless) + Drizzle ORM |
| Auth | Clerk |
| LLM | Groq (Llama 3.3 70B) |
| Memory | SuperMemory (semantic storage & retrieval) |
| Voice | LiveKit |
| Editor | Milkdown (markdown) |
| Styling | Tailwind CSS 4, shadcn/ui |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) runtime
- PostgreSQL database (recommended: [Neon](https://neon.tech))
- Account keys for Clerk, SuperMemory, Groq, and LiveKit

### Setup

1. Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd talktome
bun install
```

2. Copy the example env file and fill in your keys:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | Clerk backend key |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend key |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret |
| `SUPERMEMORY_API_KEY` | SuperMemory API key |
| `GROQ_API_KEY` | Groq API key |
| `CRON_SECRET` | Secret for cron job endpoints |

3. Push the database schema:

```bash
bun run db:push
```

4. Start the dev server:

```bash
bun dev
```

The app will be available at `http://localhost:3000`.

## Scripts

```bash
bun dev              # Start dev server (Next.js + Turbo)
bun run build        # Production build
```

## License

Private.
