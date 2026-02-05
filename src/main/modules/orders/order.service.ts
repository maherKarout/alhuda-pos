import { prisma } from '../../prisma/client'
import { CreateLocalOrderInput } from './dto/dto'

export class OrderService {
  // ====================== Create local order ======================
  async createLocalOrder(
    order: CreateLocalOrderInput
  ): Promise<{ success: boolean; data?: unknown; error?: string }> {
    try {
      const { items, amount, ...rest } = order
      console.log('🚀 ~ OrderService ~ createLocalOrder ~ amount:', amount)
      const result = await prisma.localOrder.create({
        data: {
          ...rest,
          orderDiscount: rest.orderDiscount ?? 0,
          customerOrderId: rest.customerOrderId ?? false,
          status: rest.status ?? 'pending',
          items: {
            create: items.map((item) => ({
              productGuid: item.productGuid,
              quantity: item.quantity,
              itemNote: item.itemNote ?? undefined
            }))
          },
          ...(amount != null && {
            amount: {
              create: { usd: amount.usd, syp: amount.syp }
            }
          })
        }
      })
      return { success: true, data: result }
    } catch (error) {
      console.log('🚀 ~ ProductService ~ createLocalOrder ~ error:', error)
      throw error
    }
  }

  /** Creates a local order with hardcoded test data. Use for testing only. */
  async createLocalOrderTest(): Promise<{ success: boolean; data?: unknown; error?: string }> {
    const createInput: CreateLocalOrderInput = {
      totalPrice: 99.5,
      orderDiscount: 0,
      approximationDiscountValue: null,
      customerOrderId: false,
      paymentMethod: 'CASH',
      currency: '00000000-0000-0000-0000-000000000001',
      status: 'pending',
      customer: '00000000-0000-0000-0000-000000000002',

      // 1. NESTED MANY: Use the 'create' keyword
      items: [
        {
          productGuid: 'test-product-guid-1',
          quantity: 2,
          itemNote: 'Test item 1'
        },
        {
          productGuid: 'test-product-guid-2',
          quantity: 1,
          itemNote: null
        }
      ],

      // 2. NESTED ONE: Also use the 'create' keyword
      amount: {
        usd: 50,
        syp: 49.5
      }
    }
    return this.createLocalOrder(createInput)
  }
}
