import React, { createContext, useState } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [value, setValue] = useState(null);
  return (
    <WalletContext.Provider value={{ value, setValue }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
