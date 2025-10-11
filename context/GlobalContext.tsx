// @ts-nocheck

import React, { createContext, useEffect, useState } from 'react'
import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'
import AsyncStorage from '@react-native-async-storage/async-storage'

type User = {
  id: number
  username: string
  name: string
  age: number
  email: string
  phone: string
  createdAt?: number | null
  updatedAt?: number | null
}

type Account = {
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

type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>

type UserContextType = {
  currentUser: User | null
  defaultAccount: Account | null
  isLoggedIn: boolean
  isLoading: boolean
  refreshAccount:()=>Promise<void>
  createAccount: (userData: CreateUserData) => Promise<{ success: boolean; user?: User; error?: string }>
  login: (username: string) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => Promise<void>
  deleteAccount: (userId: number) => Promise<{ success: boolean; error?: string }>
  updateAccount: (userId: number, userData: Partial<CreateUserData>) => Promise<{ success: boolean; user?: User; error?: string }>
}

const UserContext = createContext<UserContextType | null>(null)

export default function GlobalContext({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [account, setAccount] = useState<Account | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // For now, we'll just set loading to false after component mounts
  // In the future, you can add AsyncStorage or other persistence here
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      try {
        const raw = await AsyncStorage.getItem('currentUser')
        if (raw) {
          const parsed: User = JSON.parse(raw)
          setCurrentUser(parsed)

          // Ensure the user has at least one default account
          try {
            const database = db()
            const accountsForUser = await database
              .select()
              .from(schema.accounts)
              .where(eq(schema.accounts.userId, parsed.id))

            if (!accountsForUser || accountsForUser.length === 0) {
              await createDefaultAccountForUser(parsed.id)
            } else {
              // set the first account as the active account
              setAccount(accountsForUser[0])
            }
          } catch (e) {
            console.warn('Failed to verify default account for restored user:', e)
          }
        }
      } catch (e) {
        console.warn('Failed to restore user from storage:', e)
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [])

  const createDefaultAccountForUser = async (userId: number) => {
    try {
      const database = db()
      // Create default accounts for the new user
      const defaultAccounts = [
        {
          name: 'General',
          type: 'mobile',
          currency: 'KES',
          userId,
          debtAmount: 0,
          incomeAmount: 0,
          DebtedAmount: 0,
        },
      ]

      // Avoid spreading `account` state (it may be null/undefined) — insert explicit objects instead
      const accountsToInsert = defaultAccounts.map(a => ({
        ...a,
        createdAt: Math.floor(Date.now() / 1000),
        updatedAt: Math.floor(Date.now() / 1000),
      }))

      const inserted = await database.insert(schema.accounts).values(accountsToInsert).returning()
      // if multiple were inserted, pick the first as the active account
      if (inserted && inserted.length > 0) setAccount(inserted[0])
      console.log('✅ Default accounts created for user:', userId)
    } catch (error) {
      console.error('Failed to create default accounts:', error)
    }
  }

  const RefreshAccount =async()=>{
    try {
      if(!currentUser) return
      const database = db()
      const accountsForUser = await database
        .select()
        .from(schema.accounts)
        .where(eq(schema.accounts.userId, currentUser.id))

      if (accountsForUser && accountsForUser.length > 0) {
        setAccount(accountsForUser[0])
      } else {
        setAccount(null)
      }
    } catch (e) {
      console.warn('Failed to refresh account:', e)
    }
  }

  const createAccount = async (userData: CreateUserData): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const database = db()
      
      // Check if username already exists
      const existingUser = await database
        .select()
        .from(schema.usersTable)
        .where(eq(schema.usersTable.username, userData.username))
        .limit(1)

      if (existingUser.length > 0) {
        return { success: false, error: 'Username already exists' }
      }

      // Check if email already exists
      const existingEmail = await database
        .select()
        .from(schema.usersTable)
        .where(eq(schema.usersTable.email, userData.email))
        .limit(1)

      if (existingEmail.length > 0) {
        return { success: false, error: 'Email already exists' }
      }

      // Check if phone already exists
      const existingPhone = await database
        .select()
        .from(schema.usersTable)
        .where(eq(schema.usersTable.phone, userData.phone))
        .limit(1)

      if (existingPhone.length > 0) {
        return { success: false, error: 'Phone number already exists' }
      }

      // Create new user
      const [newUser] = await database
        .insert(schema.usersTable)
        .values({
          ...userData,
          createdAt: Math.floor(Date.now() / 1000),
          updatedAt: Math.floor(Date.now() / 1000),
        })
        .returning()

      setCurrentUser(newUser)
      // Persist user to AsyncStorage so session can be restored on app restart
      try {
        await AsyncStorage.setItem('currentUser', JSON.stringify(newUser))
      } catch (e) {
        console.warn('Failed to persist user to storage:', e)
      }
      await createDefaultAccountForUser(newUser.id)

      console.log('✅ User created successfully:', newUser)

      return { success: true, user: newUser }
    } catch (error) {
      console.error('Failed to create account:', error)
      return { success: false, error: 'Failed to create account' }
    }
  }

  const login = async (username: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const database = db()
      
      const [user] = await database
        .select()
        .from(schema.usersTable)
        .where(eq(schema.usersTable.username, username))
        .limit(1)

      if (!user) {
        return { success: false, error: 'User not found' }
      }

      // Set current user in state
      setCurrentUser(user)

      // Persist user to AsyncStorage
      try {
        await AsyncStorage.setItem('currentUser', JSON.stringify(user))
      } catch (e) {
        console.warn('Failed to persist user to storage:', e)
      }

      // Ensure the user has a default account immediately after login
      try {
        const database2 = db()
        const accountsForUser = await database2
          .select()
          .from(schema.accounts)
          .where(eq(schema.accounts.userId, user.id))

        if (!accountsForUser || accountsForUser.length === 0) {
          await createDefaultAccountForUser(user.id)
        } else {
          setAccount(accountsForUser[0])
        }
      } catch (e) {
        console.warn('Failed to ensure default account on login:', e)
      }

      console.log('✅ User logged in successfully:', user)
      return { success: true, user }
    } catch (error) {
      console.error('Failed to login:', error)
      return { success: false, error: 'Login failed' }
    }
  }

  const logout = async (): Promise<void> => {
    setCurrentUser(null)
    console.log('✅ User logged out successfully')
    try {
      await AsyncStorage.removeItem('currentUser')
    } catch (e) {
      console.warn('Failed to remove user from storage:', e)
    }
  }

  const deleteAccount = async (userId: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const database = db()
      
      await database
        .delete(schema.usersTable)
        .where(eq(schema.usersTable.id, userId))

      if (currentUser?.id === userId) {
        await logout()
      }

      console.log('✅ Account deleted successfully')
      return { success: true }
    } catch (error) {
      console.error('Failed to delete account:', error)
      return { success: false, error: 'Failed to delete account' }
    }
  }

  const updateAccount = async (userId: number, userData: Partial<CreateUserData>): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const database = db()
      
      const [updatedUser] = await database
        .update(schema.usersTable)
        .set({
          ...userData,
          updatedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(schema.usersTable.id, userId))
        .returning()

      if (currentUser?.id === userId) {
        setCurrentUser(updatedUser)
      }

      console.log('✅ Account updated successfully:', updatedUser)
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Failed to update account:', error)
      return { success: false, error: 'Failed to update account' }
    }
  }

  const contextValue: UserContextType = {
    currentUser,
    defaultAccount: account,
    refreshAccount: RefreshAccount,
    isLoggedIn: !!currentUser,
    isLoading,
    createAccount,
    login,
    logout,
    deleteAccount,
    updateAccount,
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

export const useGlobalContext = () => {
  const ctx = React.useContext(UserContext)
  if (!ctx) throw new Error('useGlobalContext must be used within GlobalContext')
  return ctx
}

export { UserContext }
