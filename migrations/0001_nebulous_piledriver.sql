ALTER TABLE "journals" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "journals" ADD COLUMN "summarized_at" timestamp;--> statement-breakpoint
ALTER TABLE "journals" ADD COLUMN "memory_synced_at" timestamp;