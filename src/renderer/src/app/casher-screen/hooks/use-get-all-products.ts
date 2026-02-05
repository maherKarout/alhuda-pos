import { is } from '@electron-toolkit/utils'
import { useAppSelector } from '@renderer/hooks/useAppSelector'
import { useState, useEffect, useCallback } from 'react'
import { useGetAllProductsWithPaginationQuery } from '../services/api'

// TProduct type definition
export type TProduct = {
  id: string
  name: string
  code: string
  individualPrice: number
  wholesalePrice: number
  category: string
  quantity: number
  branchName?: string
  openPrice: boolean
}

type FetchResult<T> = { success: true; data: T } | { success: false; error: string }

// Shape returned by main process
export type GetAllProductsData = { data: TProduct[]; totalRecords: number }

// RTK Query-like return type
interface UseGetAllProductsResult {
  data: GetAllProductsData | undefined
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  isSuccess: boolean
  error: string | undefined
  refetch: () => Promise<void>
  isUninitialized: boolean
}
type Props = {
  searchValue: string
  allPos: boolean
  category: string
  limit: number
  page: number
  total: boolean
}

export const useGetAllProducts = (props: Props): UseGetAllProductsResult | any => {
  // const { isServerOnline } = useAppSelector((state) => state.globalConfig)
  const isServerOnline = false

  // Always call RTK Query hook (it will be skipped when offline)
  const queryResult = useGetAllProductsWithPaginationQuery(props, {
    skip: !isServerOnline
  })

  const [data, setData] = useState<GetAllProductsData | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isUninitialized, setIsUninitialized] = useState(true)
  //  alert("props: "+JSON.stringify(props))
  const fetchProducts = useCallback(async () => {
    // Only run local (offline) fetch when server is offline
    if (isServerOnline) return

    try {
      setIsFetching(true)
      setIsError(false)
      setError(undefined)

      if (isUninitialized) {
        setIsLoading(true)
        setIsUninitialized(false)
      }

      const result = (await window.api.getAllProductsWithPagination(
        props
      )) as FetchResult<GetAllProductsData>
      console.log('🚀 ~ fetchProducts ~ result:', result)
      if (result.success && result.data) {
        setData(result.data)
        setIsError(false)
        setError(undefined)
      } else {
        setIsError(true)
        setError('error' in result ? result.error : undefined)
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
  }, [isServerOnline, isUninitialized, JSON.stringify(props)])

  // Auto-fetch only when offline
  useEffect(() => {
    if (!isServerOnline) {
      fetchProducts()
    }
  }, [fetchProducts, isServerOnline])

  const isOfflineSuccess = !isLoading && !isError && data !== undefined

  // Choose which source to expose based on server status
  if (isServerOnline) {
    return {
      data: queryResult.data,
      isLoading: queryResult.isLoading,
      isFetching: queryResult.isFetching,
      isError: queryResult.isError,
      isSuccess: queryResult.isSuccess,
      error: queryResult.error as string | undefined,
      refetch: queryResult.refetch,
      isUninitialized: queryResult.isUninitialized
    }
  }

  return {
    data,
    isLoading,
    isFetching,
    isError,
    isSuccess: isOfflineSuccess,
    error,
    refetch: fetchProducts,
    isUninitialized
  }
}
