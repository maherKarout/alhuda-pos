import { createSlice } from '@reduxjs/toolkit'
import { privilegeKeys } from 'src/shared/privileges'
import { AccountRole } from '@renderer/consts'
import { clearSelectedBranch } from '@renderer/helpers/get-set-branch-data'

type propsType = {
  token?: string
  account?: {
    fullName?: string
    _id: string
    username: string
    email: string
    phoneNumber: string
    password: string
    isActive: boolean
    accountRole: AccountRole
    operator: {
      _id: string
      firstName: string
      lastName: string
      image?: string
    }
    pos: {
      location: string
      createdAt: string
      updatedAt: string
      posAdmin: string
      id: string
    }
    box?: {
      syp: number
      usd: number
    }
    changePassword: boolean
    type: string
    privileges: privilegeKeys[]
  }
}
const initialState: propsType = {
  token: '',
  account: undefined
}

const authSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    resetAuthData: (state) => {
      state.token = undefined
      state.account = undefined
    },
    logout: (state) => {
      state.token = 'invalid'
    },
    setLoginData: (state, action) => {
      state.token = action.payload.accessToken
      state.account = action.payload.account
    },
    // setCasherBox: (state, action) => {
    //   state.account!.box = action.payload
    // }
    setCasherBox: (state, action) => {
      // 1. Destructure with a default value for typeUpdate
      // If the payload is just the box {syp, usd}, values will be the payload
      // If the payload is the new object, we extract specifically.

      const payload = action.payload

      // Check if it's the NEW format or the OLD format
      const isNewFormat = payload && 'typeUpdate' in payload

      const typeUpdate = isNewFormat ? payload.typeUpdate : 'just-update'
      const newValues = isNewFormat ? payload.values : payload

      if (!state.account) return

      // 2. Logic execution
      if (typeUpdate === 'update-with-calc' && state.account.box) {
        state.account.box = {
          syp: state.account.box.syp + newValues.syp,
          usd: state.account.box.usd + newValues.usd
        }
      } else {
        // This covers "just-update" AND your old code
        // where you just passed {syp, usd}
        if (Object.keys(newValues).length) state.account.box = newValues
      }
    }
  }
})

export const { resetAuthData, setLoginData, logout, setCasherBox } = authSlice.actions
export default authSlice.reducer
