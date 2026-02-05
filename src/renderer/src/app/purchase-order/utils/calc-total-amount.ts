type ItemType = {
  id: string
  name: string
  price: number
  quantity: number
}

interface OrderTotalCalculation {
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
}

interface CalculationOptions {
  taxAmount?: number
  discountPercentage?: number
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
  const { taxAmount = 0, discountPercentage = 0, discountAmount = 0 } = options

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Tax is a fixed amount, not a rate
  const finalTaxAmount = taxAmount

  // Calculate discount amount (either percentage or fixed amount)
  const calculatedDiscountAmount =
    discountAmount > 0 ? discountAmount : (subtotal * discountPercentage) / 100

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

/**
 * Example usage:
 *
 * // Basic calculation with no tax or discount
 * const total1 = calcTotalAmount(items)
 *
 * // With fixed tax amount
 * const total2 = calcTotalAmount(items, { taxAmount: 1000 }) // 1000 SYP tax
 *
 * // With percentage discount
 * const total3 = calcTotalAmount(items, { discountPercentage: 5 }) // 5% discount
 *
 * // With fixed discount amount
 * const total4 = calcTotalAmount(items, { discountAmount: 1000 }) // 1000 SYP discount
 *
 * // Combined tax and discount
 * const total5 = calcTotalAmount(items, {
 *   taxAmount: 1000,
 *   discountPercentage: 5
 * })
 *
 * // Get just the total amount (number)
 * const simpleTotal = getTotalAmountForOrder(items, { taxAmount: 1000 })
 */
