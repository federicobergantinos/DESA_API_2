import React, { createContext, useState } from 'react'

const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
  const [transaction, setTransaction] = useState(null)
  const [user, setUser] = useState(null)

  return (
    <WalletContext.Provider
      value={{ transaction, setTransaction, user, setUser }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export default WalletContext
