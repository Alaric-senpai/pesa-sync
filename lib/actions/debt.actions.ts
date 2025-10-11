// all database action related to debts

import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import evidenceActions from './evidence.actions'

/**
 * Debt actions: create, update, settle, delete and helpers.
 * These functions also create matching transactions and update the user's
 * default account balances (debtAmount, DebtedAmount, incomeAmount) accordingly.
 */

// Helper: find default (first) account for a user
const getDefaultAccountForUser = async (userId: number) => {
  const database = db()
  const accounts = await database.select().from(schema.accounts).where(eq(schema.accounts.userId, userId)).limit(1)
  return accounts && accounts.length > 0 ? accounts[0] : null
}

// Get all debts
export const getAllDebts = async () => {
  const database = db();
  return await database.select().from(schema.debts);
};

// Get debts for a specific contact
export const getDebtsForContact = async (contactId: number) => {
  const database = db();
  return await database.select().from(schema.debts).where(eq(schema.debts.contactId, contactId));
}

// Create a new debt and link it to the user's default account (by userId or explicit accountId)
export const createDebt = async (params: {
  userId: number; // owner of the account where the amounts will be updated
  accountId?: number;
  contactId: number;
  amount: number;
  direction: 'owed_to_me' | 'i_owe';
  reason?: string;
  dueDate?: number; // timestamp
}) => {
  const database = db();

  // Resolve account
  let accountId = params.accountId
  if (!accountId) {
    const defaultAccount = await getDefaultAccountForUser(params.userId)
    if (!defaultAccount) throw new Error('No default account for user')
    accountId = defaultAccount.id
  }

  // Insert debt
  const [debt] = await database.insert(schema.debts).values({
    contactId: params.contactId,
    amount: params.amount,
    direction: params.direction,
    reason: params.reason,
    dueDate: params.dueDate,
    createdAt: Math.floor(Date.now() / 1000),
    updatedAt: Math.floor(Date.now() / 1000),
  }).returning()

  // Create matching transaction and update account balances
  // For debts:
  // - direction 'owed_to_me' => contact owes the user => increase DebtedAmount (amount lent out)
  // - direction 'i_owe' => user owes contact => increase debtAmount
  if (debt) {
    // Create transaction record: 'lend' when owed_to_me, 'borrow' when i_owe
    const txType = params.direction === 'owed_to_me' ? 'lend' : 'borrow'
    const txnAmount = Number(params.amount)
    if (!isFinite(txnAmount)) throw new Error('Invalid debt amount')
    await database.insert(schema.transactions).values({
      type: txType,
      amount: txnAmount,
      description: params.reason || null,
      messageKey: null,
      accountId,
      contactId: params.contactId,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    })

    // Drizzle update with arithmetic requires reading current value and writing a computed value
    const [acct] = await database.select().from(schema.accounts).where(eq(schema.accounts.id, accountId)).limit(1)
    if (acct) {
      const newVals: any = { updatedAt: Math.floor(Date.now() / 1000) }
      if (params.direction === 'owed_to_me') {
        newVals.DebtedAmount = (acct.DebtedAmount || 0) + params.amount
      } else {
        newVals.debtAmount = (acct.debtAmount || 0) + params.amount
      }
      await database.update(schema.accounts).set(newVals).where(eq(schema.accounts.id, accountId))
    }
  }

  return debt
}

// Settle a debt: mark settled, create repayment transaction, and adjust account balances
export const settleDebt = async (debtId: number, userId: number, accountId?: number) => {
  const database = db();
  const [debt] = await database
    .select()
    .from(schema.debts)
    .where(eq(schema.debts.id, debtId))
    .limit(1);

  if (!debt) throw new Error('Debt not found');

  // Calculate remaining unpaid amount
  const total = Number(debt.amount || 0);
  const paid = Number(debt.paid || 0);
  const remaining = Math.max(0, total - paid);

  // If already settled, prevent double settlement
  if (debt.settled) throw new Error('Debt already settled');

  // Create a descriptive evidence message
  const evidenceMessage = `Full settlement for debt #${debtId} — total ${total}, paid ${paid}, remaining ${remaining}`;

  // Reuse payDebt with remaining balance (could be 0 for traceability)
  return await payDebt({
    debtId,
    userId,
    accountId,
    amount: remaining,
    evidenceMessage,
    evidenceType: 'settlement',
  });
};

