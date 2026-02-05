import { setSearchParams } from 'src/helpers/set-search-params'
import { api } from 'src/redux-config/store'
import { endPoints } from 'src/shared/end-points'
import { ArgsType } from 'src/types'

export type customersType = {
  id: string
  customerId: string
  name: string
  phone: string
  numberOfInvoices: number
  totalPurchases: number
  totalPaymentSyp: number
  totalPaymentUsd: number
}

export type ResType = {
  totalRecords?: number
  data: customersType[]
}

type customersById = { data: customersType }

export type AddCustomersType = {
  customerId: string
  name: string
  phone: string
}

export type TypeCustomerPayment = {
  date: string
  amount: {
    usd: number
    syp: number
  }
  type: string
  casher: string
}

type customerPaymentsType = {
  data: TypeCustomerPayment[]
}
const apiService = api
  .enhanceEndpoints({
    addTagTypes: ['Customers']
  })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllCustomers: query<ResType, ArgsType>({
        providesTags: ['Customers'],
        query: (props) => {
          const url = setSearchParams(endPoints.customerEndPoint(), props)
          return { url: url.pathname + url.search }
        }
      }),
      getAllCustomersWithoutPagination: query<ResType, { searchValue?: string }>({
        providesTags: ['Customers'],
        query: (props) => {
          const url = setSearchParams(endPoints.customerEndPoint(), props)
          return { url: url.pathname + '/autocomplete' + url.search }
        }
      }),
      getCustomersById: query<customersById, string>({
        providesTags: ['Customers'],
        query: (id) => ({
          url: `${endPoints.customerEndPoint().pathname}/${id}`
        })
      }),
      addCustomers: mutation<void, Partial<AddCustomersType>>({
        invalidatesTags: ['Customers'],
        query: (data) => ({
          url: endPoints.customerEndPoint().pathname,
          method: 'POST',
          data
        })
      }),
      editCustomers: mutation<void, { id: string; data: Partial<customersType> }>({
        invalidatesTags: (result, error, { id }) => [{ type: 'Customers', id }, 'Customers'],
        query: ({ data, id }) => ({
          url: `${endPoints.customerEndPoint().pathname}/${id}`,
          method: 'PATCH',
          data
        })
      }),
      deleteCustomers: mutation<void, string>({
        invalidatesTags: ['Customers'],
        query: (id) => ({
          url: `${endPoints.customerEndPoint().pathname}/${id}`,
          method: 'DELETE'
        })
      }),
      getCustomerPayments: query<customerPaymentsType, string>({
        providesTags: ['Customers'],
        query: (id) => ({
          url: `${endPoints.customerPaymentsEndPoint().pathname}/${id}`
        })
      })
    })
  })

export const {
  useAddCustomersMutation,
  useDeleteCustomersMutation,
  useGetAllCustomersQuery,
  useGetCustomersByIdQuery,
  useEditCustomersMutation,
  useGetAllCustomersWithoutPaginationQuery,
  useGetCustomerPaymentsQuery
} = apiService
