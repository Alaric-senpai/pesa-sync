// lib/schema/evidence.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const evidence = sqliteTable('evidence', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Links
  transactionId: integer('transaction_id'),
  debtId: integer('debt_id'),

  // Main content
  message: text('message').notNull(), // transaction message body
  // referenceUri: text('reference_uri'), // optional link to an image or file

  type: text('type').default('message'), // "message", "image", "pdf"

  // Timestamps
  createdAt: integer('created_at').default(Math.floor(Date.now() / 1000)),
  updatedAt: integer('updated_at').default(Math.floor(Date.now() / 1000)),
});