// Pay a partial amount towards a debt. Records a repayment transaction, updates paid amount, and records evidence optionally.
export const payDebt = async (params: { debtId: number; userId: number; accountId?: number; amount: number; evidenceMessage?: string; evidenceType?: string }) => {
  const database = db()
  const { debtId, userId, accountId, amount, evidenceMessage, evidenceType } = params

  // Allow zero-amount payments for settlement fingerprints (settleDebt may call with remaining === 0)
  if (amount < 0) throw new Error('Payment amount must be non-negative')

  // Wrap the sequence in a transaction for atomicity
  return await database.transaction(async (tx) => {
    // Read debt inside transaction
    const [debt] = await tx.select().from(schema.debts).where(eq(schema.debts.id, debtId)).limit(1)
    if (!debt) throw new Error('Debt not found')

    // Resolve account
    let acctId = accountId
    if (!acctId) {
      const defaultAccount = await getDefaultAccountForUser(userId)
      if (!defaultAccount) throw new Error('No default account for user')
      acctId = defaultAccount.id
    }

    // Validate amount is a finite number
  const paymentAmount = Number(amount)
  if (!isFinite(paymentAmount) || paymentAmount < 0) throw new Error('Invalid payment amount')

    // Create repayment transaction record within tx
    const [txRow] = await tx.insert(schema.transactions).values({
      type: 'repayment',
      amount: paymentAmount,
      description: `Partial payment for debt ${debtId}`,
      messageKey: null,
      accountId: acctId,
      contactId: debt.contactId,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    }).returning()

    // Update account balances within tx
    const [acct] = await tx.select().from(schema.accounts).where(eq(schema.accounts.id, acctId)).limit(1)
    if (acct) {
      const newVals: any = { updatedAt: Math.floor(Date.now() / 1000) }
      if (debt.direction === 'owed_to_me') {
        newVals.DebtedAmount = Math.max(0, (acct.DebtedAmount || 0) - paymentAmount)
      } else {
        newVals.debtAmount = Math.max(0, (acct.debtAmount || 0) - paymentAmount)
      }
      await tx.update(schema.accounts).set(newVals).where(eq(schema.accounts.id, acctId))
    }

    // Update debt.paid and possibly mark settled (coerce to numbers to avoid string concatenation)
    const existingPaid = Number(debt.paid || 0)
    const debtTotal = Number(debt.amount || 0)
    const newPaid = existingPaid + paymentAmount
    const isSettled = newPaid >= debtTotal
    await tx.update(schema.debts).set({ paid: newPaid, settled: isSettled ? 1 : 0, updatedAt: Math.floor(Date.now() / 1000) }).where(eq(schema.debts.id, debtId))

    // Insert into payments table for record keeping
    const [paymentRow] = await tx.insert(schema.payments).values({
      debtId,
      transactionId: txRow?.id || null,
      amount: paymentAmount,
      method: 'manual',
      note: evidenceMessage || null,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    }).returning()

    // Attach evidence if provided — use tx to keep it in the same transaction
    if (evidenceMessage && txRow) {
      try {
        await tx.insert(schema.evidence).values({
          transactionId: txRow.id,
          debtId,
          message: evidenceMessage,
          type: evidenceType || 'message',
          createdAt: Math.floor(Date.now() / 1000),
          updatedAt: Math.floor(Date.now() / 1000),
        })
      } catch (e) {
        console.warn('Failed to save evidence in tx', e)
      }
    }

    return { tx: txRow, payment: paymentRow, newPaid, settled: isSettled }
  })
}

