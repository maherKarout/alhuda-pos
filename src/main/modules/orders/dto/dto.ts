import type { OrderStatus } from '../../../../generated/prisma/client'

/** Input for creating a local order (what the renderer sends). Use this with createLocalOrder. */
export type CreateLocalOrderInput = {
  totalPrice: number
  orderDiscount?: number
  approximationDiscountValue?: number | null
  customerOrderId?: boolean
  paymentMethod: string
  currency: string
  status?: OrderStatus
  customer: string
  items: { productGuid: string; quantity: number; itemNote?: string | null }[]
  amount?: { usd: number; syp: number }
}
