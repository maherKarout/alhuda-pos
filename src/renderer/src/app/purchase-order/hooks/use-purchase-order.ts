// import { createContext, Dispatch, SetStateAction, useContext } from 'react'
// type ItemType = {
//   id: string
//   code: string
//   name: string
//   price: number
//   quantity: number
// }
// export type PurchaseOrderContextType = {
//   orders: {
//     categoryId: string
//     customerId: string
//     items: ItemType[]
//     allBranches: boolean
//     searchValue: string
//     currentStep: number
//   }[]
//   setOrders?: Dispatch<SetStateAction<PurchaseOrderContextType['orders']>>
//   setCurrentOrder?: Dispatch<SetStateAction<PurchaseOrderContextType['currentOrder']>>
//   currentOrder: number
//   selectedCategory: string
//   setSelectedCategory?: Dispatch<SetStateAction<PurchaseOrderContextType['selectedCategory']>>
//   allBranches: boolean
//   invoiceId: React.RefObject<string | null>

import { CasherScreenContextType } from '@renderer/app/casher-screen/hooks/use-casher-screen'
import { useContext } from 'react'
import { createContext } from 'react'

// }
export type PurchaseOrderContextType = Omit<CasherScreenContextType, 'ResponseInvoiceDetails'>
export const initPurchaseOrderState: PurchaseOrderContextType = {
  orders: [
    {
      categoryId: '',
      customerId: '',
      items: [],
      allBranches: false,
      searchValue: '',
      currentStep: 0,
      branchId: undefined,
      customerName: '',
      status: undefined,
      billNumber:undefined,
    }
  ],
  setOrders: undefined,
  setCurrentOrder: undefined,
  currentOrder: 0,
  selectedCategory: '',
  allBranches: false
  // invoiceId: null as unknown as React.RefObject<string | null>
}
export const PurchaseOrderProvider = createContext<PurchaseOrderContextType>(initPurchaseOrderState)

function usePurchaseOrder() {
  return useContext(PurchaseOrderProvider)
}

export default usePurchaseOrder
