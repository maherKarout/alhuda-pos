import { createContext, useContext, useState } from 'react'

export interface Casher {
  username: string
  name: string
}

export interface CasherLoginState {
  selectedCasher: Casher | null
  pinCode: string
  isAuthenticating: boolean
  selectedUser: string | null
}

export interface CasherLoginContextType extends CasherLoginState {
  setSelectedCasher: (casher: Casher | null) => void
  setPinCode: (pin: string) => void
  addPinDigit: (digit: string) => void
  removePinDigit: () => void
  clearPinCode: () => void
  setIsAuthenticating: (loading: boolean) => void
  setError: (error: string | null) => void
  handleLogin: () => void
}

const initialState: CasherLoginState = {
  selectedCasher: null,
  pinCode: '',
  isAuthenticating: false,
  selectedUser: null
}

export const CasherLoginContext = createContext<CasherLoginContextType | undefined>(undefined)

export const useCasherLogin = () => {
  const context = useContext(CasherLoginContext)
  if (!context) {
    throw new Error('useCasherLogin must be used within a CasherLoginProvider')
  }
  return context
}
