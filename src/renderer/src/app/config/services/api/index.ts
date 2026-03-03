import { setSearchParams } from 'src/helpers/set-search-params'
import { api } from 'src/redux-config/store'
import { endPoints } from 'src/shared/end-points'
import { ArgsType } from 'src/types'

export type configType = {
  approximationRatio: number
}

const apiService = api
  .enhanceEndpoints({
    addTagTypes: ['Config']
  })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getConfig: query<configType, void>({
        providesTags: (result, error, id) => [{ type: 'Config' }],
        query: () => ({
          url: `${endPoints.configEndPointEndpoint().pathname}`
        })
      }),
      getConfigForPos: query<configType, void>({
        providesTags: (result, error, id) => [{ type: 'Config' }],
        query: () => ({
          url: `${endPoints.configEndPointForPos().pathname}`
        })
      }),

      editConfig: mutation<void, configType>({
        invalidatesTags: ['Config'],
        query: (data) => ({
          url: `${endPoints.configEndPointEndpoint().pathname}`,
          method: 'PATCH',
          data
        })
      })
    })
  })

export const { useGetConfigQuery, useEditConfigMutation, useGetConfigForPosQuery } = apiService
