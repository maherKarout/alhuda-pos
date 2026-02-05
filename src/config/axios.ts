import axios, { AxiosError } from 'axios'
import i18next from 'i18next'

export const authAxiosElectron = axios.create()
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
authAxiosElectron.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    console.log('🚀 ~ file: index.ts:12 ~ error:', error)
    ///catch all errors from here
    // Log error in red color with main emoji to indicate this is from Electron request
    console.log('\x1b[31m%s\x1b[0m', '🛑 [ELECTRON REQUEST ERROR]', error)

    return Promise.reject(error)
  }
)

//add your headers here
authAxiosElectron.interceptors.request.use((config: any) => {
  // const store = localStorageService.getStore()
  // config.headers['Authorization'] = `Bearer ${store?.token ?? ''} `
  config.headers['Accept-language'] = `${i18next.language}`
  config.headers['ngrok-skip-browser-warning'] = `true`
  return config
})
