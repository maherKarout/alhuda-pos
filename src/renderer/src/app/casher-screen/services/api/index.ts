import { CurrencyGuid, PaidStatus } from '@renderer/consts'
import { ExchangeRate } from '@renderer/redux-config/global-config-slice'
import { setSearchParams } from 'src/helpers/set-search-params'
import { api } from 'src/redux-config/store'
import { endPoints } from 'src/shared/end-points'
import { ArgsType } from 'src/types'

export type casherScreenType = {
  id: string
}

type ResType = {
  totalRecords?: number
  data: casherScreenType[]
}

export type productsType = {
  id: string
  name: string
  code: string
  individualPrice: number
  wholesalePrice: number
  category: string
  quantity: number
  openPrice: boolean
}

export type ResTypeProducts = {
  totalRecords?: number
  data: productsType[]
}

type TRCasherBoxData = { syp: number; usd: number }

type casherScreenById = casherScreenType

export type BodyOrder = {
  customerOrderId?: string
  items: {
    productGuid: string
    quantity: number
  }[]
  amount: {
    usd: number
    syp: number
  }
  paymentMethod: 'CASH'
  currency: CurrencyGuid
  status: PaidStatus
  customer: string
  orderId?: string
  orderGuid?: string
  totalPrice?: number
  orderDiscount?: number
  approximationDiscountValue?: number
}

type PropsGetAllProducts = {
  searchValue: string
  allPos: boolean
  category: string
  page?: number
  limit?: number
  needPagination?: boolean
  total?: boolean
}
type ResTypeExchangeRates = {
  data: ExchangeRate[]
}
type BodyHandOver = {
  usd: number
  syp: number
  nextCashier: string
}
// ====================== Type response ordos by customer  ======================
export type TRefundOrderItem = {
  orderId: string
  guid: string
  billNumber: number
  remainingPrice: number
  price: number
  // name: string
  // quantity: number
}
type ResTypeOrdersByCustomer = {
  data: TRefundOrderItem[]
}

export type TBodyRefund = {
  customer: string
  items: {
    productGuid: string
    quantity: number
  }[]
  amount: {
    syp: number
    usd: number
  }
}

const apiService = api
  .enhanceEndpoints({
    addTagTypes: ['Casher-screen']
  })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllCasherScreen: query<ResType, ArgsType>({
        providesTags: ['Casher-screen'],
        query: (props) => {
          const url = setSearchParams(endPoints.casherScreenEndPoint(), props)
          return { url: url.pathname + url.search }
        }
      }),
      getCasherScreenById: query<casherScreenById, string>({
        providesTags: (result, error, id) => [{ type: 'Casher-screen', id }],
        query: (id) => ({
          url: `${endPoints.casherScreenEndPoint().pathname}/${id}`
        })
      }),
      getAllProducts: query<ResTypeProducts, Partial<PropsGetAllProducts> | void>({
        providesTags: ['Casher-screen'],
        query: (props) => {
          const url = setSearchParams(endPoints.productsEndPoint(), {
            searchValue: props?.searchValue ?? undefined,
            allPos: props?.allPos ?? undefined,
            category: props?.category ?? undefined
          })
          return { url: url.pathname + url.search }
        }
      }),
      getAllProductsWithPagination: query<ResTypeProducts, ArgsType>({
        providesTags: ['Casher-screen'],
        query: (props) => {
          const url = setSearchParams(endPoints.productsEndPoint(), props)
          return { url: url.pathname + url.search }
        }
      }),
      getProductBySerialNumber: mutation<{ data: productsType }, string>({
        invalidatesTags: (result, error, id) => [{ type: 'Casher-screen', id }],
        query: (id) => ({
          url: `${endPoints.getProductBySerialNumberEndPoint().pathname}/${id}`,
          method: 'GET'
        })
      }),
      addOrder: mutation<
        { orderGuid: string; billNumber: number; customerBalance: number },
        BodyOrder
      >({
        invalidatesTags: ['Casher-screen'],
        query: (body) => ({
          url: endPoints.orderEndPoint().pathname,
          method: 'POST',
          data: body
        })
      }),
      getCasherBox: mutation<TRCasherBoxData, void>({
        invalidatesTags: (result, error, body) => [{ type: 'Casher-screen', body }],
        query: (body) => ({
          method: 'GET',
          data: body,
          url: endPoints.getCasherBoxEndpoint().pathname
        })
      }),
      getCasherBoxData: query<TRCasherBoxData, void>({
        providesTags: ['Casher-screen'],
        keepUnusedDataFor: 0,
        query: (body) => ({
          method: 'GET',
          data: body,
          url: endPoints.getCasherBoxEndpoint().pathname
        })
      }),
      getExchangeRates: mutation<ResTypeExchangeRates, void>({
        invalidatesTags: ['Casher-screen'],
        // @ts-ignore //TODO
        keepUnusedDataFor: 0,
        query: () => ({
          url: endPoints.getExchangeRatesEndPoint().pathname,
          method: 'GET'
        })
      }),
      handOver: mutation<void, BodyHandOver>({
        invalidatesTags: ['Casher-screen'],
        query: (body) => ({
          url: endPoints.handOverEndPoint().pathname,
          method: 'POST',
          data: body
        })
      }),
      sendRefundOrder: mutation<void, TBodyRefund>({
        invalidatesTags: ['Casher-screen'],
        query: (body) => ({
          url: endPoints.sendRefundOrderEndpoint().pathname,
          method: 'PATCH',
          data: { ...body, orderId: undefined }
        })
      }),
      getOrdersByCustomerId: query<ResTypeOrdersByCustomer, string>({
        providesTags: ['Casher-screen'],
        query: (customerId) => ({
          url: `${endPoints.getOrdersByCustomerIdEndPoint().pathname}/${customerId}`
        })
      }),
      // ====================== customer order ======================
      customerOrder: mutation<void, BodyOrder>({
        invalidatesTags: ['Casher-screen'],
        query: (body) => ({
          url: endPoints.customerOrderEndpoint().pathname,
          method: 'POST',
          data: body
        })
      }),

      // ====================== customer order ======================
      updateCustomerOrder: mutation<void, BodyOrder>({
        invalidatesTags: ['Casher-screen'],
        query: (body) => ({
          url: `${endPoints.customerOrderEndpoint().pathname}/${body.customerOrderId}`,
          method: 'PUT',
          data: { ...body, customerOrderId: undefined }
        })
      }),
      // ====================== Send order for customer order ======================
      addOrderCustomerInvoice: mutation<void, BodyOrder>({
        invalidatesTags: ['Casher-screen'],
        query: (body) => ({
          url: `${endPoints.orderCustomerInvoiceEndpoint().pathname}/${body.customerOrderId}`,
          method: 'POST',
          data: { ...body, customerOrderId: undefined }
        })
      })
      // ====================== send refudn purchase order  ======================
    })
  })

export const {
  useGetAllCasherScreenQuery,
  useGetCasherScreenByIdQuery,
  useGetAllProductsQuery,
  useGetProductBySerialNumberMutation,
  useAddOrderMutation,
  useGetCasherBoxMutation,
  useGetExchangeRatesMutation,
  useGetCasherBoxDataQuery,
  useHandOverMutation,
  useSendRefundOrderMutation,
  useGetOrdersByCustomerIdQuery,
  useGetAllProductsWithPaginationQuery,
  useCustomerOrderMutation,
  useUpdateCustomerOrderMutation,
  useAddOrderCustomerInvoiceMutation
} = apiService
