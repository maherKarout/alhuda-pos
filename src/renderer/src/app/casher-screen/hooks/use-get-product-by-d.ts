import { useState, useCallback } from 'react'

// TProduct type definition
export type TProduct = {
  id: string
  name: string
  code: string
  individualPrice: number
  wholesalePrice: number
  category: string
}

type FetchResult<T> = { success: true; data: T } | { success: false; error: string }

// RTK Query mutation-like status object
interface MutationStatus {
  data: TProduct | undefined
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  error: string | undefined
  isUninitialized: boolean
  reset: () => void
}

// Mutation function type
type GetProductByIdMutation = (id: string) => Promise<TProduct | undefined>

// Return type as tuple like RTK Query mutations
type UseGetProductByIdMutation = [GetProductByIdMutation, MutationStatus]

export const useGetProductByIdMutation = (): UseGetProductByIdMutation => {
  const [data, setData] = useState<TProduct | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isUninitialized, setIsUninitialized] = useState(true)

  const reset = useCallback(() => {
    setData(undefined)
    setIsLoading(false)
    setIsError(false)
    setError(undefined)
    setIsUninitialized(true)
  }, [])

  const getProductById = useCallback(async (id: string): Promise<TProduct | undefined> => {
    try {
      setIsLoading(true)
      setIsError(false)
      setError(undefined)
      setIsUninitialized(false)

      const result: FetchResult<TProduct> = await window.api.getProductById(id)

      if (result.success) {
        setData(result.data)
        setIsError(false)
        setError(undefined)
        return result.data
      } else {
        setIsError(true)
        setError(result.error)
        setData(undefined)
        throw new Error(result.error)
      }
    } catch (err: any) {
      setIsError(true)
      setError(err.message || 'An unexpected error occurred')
      setData(undefined)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const isSuccess = !isLoading && !isError && data !== undefined

  const status: MutationStatus = {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
    isUninitialized,
    reset
  }

  return [getProductById, status]
}
