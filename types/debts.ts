export type ID = number
export type Timestamp = number // UNIX epoch seconds
export type CurrencyAmount = number // use Number(...) to coerce


export type User = {
  id: number
  username: string
  name: string
  age: number
  email: string
  phone: string
  createdAt?: number | null
  updatedAt?: number | null
}

export type Account = {
  id: number
  name: string
  type: string
  currency: string
  userId: number
  debtAmount: number
  incomeAmount: number
  DebtedAmount: number
  createdAt?: number | null
  updatedAt?: number | null
}


export interface Contact {
  id: ID
  userId?: ID
  name?: string
  phone?: string
  email?: string
  avatarUrl?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export type DebtDirection = 'owed_to_me' | 'i_owe'

export interface Debt {
  id: ID
  accountId?: ID
  contactId: ID
  userId?: ID
  direction: DebtDirection
  amount: CurrencyAmount
  paid?: CurrencyAmount
  reason?: string
  settled?: 0 | 1 | boolean
  dueDate?: Timestamp
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export type TransactionType = 'debt_create' | 'repayment' | 'expense' | 'income' | 'transfer' | 'adjustment'

export interface Transaction {
  id: ID
  accountId?: ID
  contactId?: ID
  type: TransactionType
  amount: CurrencyAmount
  description?: string
  messageKey?: string
  createdAt?: Timestamp
}

export interface Payment {
  id: ID
  debtId: ID
  transactionId?: ID
  amount: CurrencyAmount
  method?: string
  note?: string
  createdAt?: Timestamp
}

export type EvidenceType = 'message' | 'image' | 'file' | 'note'

export interface Evidence {
  id: ID
  debtId?: ID
  transactionId?: ID
  paymentId?: ID
  type: EvidenceType
  message?: string
  uri?: string
  mimeType?: string
  createdAt?: Timestamp
}

export interface DebtDetail {
  debt: Debt
  contact?: Contact
  account?: Account
  transactions?: Transaction[]
  payments?: Payment[]
  evidence?: Evidence[]
}

export function normalizeDebtRow(row: any): Debt {
  return {
    ...row,
    amount: Number(row.amount || 0),
    paid: Number(row.paid || 0),
    createdAt: row.createdAt ? Number(row.createdAt) : undefined,
    updatedAt: row.updatedAt ? Number(row.updatedAt) : undefined,
    settled: row.settled === 1 || row.settled === true ? true : false,
  }
}
