import { useState, useEffect, useCallback } from 'react'

// Generic FetchResult type for Electron API responses
type FetchResult<T> = { success: true; data: T } | { success: false; error: string }

// Options for the hook
interface UseDbDataOptions {
  autoFetch?: boolean
  dependencies?: any[]
}

// RTK Query-like return type interface
interface UseDbDataResult<T> {
  data: T | undefined
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  isSuccess: boolean
  error: string | undefined
  refetch: () => Promise<void>
  isUninitialized: boolean
}

/**
 * Reusable custom hook for fetching data from Electron API with consistent status states
 *
 * @param apiFunction - Function that returns a Promise<FetchResult<T>>
 * @param options - Configuration options
 * @returns Object with data, loading states, error states, and refetch function
 *
 * @example
 * // For products
 * const useGetAllProducts = () => {
 *   return useDbDataWithStatus(() => window.api.getAllProducts())
 * }
 *
 * // For customers
 * const useGetAllCustomers = () => {
 *   return useDbDataWithStatus(() => window.api.getAllCustomers())
 * }
 *
 * // With parameters and dependencies
 * const useGetProductById = (id: string) => {
 *   return useDbDataWithStatus(
 *     () => window.api.getProductById(id),
 *     { dependencies: [id] }
 *   )
 * }
 */
export const useDbDataWithStatus = <T>(
  apiFunction: () => Promise<FetchResult<T>>,
  options: UseDbDataOptions = {}
): UseDbDataResult<T> => {
  const { autoFetch = true, dependencies = [] } = options

  // State management - same as your original hook
  const [data, setData] = useState<T | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isUninitialized, setIsUninitialized] = useState(true)

  // Generic fetch function
  const fetchData = useCallback(async () => {
    try {
      setIsFetching(true)
      setIsError(false)
      setError(undefined)

      // Set loading to true only on initial load
      if (isUninitialized) {
        setIsLoading(true)
        setIsUninitialized(false)
      }

      // Call the provided API function
      const result: FetchResult<T> = await apiFunction()

      if (result.success) {
        setData(result.data)
        setIsError(false)
        setError(undefined)
      } else {
        setIsError(true)
        setError(result.error)
        setData(undefined)
      }
    } catch (err: any) {
      setIsError(true)
      setError(err.message || 'An unexpected error occurred')
      setData(undefined)
    } finally {
      setIsLoading(false)
      setIsFetching(false)
    }
  }, [apiFunction, isUninitialized])

  // Auto-fetch on mount or when dependencies change
  useEffect(() => {
    if (autoFetch && (isUninitialized || dependencies.length > 0)) {
      fetchData()
    }
  }, [fetchData, autoFetch, isUninitialized, ...dependencies])

  // Calculate success state
  const isSuccess = !isLoading && !isError && data !== undefined

  return {
    data,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    error,
    refetch: fetchData,
    isUninitialized
  }
}

export default useDbDataWithStatus
