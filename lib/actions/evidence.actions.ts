import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'

export const createEvidence = async (payload: { transactionId?: number; debtId?: number; message: string; type?: string }) => {
  const database = db()
  const [e] = await database.insert(schema.evidence).values({
    transactionId: payload.transactionId || null,
    debtId: payload.debtId || null,
    message: payload.message,
    type: payload.type || 'message',
    createdAt: Math.floor(Date.now() / 1000),
    updatedAt: Math.floor(Date.now() / 1000),
  }).returning()
  return e
}

export const getEvidenceForDebt = async (debtId: number) => {
  const database = db()
  return await database.select().from(schema.evidence).where(eq(schema.evidence.debtId, debtId)).orderBy(schema.evidence.createdAt)
}

export default {
  createEvidence,
  getEvidenceForDebt,
}