// Update debt details (amount/direction) and adjust account balances by the delta
export const updateDebt = async (debtId: number, updates: Partial<{
  amount: number;
  direction: 'owed_to_me' | 'i_owe';
  reason: string;
  dueDate: number; // timestamp
}>, userId: number, accountId?: number) => {
  const database = db()

  const [existing] = await database.select().from(schema.debts).where(eq(schema.debts.id, debtId)).limit(1)
  if (!existing) throw new Error('Debt not found')

  // Resolve account
  let acctId = accountId
  if (!acctId) {
    const defaultAccount = await getDefaultAccountForUser(userId)
    if (!defaultAccount) throw new Error('No default account for user')
    acctId = defaultAccount.id
  }

  // Calculate delta in amounts depending on direction change
  const oldAmount = existing.amount || 0
  const newAmount = typeof updates.amount === 'number' ? updates.amount : oldAmount
  const oldDir = existing.direction
  const newDir = updates.direction || oldDir

  // Update the debt row
  await database.update(schema.debts).set({ ...updates, updatedAt: Math.floor(Date.now() / 1000) }).where(eq(schema.debts.id, debtId))

  // Adjust account balances
  const [acct] = await database.select().from(schema.accounts).where(eq(schema.accounts.id, acctId)).limit(1)
  if (acct) {
    const newVals: any = { updatedAt: Math.floor(Date.now() / 1000) }

    // Remove old amount from old direction
    if (oldDir === 'owed_to_me') {
      newVals.DebtedAmount = Math.max(0, (acct.DebtedAmount || 0) - oldAmount)
    } else {
      newVals.debtAmount = Math.max(0, (acct.debtAmount || 0) - oldAmount)
    }

    // Add new amount to new direction
    if (newDir === 'owed_to_me') {
      newVals.DebtedAmount = (newVals.DebtedAmount || acct.DebtedAmount || 0) + newAmount
    } else {
      newVals.debtAmount = (newVals.debtAmount || acct.debtAmount || 0) + newAmount
    }

    await database.update(schema.accounts).set(newVals).where(eq(schema.accounts.id, acctId))
  }

  return true
}

// Delete debt and reverse its effect on account balances
export const deleteDebt = async (debtId: number, userId: number, accountId?: number) => {
  const database = db();

  return await database.transaction(async (tx) => {
    // 1. Fetch the debt
    const [debt] = await tx.select().from(schema.debts).where(eq(schema.debts.id, debtId)).limit(1);
    if (!debt) throw new Error('Debt not found');

    if(debt.settled === 1) throw new Error('Cannot delete a settled debt');

    // 2. Resolve the account
    let acctId = accountId;
    if (!acctId) {
      const defaultAccount = await getDefaultAccountForUser(userId);
      if (!defaultAccount) throw new Error('No default account for user');
      acctId = defaultAccount.id;
    }

    // 3. Fetch the account
    const [acct] = await tx.select().from(schema.accounts).where(eq(schema.accounts.id, acctId)).limit(1);
    if (!acct) throw new Error('Account not found');

    // 4. Calculate how much of the debt still affects the balance
    const total = Number(debt.amount || 0);
    const paid = Number(debt.paid || 0);
    const remaining = Math.max(0, total - paid);

    // 5. Adjust balances to remove this debt’s remaining impact
    const newVals: any = { updatedAt: Math.floor(Date.now() / 1000) };

    if (debt.direction === 'owed_to_me') {
      newVals.DebtedAmount = Math.max(0, (acct.DebtedAmount || 0) - remaining);
    } else {
      newVals.debtAmount = Math.max(0, (acct.debtAmount || 0) - remaining);
    }

    await tx.update(schema.accounts).set(newVals).where(eq(schema.accounts.id, acctId));

    // 6. Delete related payments and evidence first
    await tx.delete(schema.evidence).where(eq(schema.evidence.debtId, debtId));
    await tx.delete(schema.payments).where(eq(schema.payments.debtId, debtId));

    // 7. Delete related transactions (repayments, lend/borrow, etc.)
    await tx.delete(schema.transactions).where(eq(schema.transactions.contactId, debt.contactId));

    // 8. Finally delete the debt itself
    await tx.delete(schema.debts).where(eq(schema.debts.id, debtId));

    return true;
  });
};

