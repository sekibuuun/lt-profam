import { integer, text, boolean, timestamp, pgTable } from "drizzle-orm/pg-core";

export const invites = pgTable("invites", {
  id: integer("id").primaryKey(),
  code: text("code").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const files = pgTable("files", {
  id: integer("id").primaryKey(),
  filename: text("filename").notNull(),
  filepath: text("filepath").notNull(),
  uploadedAt: timestamp("uploaded_at", { mode: "string" }).defaultNow().notNull(),
});
