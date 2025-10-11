// lib/schema/contacts.ts
import { sqliteTable, integer, text, int } from 'drizzle-orm/sqlite-core';

export const contacts = sqliteTable('contacts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull().unique(),
  createdAt: int().default(Math.floor(Date.now() / 1000)),
    updatedAt: int().default(Math.floor(Date.now() / 1000)),
});
