import { api } from '@renderer/redux-config/store'
import { endPoints } from '@renderer/shared/end-points'

type TResponseHandOverData = {
  syp: number
  usd: number
  senderCasher: string
}

const sharedApi = api
  .enhanceEndpoints({
    addTagTypes: ['HandOver']
  })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getHandOverData: query<TResponseHandOverData, void>({
        providesTags: ['HandOver'],
        query: (props) => ({
          url: endPoints.getHandOverDataEndPoint().pathname
        })
      }),
      sendConfirmHandOver: mutation<TResponseHandOverData, { isConfirmedHandOver: boolean }>({
        query: (body) => ({
          url: endPoints.sendConfirmHandOverEndPoint().pathname,
          method: 'POST',
          data: body
        })
      })
    })
  })

export const { useGetHandOverDataQuery, useSendConfirmHandOverMutation } = sharedApi
