import { setSearchParams } from 'src/helpers/set-search-params'
import { api } from 'src/redux-config/store'
import { endPoints } from 'src/shared/end-points'
import { ArgsType } from 'src/types'

export type inventoryType = {
  id: string
}

type ResType = {
  totalRecords?: number
  data: inventoryType[]
}

type inventoryById = inventoryType

export type TNewQuantity = {
  id: string
  newValue: number
}

type TUpdateInventory = {
  inventories: { productGuid: string; quantity: number }[]
}
const apiService = api
  .enhanceEndpoints({
    addTagTypes: ['Inventory']
  })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllInventory: query<ResType, ArgsType>({
        providesTags: ['Inventory'],
        query: (props) => {
          const url = setSearchParams(endPoints.inventoryEndPointEndpoint(), props)
          return { url: url.pathname + url.search }
        }
      }),
      getInventoryById: query<inventoryById, string>({
        providesTags: (result, error, id) => [{ type: 'Inventory', id }],
        query: (id) => ({
          url: `${endPoints.inventoryEndPointEndpoint()}/${id}`
        })
      }),
      // addInventory: mutation<void, Partial<inventoryType>>({
      //   invalidatesTags: ["Inventory"],
      //   query: (data) => ({
      //     url: endPoints.inventoryEndPointEndpoint(),
      //     method: "POST",
      //     data
      //   }),
      // }),
      editInventory: mutation<void, TUpdateInventory>({
        invalidatesTags: ['Inventory'],
        query: (body) => ({
          url: `${endPoints.inventoryEndPointEndpoint().pathname}`,
          method: 'PUT',
          data: body
        })
      }),
      deleteInventory: mutation<void, string>({
        invalidatesTags: ['Inventory'],
        query: (id) => ({
          url: `${endPoints.inventoryEndPointEndpoint()}/${id}`,
          method: 'DELETE'
        })
      })
    })
  })

export const {
  // useAddInventoryMutation,
  useDeleteInventoryMutation,
  useGetAllInventoryQuery,
  useGetInventoryByIdQuery,
  useEditInventoryMutation
} = apiService
