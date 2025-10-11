// lib/schema/transactions.ts
import { sqliteTable, integer, text, real, int } from 'drizzle-orm/sqlite-core';

export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(), // "income" | "expense" | "borrow" | "lend" | "repayment"
  amount: real('amount').notNull(),
  description: text('description'),
  messageKey: text('message_key'), // transaction message or hash
  accountId: integer('account_id').notNull(), // FK to accounts.id
  contactId: integer('contact_id'), // FK to contacts.id
  createdAt: int().default(Math.floor(Date.now() / 1000)),
    updatedAt: int().default(Math.floor(Date.now() / 1000)),
});
