import { DiscountType } from '@renderer/consts'
import { ItemType } from '../hooks/use-casher-screen'

export function calcDiscountValue(
  discountAmount: number,
  discountType: DiscountType,
  items?: ItemType[]
) {
  // Calculate discount amount based on type
  let calculatedDiscountAmount = 0
  const subtotal = items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 1


  if (discountType === DiscountType.PERCENTAGE) {
    // Percentage discount
    calculatedDiscountAmount = (subtotal * discountAmount) / 100
  } else if (discountType === DiscountType.AMOUNT) {
    // Fixed amount discount
    calculatedDiscountAmount = discountAmount
  }
  return calculatedDiscountAmount
}
