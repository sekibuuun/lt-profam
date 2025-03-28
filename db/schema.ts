import { text, timestamp, pgTable, serial, integer } from "drizzle-orm/pg-core";

export const invites = pgTable("invites", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  inviteId: integer("invite_id").references(() => invites.id).notNull(),
  uploadedAt: timestamp("uploaded_at", { mode: "string" }).defaultNow().notNull(),
});