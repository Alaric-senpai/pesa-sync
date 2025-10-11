// Example usage of the database in your components

import { db, schema } from '@/lib/db';

// Example: Get all users
export const getAllUsers = async () => {
  const database = db();
  return await database.select().from(schema.usersTable);
};

// Example: Create a new user
export const createUser = async (userData: {
  username: string;
  name: string;
  age: number;
  email: string;
  phone: string;
}) => {
  const database = db();
  return await database.insert(schema.usersTable).values(userData);
};

// Example: Get all accounts
export const getAllAccounts = async () => {
  const database = db();
  return await database.select().from(schema.accounts);
};

// Example: Create a new transaction
export const createTransaction = async (transactionData: {
  type: string;
  amount: number;
  description?: string;
  account_id: number;
  contact_id?: number;
}) => {
  const database = db();
  const amount = Number(transactionData.amount)
  if (!isFinite(amount)) throw new Error('Invalid transaction amount')
  // ensure keys match schema naming
  const data = {
    type: transactionData.type,
    amount,
    description: transactionData.description || null,
    messageKey: null,
    accountId: transactionData.account_id,
    contactId: transactionData.contact_id || null,
    createdAt: Math.floor(Date.now() / 1000),
    updatedAt: Math.floor(Date.now() / 1000),
  }
  return await database.insert(schema.transactions).values(data)
};


// Account crered function