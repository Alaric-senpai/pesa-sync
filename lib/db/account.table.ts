// lib/schema/accounts.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable('accounts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(), // e.g., "M-Pesa", "Cash", "Bank"
  type: text('type').notNull(), // e.g., "mobile", "bank", "cash"
  // balance: integer('balance').default(0),
  currency: text('currency').default('KES'), // e.g., "KES", "USD"
  userId: integer('user_id').notNull(), // Foreign key to users table
  debtAmount: integer('debt_amount').default(0), // Amount owed
  incomeAmount: integer('income_amount').default(0), // Total income
  DebtedAmount: integer('debted_amount').default(0), // Total amount lent to others
  // Timestamps
  createdAt: integer('created_at').default(Math.floor(Date.now() / 1000)),
  updatedAt: integer('updated_at').default(Math.floor(Date.now() / 1000)),
});
