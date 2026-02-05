import React, { ReactNode, useState } from 'react'
import {
  CasherLoginContext,
  CasherLoginState,
  CasherLoginContextType,
  Casher
} from '../hooks/use-casher-login'

const initialState: CasherLoginState = {
  selectedCasher: null,
  pinCode: '',
  isAuthenticating: false,
  selectedUser: null
}

interface CasherLoginProviderProps {
  children: ReactNode
}

export const CasherLoginProvider = ({ children }: CasherLoginProviderProps) => {
  const [state, setState] = useState<CasherLoginState>(initialState)

  const setSelectedCasher = (casher: Casher | null) => {
    setState((prev) => ({
      ...prev,
      selectedCasher: casher,
      selectedUser: casher?.username ?? null
    }))
  }

  const setPinCode = (pin: string) => {
    setState((prev) => ({ ...prev, pinCode: pin, error: null }))
  }

  const addPinDigit = (digit: string) => {
    setState((prev) => {
      if (prev.pinCode.length < 4) {
        return { ...prev, pinCode: prev.pinCode + digit, error: null }
      }
      return prev
    })
  }

  const removePinDigit = () => {
    setState((prev) => ({
      ...prev,
      pinCode: prev.pinCode.slice(0, -1),
      error: null
    }))
  }

  const clearPinCode = () => {
    setState((prev) => ({ ...prev, pinCode: '', error: null }))
  }

  const setIsAuthenticating = (loading: boolean) => {
    setState((prev) => ({ ...prev, isAuthenticating: loading }))
  }

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }))
  }

  const handleLogin = async () => {
    if (!state.selectedCasher || state.pinCode.length !== 4) {
      setError('Please select a casher and enter a 4-digit PIN')
      return
    }

    setIsAuthenticating(true)
    setError(null)

    try {
      // TODO: Implement actual authentication logic
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // TODO: Handle successful login
    } catch (error) {
      setError('Invalid PIN. Please try again.')
    } finally {
      setIsAuthenticating(false)
    }
  }

  const contextValue: CasherLoginContextType = {
    ...state,
    setSelectedCasher,
    setPinCode,
    addPinDigit,
    removePinDigit,
    clearPinCode,
    setIsAuthenticating,
    setError,
    handleLogin
  }

  return <CasherLoginContext.Provider value={contextValue}>{children}</CasherLoginContext.Provider>
}
