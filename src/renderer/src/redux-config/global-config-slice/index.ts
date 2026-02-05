import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ExchangeRate {
  code: string
  price: number
}

export interface GlobalConfigState {
  exchangeRates: ExchangeRate[]
  showPopConfirmHandover: null | boolean
  waitConfirmHandOver: boolean | string
  isServerOnline: boolean
  lastSyncedDate: Date | null
}

const initialState: GlobalConfigState = {
  exchangeRates: [
    {
      code: 'usd',
      price: 1
    },
    {
      code: 'syp',
      price: 10000
    }
  ],
  showPopConfirmHandover: false,
  waitConfirmHandOver: false,
  isServerOnline: false,
  lastSyncedDate: null
}

const globalConfigSlice = createSlice({
  name: 'globalConfig',
  initialState,
  reducers: {
    setExchangeRates: (state, action: PayloadAction<ExchangeRate[]>) => {
      state.exchangeRates = action.payload
    },
    setShowPopConfirmHandover: (state, action: PayloadAction<boolean>) => {
      state.showPopConfirmHandover = action.payload
    },
    setWaitConfirmHandOver: (state, action: PayloadAction<boolean>) => {
      state.waitConfirmHandOver = action.payload
    },
    resetGlobalConfig: (state) => {
      state.exchangeRates = initialState.exchangeRates
      state.showPopConfirmHandover = initialState.showPopConfirmHandover
      state.waitConfirmHandOver = initialState.waitConfirmHandOver
      state.isServerOnline = initialState.isServerOnline
      state.lastSyncedDate = initialState.lastSyncedDate
    },
    setIsServerOnline: (state, action: PayloadAction<boolean>) => {
      state.isServerOnline = action.payload
    },
    setLastSyncedDate: (state, action: PayloadAction<Date | null>) => {
      state.lastSyncedDate = action.payload
    }
  }
})

export const {
  setExchangeRates,
  setShowPopConfirmHandover,
  setWaitConfirmHandOver,
  resetGlobalConfig,
  setIsServerOnline,
  setLastSyncedDate
} = globalConfigSlice.actions

export default globalConfigSlice.reducer
