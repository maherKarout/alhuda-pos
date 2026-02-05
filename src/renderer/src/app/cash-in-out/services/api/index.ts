import { OrderType } from '@renderer/consts'
import { setSearchParams } from 'src/helpers/set-search-params'
import { api } from 'src/redux-config/store'
import { endPoints } from 'src/shared/end-points'
import { ArgsType } from 'src/types'

export type cashInOutType = {
  id: string
}

export type orderType = {
  orderId: string
  orderGuid: string
  guid: string
  remainingPrice: number
  price: number
  billNumber: string
  orderType: OrderType
}

type ResType = {
  totalRecords?: number
  data: cashInOutType[]
}

type OrdersResType = {
  totalRecords?: number
  data: orderType[]
}
export type AddCashInType = {
  customer: string
  orderGuid: string
  amount: {
    usd: number
    syp: number
  }
  date: string
  notes: string
  type: 'receipt' | 'purchase'
}

export type AddCashOutType = {
  notes: string
  amount: {
    syp: number
    usd: number
  }
  reason: 'expenses' | 'supplier'
}
const apiService = api
  .enhanceEndpoints({
    addTagTypes: ['Cash-in-out']
  })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllCustomersWithoutPagination: query<ResType, ArgsType>({
        providesTags: ['Cash-in-out'],
        query: (props) => {
          const url = setSearchParams(endPoints.customerEndPoint(), props)
          return {
            url: url.pathname + url.search
          }
        }
      }),
      getCustomerNotCompletedOrders: query<OrdersResType, string>({
        providesTags: (result, error, id) => [{ type: 'Cash-in-out', id }],
        query: (id) => ({
          url: `${endPoints.customerNotCompletedOrdersEndPoint().pathname}/${id}`
        })
      }),
      addCashIn: mutation<void, Partial<AddCashInType>>({
        invalidatesTags: ['Cash-in-out'],
        query: (data) => ({
          url: endPoints.addCashInEndPoint().pathname,
          method: 'POST',
          data
        })
      }),
      addCashOut: mutation<void, Partial<AddCashOutType>>({
        invalidatesTags: ['Cash-in-out'],
        query: (data) => ({
          url: endPoints.addCashOutEndPoint().pathname,
          method: 'POST',
          data
        })
      })
    })
  })

export const {
  useGetAllCustomersWithoutPaginationQuery,
  useGetCustomerNotCompletedOrdersQuery,
  useAddCashInMutation,
  useAddCashOutMutation
} = apiService
