import { setSearchParams } from 'src/helpers/set-search-params'
import { api } from 'src/redux-config/store'
import { endPoints } from 'src/shared/end-points'
import { ArgsType } from 'src/types'

export type posUsersType = {
  id: string
  fullName: string
  phoneNumber: string
  username: string
  role: string
  pos: string[]
}

export type AddPosUsersType = {
  fullName: string
  phoneNumber: string
  password: string
  username: string
  role: string
  pos: string[]
}

type ResType = {
  totalRecords?: number
  data: posUsersType[]
}

type posUsersByIdType = {
  data: {
    id: string
    username: string
    phoneNumber: string
    role: string
    fullName: string
    pos: string[]
  }
}

const apiService = api
  .enhanceEndpoints({
    addTagTypes: ['Pos-users']
  })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllPosUsers: query<ResType, ArgsType>({
        providesTags: ['Pos-users'],
        query: (props) => {
          const url = setSearchParams(endPoints.posUsersEndPoint(), props)
          return { url: url.pathname + url.search }
        }
      }),
      getPosUsersById: query<posUsersByIdType, string>({
        providesTags: (result, error, id) => [{ type: 'Pos-users', id }],
        query: (id) => ({
          url: `${endPoints.posUsersEndPoint().pathname}/${id}`
        })
      }),
      addPosUsers: mutation<void, Partial<AddPosUsersType>>({
        invalidatesTags: ['Pos-users'],
        query: (data) => ({
          url: endPoints.posUsersEndPoint().pathname,
          method: 'POST',
          data
        })
      }),
      editPosUsers: mutation<void, { id: string; data: Partial<posUsersType> }>({
        invalidatesTags: (result, error, { id }) => [{ type: 'Pos-users', id }, 'Pos-users'],
        query: ({ data, id }) => ({
          url: `${endPoints.posUsersEndPoint().pathname}/${id}`,
          method: 'PATCH',
          data
        })
      }),
      deletePosUsers: mutation<void, string>({
        invalidatesTags: ['Pos-users'],
        query: (id) => ({
          url: `${endPoints.posUsersEndPoint().pathname}/${id}`,
          method: 'DELETE'
        })
      })
    })
  })

export const {
  useAddPosUsersMutation,
  useDeletePosUsersMutation,
  useGetAllPosUsersQuery,
  useGetPosUsersByIdQuery,
  useEditPosUsersMutation
} = apiService
