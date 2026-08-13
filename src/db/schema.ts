import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),

  bio: text("bio"),

  isOnboarded: boolean("is_onboarded").default(false).notNull(),
  nickname: text("nickname"),
  pronouns: text("pronouns"),
  dob: date("dob", { mode: "string" }),
  preferredSpeaker: text("preferred_speaker"),

  voiceSecondsUsed: integer("voice_seconds_used").default(0).notNull(),

  // Subscription / billing fields (Dodo Payments)
  subscriptionPlan: text("subscription_plan").default("free").notNull(),
  subscriptionId: text("subscription_id"),
  dodoCustId: text("dodo_customer_id"),
  subscriptionStatus: text("subscription_status"),
  subscriptionStartedAt: timestamp("subscription_started_at"),
  subscriptionEndsAt: timestamp("subscription_ends_at"),

  comradeSummary: text("mira_summary"),
  comradeSummaryUpdatedAt: timestamp("mira_summary_updated_at"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const journals = pgTable("journals", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title"),
  content: text("content").notNull(),
  mood: text("mood"),
  icon: text("icon"),
  color: text("color"),

  summary: text("summary"),
  summarizedAt: timestamp("summarized_at"),
  memorySyncedAt: timestamp("memory_synced_at"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
]);

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),

  conversationId: integer("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: messageRoleEnum("role").notNull(),
  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});
