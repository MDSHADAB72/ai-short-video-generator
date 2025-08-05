import { boolean, serial, varchar, text, integer, timestamp, json } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

/**
 * Users table - stores user information from Clerk authentication
 */
export const Users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", 255).notNull(),
    email: varchar("email", 255).notNull().unique(),
    imageUrl: varchar("image_url", 255),
    subscription: boolean("subscription").default(false),
});

/**
 * Scripts table - stores AI-generated video scripts and audio metadata
 */
export const Scripts = pgTable("scripts", {
    id: varchar("id", 255).primaryKey(),
    userId: varchar("user_id", 255), // Changed from integer to varchar for Clerk user IDs
    content: text("content").notNull(),
    audioUrl: varchar("audio_url", 500),
    localPath: varchar("local_path", 500),
    voiceSettings: json("voice_settings"),
    audioGenerated: boolean("audio_generated").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});
