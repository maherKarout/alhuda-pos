import { Box, LinearProgress, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useIntersectionObserver } from '@renderer/hooks/use-intersection-observer'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Product from '../components/product'
import useCasherScreen from '../hooks/use-casher-screen'
import { useGetAllProductsWithPaginationQuery } from '../services/api'
import ProductSkeleton from './product-skeleton'
import { useGetAllProducts } from '../hooks/use-get-all-products'

const limitNumber = 16
function Products({ searchText }: { searchText: string }) {

  const { allBranches, selectedCategory } = useCasherScreen()
  const [limit, setLimit] = useState(limitNumber)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const totalRecordsRef = useRef(0)

  const {
    data,
    isFetching: isFetchingProducts,
    isError,
    error,
    isSuccess
    // } = useGetAllProductsWithPaginationQuery({
  } = useGetAllProducts({
    searchValue: searchText,
    allPos: allBranches,
    category: selectedCategory,
    limit: limit,
    page: 0,
    total: true
  })

  useEffect(() => {
    if (isSuccess) {
      totalRecordsRef.current = data?.totalRecords ?? 0
    }
  }, [data?.totalRecords])
  const { t } = useTranslation('translation')
  const { ref, entry, isIntersecting } = useIntersectionObserver({
    root: null,
    rootMargin: '0px',
    threshold: 0
  })

  // Load more when intersection occurs
  useEffect(() => {
    if (limit >= totalRecordsRef.current) {
      setIsLoadingMore(false)
    }
    if (isIntersecting && limit <= totalRecordsRef.current) {
      setIsLoadingMore(true)
      setLimit((prev) => prev + limitNumber)
    }
  }, [isIntersecting])

  return (
    <div>
      {isFetchingProducts && (
        <LinearProgress sx={{ marginBottom: '10px', borderRadius: '10px', overflow: 'hidden' }} />
      )}
      <Stack gap={2} flexWrap={'wrap'} flexDirection={'row'}>
        {/* Initial loading - show when fetching first page */}
        {isFetchingProducts && limit === 5 ? (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              gap: 2,
              width: '100%',
              py: 4
            }}
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <ProductSkeleton key={`initial-${idx}`} />
            ))}
          </Box>
        ) : isError ? (
          <Typography color="error" sx={{ width: '100%', textAlign: 'center', py: 4 }}>
            {t('Error loading products')}: {`${error}`}
          </Typography>
        ) : data?.data?.length === 0 ? (
          <Typography sx={{ width: '100%', textAlign: 'center', py: 4 }}>
            {t('No products found')}
          </Typography>
        ) : (
          <>
            {/* Display all products */}
            {data?.data?.map((product) => (
              <Product key={product.id} product={product} />
            ))}

            {/* Loading more indicator - show when loading additional pages */}
            {isLoadingMore && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  gap: 2,
                  width: '100%',
                  py: 2
                }}
              >
                {Array.from({ length: 8 }).map((_, idx) => (
                  <ProductSkeleton key={`loading-more-${idx}`} />
                ))}
              </Box>
            )}

            {/* End of data indicator */}
            {data?.data?.length && data?.data?.length >= totalRecordsRef.current && (
              <Typography
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  py: 2,
                  color: 'text.secondary',
                  fontSize: '0.875rem'
                }}
              >
                {t('No more products to load')}
              </Typography>
            )}
          </>
        )}

        {/* Intersection observer trigger - only show when there's more data to load */}
        {/* {hasMore && !isLoadingMore && ( */}
        <div ref={ref} style={{ height: '20px', marginTop: '150px', width: '100%' }}>
          {isIntersecting}-
        </div>
        {/* )} */}
      </Stack>
    </div>
  )
}

export default Products
