const formatNumber = (value: string) => {
  if (value) {
    // Remove non-numeric characters except dots
    const numericValue = `${value}`.replace(/[^0-9.]/g, '')
    // Format with commas
    return new Intl.NumberFormat('en-US').format(Number(numericValue))
  } else return '---'
}

export const priceToDecimalPrice = (price: string) => {
  if (Number(price) < 0) return formatNumber(price) + '-'
  else return formatNumber(price)
  // return formatNumber(price)
}

export const decimalPriceToNumber = (decimalPrice: string): number => {
  if (!decimalPrice || decimalPrice === '---') {
    return 0
  }
  // Remove commas and any non-numeric characters except dots and minus signs
  const numericValue = decimalPrice.replace(/[^0-9.-]/g, '')
  // Convert to number
  const result = Number(numericValue)
  // Return 0 if the result is NaN
  return isNaN(result) ? 0 : result
}
