import { ResTypeProducts } from '@renderer/app/casher-screen'
import { TCategoriesResType } from '@renderer/app/role/services/api'
import { PurchaseStatus } from '@renderer/consts'
import { setSearchParams } from '@renderer/helpers/set-search-params'
import { ArgsType } from '@renderer/types'
import { api } from 'src/redux-config/store'
import { endPoints } from 'src/shared/end-points'

// Type for purchase order request body
type BodyPurchaseOrder = {
  isRefund?: boolean
  customer?: string
  items: {
    productGuid: string
    quantity: number
  }[]
  pos?: string
  id?: string
}

type PurchaseOrderItem = {
  id: string
  account: string
  numberOfItems: number
  createdAt: string
  status: string
}

type TRPurchaseOrderDetails = {
  customer?: string
  branch?: string
  billNumber?: string
  status?: PurchaseStatus
  items: {
    id: string
    code: string
    name: string
    price: number
    quantity: number
  }[]
}

type TResponsePurchaseOrder = {
  totalRecords?: number
  data: PurchaseOrderItem[]
}

type PropsGetAllProducts = {
  searchValue: string
  allPos: boolean
  category: string
}

const apiService = api
  .enhanceEndpoints({
    addTagTypes: ['Purchase-order']
  })
  .injectEndpoints({
    endpoints: ({ query, mutation }) => ({
      getAllPurchaseOrders: query<TResponsePurchaseOrder, ArgsType>({
        providesTags: ['Purchase-order'],
        keepUnusedDataFor: 0,
        query: (props) => {
          const url = setSearchParams(endPoints.purchaseOrderEndPoint(), props)
          return { url: url.pathname + url.search }
        }
      }),
      addPurchaseOrder: mutation<void, BodyPurchaseOrder>({
        invalidatesTags: ['Purchase-order'],
        query: (body) => ({
          url: body?.isRefund
            ? endPoints.purchaseOrderEndPoint().pathname + '/refund'
            : endPoints.purchaseOrderEndPoint().pathname,
          method: 'POST',
          data: { ...body, isRefund: undefined }
        })
      }),
      addAdminPurchaseOrder: mutation<void, BodyPurchaseOrder>({
        invalidatesTags: ['Purchase-order'],
        query: (body) => ({
          url: endPoints.adminPurchaseOrderEndPoint().pathname,
          method: 'POST',
          data: body
        })
      }),
      getPurchaseOrderById: query<TRPurchaseOrderDetails, { id: string; isAdmin?: boolean }>({
        providesTags: ['Purchase-order'],
        query: ({ id, isAdmin }) => ({
          url: `${isAdmin ? endPoints.adminPurchaseOrderEndPoint().pathname : endPoints.purchaseOrderEndPoint().pathname}/${id}`,
          method: 'GET'
        })
      }),
      updatePurchaseOrder: mutation<void, BodyPurchaseOrder>({
        invalidatesTags: ['Purchase-order'],
        query: (body) => ({
          url: `${endPoints.purchaseOrderEndPoint().pathname}/${body.id}`,
          method: 'PUT',
          data: body
        })
      }),
      updateAdminPurchaseOrder: mutation<void, BodyPurchaseOrder>({
        invalidatesTags: ['Purchase-order'],
        query: (body) => ({
          url: `${endPoints.adminPurchaseOrderEndPoint().pathname}/${body.id}`,
          method: 'PUT',
          data: body
        })
      }),
      // ====================== UPDATE PURCHASE ORDER STATUS ======================
      updatePurchaseOrderStatus: mutation<void, { id: string; status: PurchaseStatus }>({
        invalidatesTags: ['Purchase-order'],
        query: (body) => ({
          url: `${endPoints.purchaseOrderEndPoint().pathname}/${body.id}`,
          method: 'PATCH',
          data: body
        })
      }),

      // ====================== UPDATE ADMIN PURCHASE ORDER STATUS ======================
      updateAdminPurchaseOrderStatus: mutation<void, { id: string; status: PurchaseStatus }>({
        invalidatesTags: ['Purchase-order'],
        query: (body) => ({
          url: `${endPoints.adminPurchaseOrderEndPoint().pathname}/${body.id}`,
          method: 'PATCH',
          data: body
        })
      }),
      getAllProductsBranch: query<ResTypeProducts, PropsGetAllProducts>({
        providesTags: ['Purchase-order'],
        keepUnusedDataFor: 0,
        query: (props) => {
          const url = setSearchParams(endPoints.productsEndPoint(), {
            searchValue: props.searchValue,
            // allPos: props.allPos,
            category: props.category
          })
          return { url: url.pathname + '/all' + url.search }
        }
      }),
      // get all categories
      getAllCategoriesForPurchaseOrder: query<TCategoriesResType, void>({
        query: () => ({ url: endPoints.categoriesEndPoint().pathname + '/all' })
      })
    })
  })

export const {
  useAddPurchaseOrderMutation,
  useGetAllPurchaseOrdersQuery,
  useGetPurchaseOrderByIdQuery,
  useUpdatePurchaseOrderMutation,
  useUpdatePurchaseOrderStatusMutation,
  useGetAllProductsBranchQuery,
  useGetAllCategoriesForPurchaseOrderQuery,
  useAddAdminPurchaseOrderMutation,
  useUpdateAdminPurchaseOrderMutation,
  useUpdateAdminPurchaseOrderStatusMutation
} = apiService
