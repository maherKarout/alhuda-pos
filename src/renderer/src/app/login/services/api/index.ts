import { api } from 'src/redux-config/store'
import { endPoints } from 'src/shared/end-points'

const authService = api.injectEndpoints({
  endpoints: (build) => {
    return {
      login: build.mutation<any, { username: string; password: string }>({
        query: (body) => ({
          data: body,
          url: endPoints.loginEndPoint().pathname,
          method: 'POST'
        })
      })
    }
  }
})

export const { useLoginMutation } = authService
