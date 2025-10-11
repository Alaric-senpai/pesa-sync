import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'

export const getPaymentsForDebt = async (debtId: number) => {
  const database = db()
  return await database.select().from(schema.payments).where(eq(schema.payments.debtId, debtId)).orderBy(schema.payments.createdAt)
}

export default {
  getPaymentsForDebt,
}
