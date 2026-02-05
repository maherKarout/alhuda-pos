import { TResponseInvoiceById } from '@renderer/app/invoices'
import { CasherScreenContextType } from '../hooks/use-casher-screen'
import { TypeOrder } from '@renderer/consts'

export function DtoOrderById(order: TResponseInvoiceById): CasherScreenContextType['orders'][0] {
  return {
    categoryId: '',
    customerId: order.customerGuid,
    customerName: order.customerName,
    items: order?.products?.map((product) => ({
      id: product.guid,
      code: product.guid,
      name: product.productName,
      price: product.unitPrice,
      quantity: product.quantity,
      individualPrice: product.unitPrice,
      discountPercentage: 0,
      discountValue: 0,
      openPrice: product.openPrice ?? false
    })),
    allBranches: false,
    searchValue: '',
    currentStep: 0,
    branchId: undefined,
    type: TypeOrder.NORMAL
  }
}
