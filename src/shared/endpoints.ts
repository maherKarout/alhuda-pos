import 'dotenv/config'

export const baseUrlElectron = `${process.env.VITE_API_PROTOCOL ?? ''}${process.env.VITE_API_HOST ?? ''}${
  process.env.VITE_API_PORT ?? ''
}${process.env.VITE_API_PREFIX ?? ''}${process.env.VITE_API_VERSION1 ?? ''}`

const getEndPoint = (endPoint: string) => () => {
  const url = new URL(endPoint, baseUrlElectron)
  return url
}

export const endPoints = {
  productsEndPoint: getEndPoint('/pos/products'),
  customersEndPoint: getEndPoint('/pos/customer')
} as const
