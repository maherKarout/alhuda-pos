/**
 * Central currency configuration
 * To add a new currency, simply add it to this array
 */

// Import currency flag images
import syrianFlag from 'src/assets/images/syrian.png'
import dollarFlag from 'src/assets/images/$.svg'

export interface Currency {
  code: string // lowercase code (e.g., 'syp', 'usd', 'eur')
  label: string // display name (e.g., 'SYP', 'USD', 'EUR')
  guid: string // Currency GUID (empty for now, will be hardcoded later)
  symbol?: string // optional symbol (e.g., 'SYP', '$', '€')
  flag?: string // optional flag/image path for the currency
  isBaseCurrency: boolean // true if this is the base currency for calculations
  isNew?: boolean // optional flag to show "new" badge above the flag image
}

export const CURRENCIES: Currency[] = [
  {
    code: 'syp',
    label: 'SYP',
    guid: '', // Will be hardcoded later: '936ECC1A-68A3-412A-843A-2AEF07D52B02'
    symbol: 'SYP',
    flag: syrianFlag,
    isBaseCurrency: true
  },
  // To add a new currency, just add it here:
  // {
  //   code: 'syp',
  //   label: 'N-SYP',
  //   guid: '',
  //   symbol: 'N-SYP',
  //   flag: syrianFlag, // You can add a new flag image import and use it here
  //   isBaseCurrency: false,
  //   isNew: true // Set to true to show "new" badge above the flag
  // },
  {
    code: 'usd',
    label: 'USD',
    guid: '', // Will be hardcoded later: 'FD5D0B28-2F9D-4C0F-AE0B-E31E36CF2E14'
    symbol: '$',
    flag: dollarFlag,
    isBaseCurrency: false
  }
]

/**
 * Get the base currency
 */
export const getBaseCurrency = (): Currency => {
  const base = CURRENCIES.find((c) => c.isBaseCurrency)
  if (!base) {
    throw new Error('No base currency defined in CURRENCIES array')
  }
  return base
}

/**
 * Get currency by code
 */
export const getCurrencyByCode = (code: string): Currency | undefined => {
  return CURRENCIES.find((c) => c.code === code)
}

/**
 * Get all currency codes
 */
export const getCurrencyCodes = (): string[] => {
  return CURRENCIES.map((c) => c.code)
}

/**
 * Get currency GUID by code
 */
export const getCurrencyGuid = (code: string): string | undefined => {
  return getCurrencyByCode(code)?.guid
}

/**
 * Get currency by GUID
 */
export const getCurrencyByGuid = (guid: string): Currency | undefined => {
  return CURRENCIES.find((c) => c.guid === guid)
}

/**
 * Create an empty amount object with all currencies initialized to 0
 */
export const createEmptyAmountObject = (): Record<string, number> => {
  const amount: Record<string, number> = {}
  CURRENCIES.forEach((currency) => {
    amount[currency.code] = 0
  })
  return amount
}

/**
 * Type for currency code (derived from config)
 */
export type CurrencyCode = (typeof CURRENCIES)[number]['code']
