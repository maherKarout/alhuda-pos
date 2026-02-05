import { DiscountType, PurchaseStatus, TypeOrder } from '@renderer/consts'
import { createContext, Dispatch, SetStateAction, useContext } from 'react'
export type ItemType = {
  id: string
  code: string
  name: string
  price: number
  quantity: number
  individualPrice: number
  openPrice: boolean
  discountPercentage?: number
  discountValue?: number
  note?: string
}
  export type invoiceDetails = {
    orderGuid: string
  billNumber: number
  customerBalance: number
}
export type CasherScreenContextType = {
  orders: {
    categoryId: string
    customerId: string
    customerName?: string
    branch?: string
    items: ItemType[]
    allBranches: boolean
    searchValue: string
    currentStep: number
    branchId: string | undefined
    type?: TypeOrder
    status?: PurchaseStatus
    billNumber?:string
    orderDiscount?: number
  }[]
  setOrders?: Dispatch<SetStateAction<CasherScreenContextType['orders']>>
  setCurrentOrder?: Dispatch<SetStateAction<CasherScreenContextType['currentOrder']>>
  currentOrder: number
  selectedCategory: string
  setSelectedCategory?: Dispatch<SetStateAction<CasherScreenContextType['selectedCategory']>>
  allBranches: boolean
  ResponseInvoiceDetails: React.RefObject<invoiceDetails | null>
  discount?: {
    amount: number
    type: DiscountType
  }
  setDiscount?: Dispatch<SetStateAction<CasherScreenContextType['discount']>>
}

export const initCacherState: CasherScreenContextType = {
  orders: [
    {
      categoryId: '',
      customerId: '',
      items: [],
      allBranches: false,
      searchValue: '',
      currentStep: 0,
      branchId: undefined,
      type: TypeOrder.NORMAL,
      orderDiscount: undefined
    }
  ],
  setOrders: undefined,
  setCurrentOrder: undefined,
  currentOrder: 0,
  selectedCategory: '',
  allBranches: false,
  ResponseInvoiceDetails: null as unknown as React.RefObject<invoiceDetails | null>,
  discount: {
    amount: 0,
    type: DiscountType.PERCENTAGE
  },
  setDiscount: undefined,
}
export const CasherProvider = createContext<CasherScreenContextType>(initCacherState)

function useCasherScreen() {
  return useContext(CasherProvider)
}

export default useCasherScreen
