// GlobalContext.tsx
import React, { createContext, useEffect, useState } from 'react'

type AccountData = {
  username: string
  phoneNumber: string
}

type AccountContextType = AccountData & {
  setAccount: (account: AccountData) => void
}

const AccountContext = createContext<AccountContextType | null>(null)

export default function GlobalContext({ children }: { children: React.ReactNode }) {
  const [activeAccount, setActiveAccount] = useState<AccountData | null>({
    username: 'Alaric',
    phoneNumber: '1234567890',
  })


//   dummy testing account info set using useEffect
//   useEffect(() => {
//     setActiveAccount({ username: 'testuser', phoneNumber: '1234567890' })
//   }, [])

  const updateAccount = (account: AccountData) => {
    setActiveAccount(account)
  }

  return (
    <AccountContext.Provider
      value={
        activeAccount
          ? { ...activeAccount, setAccount: updateAccount }
          : { username: '', phoneNumber: '', setAccount: updateAccount }
      }
    >
      {children}
    </AccountContext.Provider>
  )
}

export const useGlobalContext = () => {
  const ctx = React.useContext(AccountContext)
  if (!ctx) throw new Error('useGlobalContext must be used within GlobalContext')
  return ctx
}

export { AccountContext }
