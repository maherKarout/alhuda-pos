import { useState, useEffect, useCallback } from 'react'
import { useGetAllCustomersQuery } from '../services/api'
import type { ArgsType } from 'src/types'

// Customer type (matches API and local DB shape)
export type TCustomer = {
  id: string
  customerId: string
  name: string
  phone?: string
  cuMobile?: string
  numberOfInvoices?: number
  totalPurchases?: number
  totalPaymentSyp?: number
  totalPaymentUsd?: number
}

type FetchResult<T> = { success: true; data: T } | { success: false; error: string }

export type GetAllCustomersData = { data: TCustomer[]; totalRecords: number }

interface UseGetAllCustomersResult {
  data: GetAllCustomersData | undefined
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  isSuccess: boolean
  error: string | undefined
  refetch: () => Promise<void>
  isUninitialized: boolean
}

export type UseGetAllCustomersProps = {
  searchValue?: string
  limit?: number
  page?: number
  total?: boolean
}

const toQueryArg = (props: UseGetAllCustomersProps): ArgsType => ({
  page: props.page ?? 0,
  limit: props.limit ?? 10,
  total: props.total ?? true,
  searchValue: props.searchValue
})

export const useGetAllCustomers = (props: UseGetAllCustomersProps): UseGetAllCustomersResult => {
  const isServerOnline = false
  const queryArg = toQueryArg(props)

  const queryResult = useGetAllCustomersQuery(queryArg, {
    skip: !isServerOnline
  })

  const [data, setData] = useState<GetAllCustomersData | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isUninitialized, setIsUninitialized] = useState(true)

  const fetchCustomers = useCallback(async () => {
    if (isServerOnline) return

    try {
      setIsFetching(true)
      setIsError(false)
      setError(undefined)

      if (isUninitialized) {
        setIsLoading(true)
        setIsUninitialized(false)
      }

      const result = (await window.api.getAllCustomersWithPagination(
        props
      )) as FetchResult<GetAllCustomersData>

      if (result.success && result.data) {
        setData(result.data)
        setIsError(false)
        setError(undefined)
      } else {
        setIsError(true)
        setError('error' in result ? result.error : undefined)
        setData(undefined)
      }
    } catch (err: unknown) {
      setIsError(true)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setData(undefined)
    } finally {
      setIsLoading(false)
      setIsFetching(false)
    }
  }, [isServerOnline, isUninitialized, JSON.stringify(props)])

  useEffect(() => {
    if (!isServerOnline) {
      fetchCustomers()
    }
  }, [fetchCustomers, isServerOnline])

  const isOfflineSuccess = !isLoading && !isError && data !== undefined
  console.log('🚀 ~ useGetAllCustomers ~ isOfflineSuccess:', isOfflineSuccess)

  if (isServerOnline) {
    const data = queryResult.data as GetAllCustomersData | undefined
    return {
      data,
      isLoading: queryResult.isLoading,
      isFetching: queryResult.isFetching,
      isError: queryResult.isError,
      isSuccess: queryResult.isSuccess,
      error: queryResult.error as string | undefined,
      refetch: async () => {
        await queryResult.refetch()
      },
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
    refetch: fetchCustomers,
    isUninitialized
  }
}
