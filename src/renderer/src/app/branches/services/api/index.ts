import { setSearchParams } from 'src/helpers/set-search-params'
import { api } from 'src/redux-config/store'
import { endPoints } from 'src/shared/end-points'
import { ArgsType } from 'src/types'

export type branchesType = {
  id: string
  location: string
  name: string
  posAdmin: string | null
  casherBox: {
    syp: number
    usd: number
  }
  createdAt: string
}

type ResType = {
  totalRecords?: number
  data: branchesType[]
}

type branchesById = branchesType

const apiService = api
  .enhanceEndpoints({
    addTagTypes: ['Branches']
  })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllBranches: query<ResType, ArgsType>({
        providesTags: ['Branches'],
        query: (props) => {
          const url = setSearchParams(endPoints.posEndPoint(), props)
          return { url: url.pathname + url.search }
        }
      }),
      getAllBranchesWithoutPagination: query<ResType, void>({
        providesTags: (result, error, id) => [{ type: 'Branches' }],
        query: () => ({
          url: `${endPoints.posEndPoint().pathname}`
        })
      }),
      getBranchesById: query<branchesById, string>({
        providesTags: (result, error, id) => [{ type: 'Branches', id }],
        query: (id) => ({
          url: `${endPoints.posEndPoint().pathname}/${id}`
        })
      }),
      addBranches: mutation<void, Partial<branchesType>>({
        invalidatesTags: ['Branches'],
        query: (data) => ({
          url: endPoints.posEndPoint().pathname,
          method: 'POST',
          data
        })
      }),
      editBranches: mutation<void, { id: string; data: Partial<branchesType> }>({
        invalidatesTags: (result, error, { id }) => [{ type: 'Branches', id }, 'Branches'],
        query: ({ data, id }) => ({
          url: `${endPoints.posEndPoint().pathname}/${id}`,
          method: 'PATCH',
          data
        })
      }),

      // =========================== without auth ===========================
      getAllBranchesWithoutAuth: query<ResType, void>({
        providesTags: (result, error, id) => [{ type: 'Branches' }],
        query: () => ({
          url: `${endPoints.posEndPointWithoutAuth().pathname}`
        })
      })
    })
  })

export const {
  useAddBranchesMutation,
  useGetAllBranchesQuery,
  useGetBranchesByIdQuery,
  useEditBranchesMutation,
  useGetAllBranchesWithoutPaginationQuery,
  useGetAllBranchesWithoutAuthQuery
} = apiService
