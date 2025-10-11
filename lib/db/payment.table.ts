import { sqliteTable, integer, real, text, int } from 'drizzle-orm/sqlite-core'

export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  debtId: integer('debt_id').notNull(),
  transactionId: integer('transaction_id'),
  amount: real('amount').notNull(),
  method: text('method').default('manual'), // e.g., 'mpesa', 'bank', 'cash', 'manual'
  note: text('note'),
  createdAt: int().default(Math.floor(Date.now() / 1000)),
  updatedAt: int().default(Math.floor(Date.now() / 1000)),
})
