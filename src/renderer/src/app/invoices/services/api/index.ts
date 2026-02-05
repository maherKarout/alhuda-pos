import { setSearchParams } from 'src/helpers/set-search-params'
import { api } from 'src/redux-config/store'
import { endPoints } from 'src/shared/end-points'
import { ArgsType } from 'src/types'

export type invoicesType = {
  id: string
}

type ResType = {
  totalRecords?: number
  data: invoicesType[]
}

export type TResponseInvoiceById = {
  customerGuid: string
  customerName: string
  accountName: string
  orderDate: string
  orderStatus: string
  pos: string
  totalPayments: number
  totalPreviousPayment: number
  billNumber:string
  products: {
    productName: string
    quantity: number
    mainQuantity?: number
    unitPrice: number
    subTotal?: number
    disc?: number
    guid: string
    openPrice?: boolean
  }[]
  payments: any[]
  subTotal: number
  disc: number
  tax: number
  total: number
}

const apiService = api
  .enhanceEndpoints({
    addTagTypes: ['Invoices']
  })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllInvoices: query<ResType, ArgsType>({
        providesTags: ['Invoices'],
        query: (props) => {
          const url = setSearchParams(endPoints.orderEndPoint(), props)
          return { url: url.pathname + url.search }
        }
      }),
      getInvoicesById: query<TResponseInvoiceById, string>({
        providesTags: (result, error, id) => [{ type: 'Invoices', id }],
        query: (id) => ({
          url: `${endPoints.orderEndPoint().pathname}/${id}`
        })
      })
    })
  })

export const { useGetAllInvoicesQuery, useGetInvoicesByIdQuery } = apiService
