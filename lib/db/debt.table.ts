// lib/schema/debts.ts
import { sqliteTable, integer, text, real, int } from 'drizzle-orm/sqlite-core';

export const debts = sqliteTable('debts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  contactId: integer('contact_id').notNull(), // who owes or is owed
  amount: real('amount').notNull(),
  // Total amount paid so far (supports partial payments). When paid >= amount, debt is settled.
  paid: real('paid').default(0),
  direction: text('direction').notNull(), // "owed_to_me" or "i_owe"
  reason: text('reason'),
  dueDate: integer('due_date'), // optional timestamp
  settled: integer('settled').default(0), // boolean 0|1
  createdAt: int().default(Math.floor(Date.now() / 1000)),
    updatedAt: int().default(Math.floor(Date.now() / 1000)),
});
