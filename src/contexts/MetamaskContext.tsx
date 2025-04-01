import { createContext, useState, ReactNode } from "react";

// Define the shape of the context
interface MetamaskContextType {
  metamaskAccountAddress: string;
  setMetamaskAccountAddress: (newValue: string) => void;
}

// Default values for the context
const defaultValue: MetamaskContextType = {
  metamaskAccountAddress: '',
  setMetamaskAccountAddress: () => { },
};

export const MetamaskContext = createContext<MetamaskContextType>(defaultValue);

interface MetamaskContextProviderProps {
  children: ReactNode;
}

export const MetamaskContextProvider = ({ children }: MetamaskContextProviderProps) => {
  const [metamaskAccountAddress, setMetamaskAccountAddress] = useState<string>('');

  return (
    <MetamaskContext.Provider
      value={{
        metamaskAccountAddress,
        setMetamaskAccountAddress,
      }}
    >
      {children}
    </MetamaskContext.Provider>
  );
};