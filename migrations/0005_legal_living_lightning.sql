ALTER TABLE "users" ADD COLUMN "is_onboarded" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "nickname" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "pronouns" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dob" date;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "preferred_speaker" text;