import React, { createContext, useState, useContext } from 'react'

const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
  const [transaction, setTransaction] = useState(null)
  const [user, setUser] = useState(null)
  const [selectedAccount, setSelectedAccount] = useState(null)

  return (
    <WalletContext.Provider
      value={{
        transaction,
        setTransaction,
        user,
        setUser,
        selectedAccount,
        setSelectedAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)

export default WalletContext
