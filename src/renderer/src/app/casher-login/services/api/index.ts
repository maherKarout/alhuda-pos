import { api } from 'src/redux-config/store'
import { endPoints } from 'src/shared/end-points'

export type CasherLoginType = {
  id: string
  name: string
  avatar: string
  pinCode: string
  isActive: boolean
}

type TBodyLogin = { id: string; password: string }

type TRetCashers = { data: { username: string; name: string; id: string }[] }
type TBodyCasherLogin = { username: string; password: string }

type TResponseCasherLogin = {
  success: boolean
  token?: string
  account?: { showPopConfirmHandover: boolean; waitConfirmHandOver: boolean }
}

const apiService = api
  .enhanceEndpoints({
    addTagTypes: ['Casher-login', 'Cashers']
  })
  .injectEndpoints({
    endpoints: ({ mutation, query }) => ({
      authenticateCasher: mutation<{ success: boolean; token?: string }, TBodyLogin>({
        invalidatesTags: ['Casher-login'],
        query: ({ id, password }: TBodyLogin) => ({
          url: `${endPoints.casherLoginEndPoint().pathname}`,
          method: 'POST', 
          data: { id, password }
        })
      }),
      getCashers: query<TRetCashers, void>({
        providesTags: ['Cashers'],
        query: () => ({
          url: endPoints.getCashersEndPoint().pathname,
          method: 'GET'
        })
      }),
      loginCasher: mutation<TResponseCasherLogin, TBodyCasherLogin>({
        invalidatesTags: ['Casher-login'],
        query: ({ username, password }: TBodyCasherLogin) => ({
          url: `${endPoints.casherLoginEndPoint().pathname}`,
          method: 'POST',
          data: { username, password }
        })
      })
    })
  })

export const { useAuthenticateCasherMutation, useGetCashersQuery, useLoginCasherMutation } =
  apiService
