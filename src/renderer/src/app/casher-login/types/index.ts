export interface Casher {
  id: string
  name: string
  avatar: string
  isSelected: boolean
}

export interface CasherLoginState {
  selectedCasher: Casher | null
  pinCode: string
  isAuthenticating: boolean
  error: string | null
}

export interface PinDigit {
  value: string
  isEntered: boolean
}
