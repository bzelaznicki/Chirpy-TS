import { pgTable, timestamp, varchar, uuid, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  hashedPassword: varchar("hashed_password").notNull().default("unset"),
  email: varchar("email", { length: 256 }).unique().notNull(),
  isChirpyRed: boolean("is_chirpy_red").default(false),
});

export type NewUser = typeof users.$inferInsert;

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: varchar("body", {length: 160}).unique().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
});

export type NewChirp = typeof chirps.$inferInsert;

export const refreshTokens = pgTable("refresh_tokens", {
  token: varchar("token", { length: 256 }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
  expiresAt: timestamp("expires_at").notNull(),
  revoked_at: timestamp("revoked_at")
});

export type NewRefreshToken = typeof refreshTokens.$inferInsert;