import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
  phone: text().notNull().unique(),
  createdAt: int().default(Math.floor(Date.now() / 1000)),
updatedAt: int().default(Math.floor(Date.now() / 1000)),
});
