import { DiscountType } from '@renderer/consts'
import { calcDiscountValue } from './calc-discount-value'
import { ItemType } from '../hooks/use-casher-screen'

interface OrderTotalCalculation {
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
}

interface CalculationOptions {
  taxAmount?: number
  discountType?: DiscountType
  discountAmount?: number
}

/**
 * Calculate the total amount for an order
 * @param items - Array of items in the order
 * @param options - Calculation options (tax amount, discount)
 * @returns Object containing subtotal, tax, discount, and total amounts
 */
export function calcTotalAmount(
  items: ItemType[],
  options: CalculationOptions = {}
): OrderTotalCalculation {
  const { taxAmount = 0, discountType = DiscountType.PERCENTAGE, discountAmount = 0 } = options

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Tax is a fixed amount, not a rate
  const finalTaxAmount = taxAmount

  // Calculate discount amount based on type
  let calculatedDiscountAmount = calcDiscountValue(discountAmount, discountType, items)

  // if (discountType === DiscountType.PERCENTAGE) {
  //   // Percentage discount
  //   calculatedDiscountAmount = (subtotal * discountAmount) / 100
  // } else if (discountType === DiscountType.AMOUNT) {
  //   // Fixed amount discount
  //   calculatedDiscountAmount = discountAmount
  // }

  // Calculate total amount
  const totalAmount = subtotal + finalTaxAmount - calculatedDiscountAmount

  return {
    subtotal,
    taxAmount: finalTaxAmount,
    discountAmount: calculatedDiscountAmount,
    totalAmount: Math.max(0, totalAmount) // Ensure total is never negative
  }
}

/**
 * Simple function to get just the total amount
 * @param items - Array of items in the order
 * @param options - Calculation options (tax amount, discount)
 * @returns Total amount as a number
 */
export function getTotalAmountForOrder(
  items: ItemType[],
  options: CalculationOptions = {}
): number {
  return calcTotalAmount(items, options).totalAmount
}

export default calcTotalAmount
