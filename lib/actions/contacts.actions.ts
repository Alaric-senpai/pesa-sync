// handling all contact related actions
import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'

type ContactCreate = {
	name: string
	phone: string
}

/**
 * Return all contacts
 */
export const getAllContacts = async () => {
	const database = db()
	return await database.select().from(schema.contacts).orderBy(schema.contacts.name)
}

/**
 * Get a single contact by id
 */
export const getContactById = async (id: number) => {
	const database = db()
	const [contact] = await database.select().from(schema.contacts).where(eq(schema.contacts.id, id)).limit(1)
	return contact || null
}

/**
 * Create a contact. If phone already exists, returns the existing contact.
 */
export const createContact = async (payload: ContactCreate) => {
	const database = db()
	// check existing by phone
	const existing = await database.select().from(schema.contacts).where(eq(schema.contacts.phone, payload.phone)).limit(1)
	if (existing && existing.length > 0) return existing[0]

	const [contact] = await database.insert(schema.contacts).values({
		name: payload.name,
		phone: payload.phone,
		createdAt: Math.floor(Date.now() / 1000),
		updatedAt: Math.floor(Date.now() / 1000),
	}).returning()

	return contact
}

/**
 * Find a contact by phone, or create it if missing. Returns the contact.
 */
export const findOrCreateContactByPhone = async (phone: string, name?: string) => {
	const database = db()
	const existing = await database.select().from(schema.contacts).where(eq(schema.contacts.phone, phone)).limit(1)
	if (existing && existing.length > 0) return existing[0]
	return await createContact({ name: name || phone, phone })
}

/**
 * Update contact
 */
export const updateContact = async (id: number, updates: Partial<ContactCreate>) => {
	const database = db()
	const [updated] = await database.update(schema.contacts).set({ ...updates, updatedAt: Math.floor(Date.now() / 1000) }).where(eq(schema.contacts.id, id)).returning()
	return updated || null
}

/**
 * Delete contact. If cascade=true will also delete debts and transactions associated with this contact.
 */
export const deleteContact = async (id: number, cascade: boolean = false) => {
	const database = db()

	if (cascade) {
		// delete debts for contact
		await database.delete(schema.debts).where(eq(schema.debts.contactId, id))
		// delete transactions for contact
		await database.delete(schema.transactions).where(eq(schema.transactions.contactId, id))
	}

	await database.delete(schema.contacts).where(eq(schema.contacts.id, id))
	return true
}

/**
 * Returns contacts along with a debt summary object: { totalOwedToUser, totalUserOwes, outstandingCount }
 * This aggregates across the debts table for each contact.
 */
export const getContactsWithDebtSummary = async () => {
	const database = db()
	const contacts = await database.select().from(schema.contacts).orderBy(schema.contacts.name)

	// fetch all debts grouped by contact in a single query (fetch all debts then aggregate in JS)
	const debts = await database.select().from(schema.debts)

	const map = new Map<number, { totalOwedToUser: number; totalUserOwes: number; outstandingCount: number }>()

	for (const d of debts) {
		const cId = d.contactId
		if (!map.has(cId)) map.set(cId, { totalOwedToUser: 0, totalUserOwes: 0, outstandingCount: 0 })
		const entry = map.get(cId)!
		if (d.settled === 0) entry.outstandingCount += 1
		if (d.direction === 'owed_to_me') entry.totalOwedToUser += (d.amount || 0)
		else entry.totalUserOwes += (d.amount || 0)
	}

	return contacts.map(c => ({
		...c,
		debtSummary: map.get(c.id) || { totalOwedToUser: 0, totalUserOwes: 0, outstandingCount: 0 }
	}))
}

export default {
	getAllContacts,
	getContactById,
	createContact,
	findOrCreateContactByPhone,
	updateContact,
	deleteContact,
	getContactsWithDebtSummary,
}