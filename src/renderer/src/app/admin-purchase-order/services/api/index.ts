import { setSearchParams } from 'src/helpers/set-search-params'
import { api } from 'src/redux-config/store'
import { endPoints } from 'src/shared/end-points'
import { ArgsType } from 'src/types'

export type adminPurchaseOrderType = {
  id: string
}

type ResType = {
  totalRecords?: number
  data: adminPurchaseOrderType[]
}

type adminPurchaseOrderById = adminPurchaseOrderType

const apiService = api
  .enhanceEndpoints({
    addTagTypes: ['AdminPurchaseOrder']
  })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllAdminPurchaseOrder: query<ResType, ArgsType>({
        providesTags: ['AdminPurchaseOrder'],
        query: (props) => {
          const url = setSearchParams(endPoints.superAdminPurchaseEndpoint(), props)
          return { url: url.pathname + url.search }
        }
      }),
      getAdminPurchaseOrderById: query<adminPurchaseOrderById, string>({
        providesTags: (result, error, id) => [{ type: 'AdminPurchaseOrder', id }],
        query: (id) => ({
          url: `${endPoints.superAdminPurchaseOrderEndpoint().pathname}/${id}`
        })
      }),
      addAdminPurchaseOrder: mutation<void, Partial<adminPurchaseOrderType>>({
        invalidatesTags: ['AdminPurchaseOrder'],
        query: (data) => ({
          url: endPoints.superAdminPurchaseOrderEndpoint().pathname,
          method: 'POST',
          data
        })
      }),
      editAdminPurchaseOrder: mutation<void, { id: string; data: Partial<adminPurchaseOrderType> }>(
        {
          invalidatesTags: (result, error, { id }) => [
            { type: 'AdminPurchaseOrder', id },
            'AdminPurchaseOrder'
          ],
          query: ({ data, id }) => ({
            url: `${endPoints.superAdminPurchaseOrderEndpoint().pathname}/${id}`,
            method: 'PATCH',
            data
          })
        }
      )
    })
  })

export const {
  useAddAdminPurchaseOrderMutation,
  useGetAllAdminPurchaseOrderQuery,
  useGetAdminPurchaseOrderByIdQuery,
  useEditAdminPurchaseOrderMutation
} = apiService
