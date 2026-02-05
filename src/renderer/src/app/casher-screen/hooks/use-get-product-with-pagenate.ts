// import { useState, useEffect, useCallback } from 'react'
// import { useTranslation } from 'react-i18next'

// // TProduct type definition
// export type TProduct = {
//   id: string
//   name: string
//   code: string
//   individualPrice: number
//   wholesalePrice: number
//   category: string
// }

// // Pagination result type
// export interface PaginationResult<T> {
//   data: T[]
//   total: number
//   page: number
//   limit: number
//   totalPages: number
// }

// type FetchResult<T> = { success: true; data: T } | { success: false; error: string }

// // Pagination options (matching backend)
// export interface PaginationOptions {
//   page?: number
//   limit?: number
//   search?: string
//   category?: string
// }

// // Hook return type
// interface UseGetProductsWithPaginationResult {
//   data: TProduct[] | undefined
//   total: number
//   page: number
//   limit: number
//   totalPages: number
//   isLoading: boolean
//   isFetching: boolean
//   isError: boolean
//   isSuccess: boolean
//   error: string | undefined
//   isUninitialized: boolean

//   // Pagination controls
//   nextPage: () => void
//   prevPage: () => void
//   goToPage: (page: number) => void
//   setLimit: (limit: number) => void
//   setSearch: (search: string) => void
//   setCategory: (category: string | undefined) => void

//   // Manual refetch
//   refetch: () => Promise<void>

//   // Reset to defaults
//   reset: () => void
// }

// export const useGetProductsWithPagination = (
//   initialOptions: PaginationOptions = {}
// ): UseGetProductsWithPaginationResult => {
//   const { t } = useTranslation('translation')
//   // Data state
//   const [data, setData] = useState<TProduct[] | undefined>(undefined)
//   const [total, setTotal] = useState(0)
//   const [totalPages, setTotalPages] = useState(0)

//   // Loading states
//   const [isLoading, setIsLoading] = useState(false)
//   const [isFetching, setIsFetching] = useState(false)
//   const [isError, setIsError] = useState(false)
//   const [error, setError] = useState<string | undefined>(undefined)
//   const [isUninitialized, setIsUninitialized] = useState(true)

//   // Pagination options state
//   const [options, setOptions] = useState<Required<PaginationOptions>>({
//     page: initialOptions.page || 1,
//     limit: initialOptions.limit || 10,
//     search: initialOptions.search || '',
//     category: initialOptions.category || ''
//   })

//   // Fetch products function
//   const fetchProducts = useCallback(async () => {
//     try {
//       setIsFetching(true)
//       setIsError(false)
//       setError(undefined)

//       if (isUninitialized) {
//         setIsLoading(true)
//         setIsUninitialized(false)
//       }

//       // Prepare API call options
//       const apiOptions = {
//         ...options,
//         category: options.category || undefined // Convert empty string to undefined
//       }

//       const result: FetchResult<PaginationResult<TProduct>> =
//         await window.api.getProductsWithPagination(apiOptions)

//       if (result.success) {
//         setData(result.data.data)
//         setTotal(result.data.total)
//         setTotalPages(result.data.totalPages)
//         setIsError(false)
//         setError(undefined)
//       } else {
//         setIsError(true)
//         setError(result.error)
//         setData(undefined)
//         setTotal(0)
//         setTotalPages(0)
//       }
//     } catch (err: any) {
//       setIsError(true)
//       setError(err.message || t('An unexpected error occurred'))
//       setData(undefined)
//       setTotal(0)
//       setTotalPages(0)
//     } finally {
//       setIsLoading(false)
//       setIsFetching(false)
//     }
//   }, [options, isUninitialized])

//   // Auto-fetch on mount and when options change
//   useEffect(() => {
//     fetchProducts()
//   }, [fetchProducts])

//   // Pagination control functions
//   const nextPage = useCallback(() => {
//     setOptions((prev) => ({
//       ...prev,
//       page: Math.min(prev.page + 1, totalPages)
//     }))
//   }, [totalPages])

//   const prevPage = useCallback(() => {
//     setOptions((prev) => ({
//       ...prev,
//       page: Math.max(prev.page - 1, 1)
//     }))
//   }, [])

//   const goToPage = useCallback(
//     (page: number) => {
//       setOptions((prev) => ({
//         ...prev,
//         page: Math.max(1, Math.min(page, totalPages))
//       }))
//     },
//     [totalPages]
//   )

//   const setLimit = useCallback((limit: number) => {
//     setOptions((prev) => ({
//       ...prev,
//       limit: Math.max(1, limit),
//       page: 1 // Reset to first page when changing limit
//     }))
//   }, [])

//   const setSearch = useCallback((search: string) => {
//     setOptions((prev) => ({
//       ...prev,
//       search,
//       page: 1 // Reset to first page when searching
//     }))
//   }, [])

//   const setCategory = useCallback((category: string | undefined) => {
//     setOptions((prev) => ({
//       ...prev,
//       category: category || '',
//       page: 1 // Reset to first page when filtering
//     }))
//   }, [])

//   const reset = useCallback(() => {
//     setOptions({
//       page: 1,
//       limit: 10,
//       search: '',
//       category: ''
//     })
//   }, [])

//   const isSuccess = !isLoading && !isError && data !== undefined

//   return {
//     // Data
//     data,
//     total,
//     page: options.page,
//     limit: options.limit,
//     totalPages,

//     // States
//     isLoading,
//     isFetching,
//     isError,
//     isSuccess,
//     error,
//     isUninitialized,

//     // Controls
//     nextPage,
//     prevPage,
//     goToPage,
//     setLimit,
//     setSearch,
//     setCategory,
//     refetch: fetchProducts,
//     reset
//   }
// }
