import { getSelectedBranch } from '@renderer/helpers/get-set-branch-data'
import axios, { AxiosError } from 'axios'
import i18next from 'i18next'
import { showErrorToasts } from 'src/components/toasts'
import { store } from 'src/redux-config/store'

import { setIsServerOnline } from '@renderer/redux-config/global-config-slice'

export function isConnectionError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false

  // No response means no internet or server unreachable
  return !error.response
}

export const authAxios = axios.create()
type errorResponse = {
  error: {
    code: number | string
    message: [
      {
        message: string
        path: string
      }
    ]
  }
}
authAxios.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (isConnectionError(error)) {
      store.dispatch(setIsServerOnline(false))
      return error
    } else {
      store.dispatch(setIsServerOnline(true))
    }
    ///catch all errors from here
    if (error?.response) showErrorToasts((error.response?.data as errorResponse).error?.code)
    // else showErrorToasts('network error')

    return error
  }
)

//add your headers here
authAxios.interceptors.request.use((config: any) => {
  config.headers['Authorization'] = `Bearer ${store.getState().auth.token} `
  config.headers['Accept-language'] = `${i18next.language}`
  config.headers['ngrok-skip-browser-warning'] = `true`
  // config.headers['pos'] = `3B3C5936-48CA-4B27-B03D-5AF614E48FAB` //TODO: change this to the pos id
  config.headers['pos'] = getSelectedBranch() //TODO: change this to the pos id
  return config
})
