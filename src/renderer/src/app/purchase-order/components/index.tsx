import { Box, Grid, Stack, Typography } from '@mui/material'
import Loader from '@renderer/components/loader'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import AuthorizedCheckWrapper, { ComponentPropsType } from 'src/components/authorized-check-wrapper'
import MainCard from 'src/components/cards/Main-card'
import { privilegeFeature } from 'src/shared/privileges'
import AddInvoice from '../components/add-invoice'
import CategorySection from '../components/category-section'
import Product from '../components/product'
import ProductSearch from '../components/product-search'
import ProductSkeleton from '../components/product-skeleton'
import ReaderSerialNumberForPurchaseOrder from '../components/reader-serial-number-for-purchase-order'
import {
  PurchaseOrderContextType,
  PurchaseOrderProvider,
  initPurchaseOrderState
} from '../hooks/use-purchase-order'
import { useGetAllProductsBranchQuery, useGetPurchaseOrderByIdQuery } from '../services/api'

function PurchaseOrderForAdminAndCasher({ forAdmin, isJustForReview }: { forAdmin?: boolean, isJustForReview?: boolean }) {
  const { id } = useParams()
  const isAdmin = forAdmin ?? false as boolean
  const {
    data: purchaseOrderData,
    isLoading: isLoadingPurchaseOrder,
    isSuccess: isSuccessPurchaseOrder
  } = useGetPurchaseOrderByIdQuery({ id: id ?? '', isAdmin }, { skip: !id })

  const { t } = useTranslation('translation')
  const intiValue = structuredClone(initPurchaseOrderState)
  delete intiValue.setOrders

  const [orders, setOrders] = useState<PurchaseOrderContextType['orders']>(intiValue.orders)

  useEffect(() => {
    if (isSuccessPurchaseOrder && purchaseOrderData) {
      setOrders((prev) => {
        const newOrders = [...prev]
        newOrders[0] = {
          ...newOrders[0],
          customerName: purchaseOrderData.customer ?? '',
          branch: purchaseOrderData.branch ?? '', //This for admin purchase order to know from where this order 
          status: purchaseOrderData.status ?? undefined,
          billNumber: purchaseOrderData?.billNumber,
          items: purchaseOrderData.items.map((item) => {
            return {
              id: item.id,
              code: item.code,
              name: item.name || '',
              price: item.price || 0,
              quantity: item.quantity,
              individualPrice: item.quantity > 0 ? (item.price || 0) / item.quantity : 0,
              openPrice: false,
              note: item.itemNote
            }
          })
        }
        return newOrders
      })
    }
  }, [isSuccessPurchaseOrder, purchaseOrderData])

  const [allBranches, setAllBranches] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [currentOrder, setCurrentOrder] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('')
  const invoiceIdRef = useRef<string | null>(null)

  const {
    data: productsData,
    isFetching: isFetchingProducts,
    isError,
    error
  } = useGetAllProductsBranchQuery({
    searchValue: searchText,
    allPos: allBranches,
    category: selectedCategory
  })

  const products = productsData?.data
  const isStepOne = orders[currentOrder]?.currentStep === 0
  // Handle search input change - use the pagination hook's search
  const handleSearchChange = (searchTerm: string) => {
    setSearchText(searchTerm)
  }

  // Handle branch filter change
  const handleBranchFilterChange = (allBranches: boolean) => {
    setAllBranches(allBranches)
  }

  if (isLoadingPurchaseOrder) return <Loader />

  return (
    <PurchaseOrderProvider.Provider
      value={{
        orders: orders,
        setOrders: setOrders,
        currentOrder: currentOrder,
        setCurrentOrder: setCurrentOrder,
        selectedCategory: selectedCategory,
        setSelectedCategory: setSelectedCategory,
        allBranches: allBranches
        // invoiceId: invoiceIdRef
      }}
    >

      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)', position: 'relative' }}
        >
          {/* <OverlayLayer isVisible={true} onClick={() => setOpenPopupPayLater(false)} /> */}
          {isStepOne && (
            <MainCard>
              <CategorySection />
              <ProductSearch
                onSearchChange={handleSearchChange}
                onBranchFilterChange={handleBranchFilterChange}
                allBranches={allBranches}
              />

              {/* Products Grid */}
              <Stack gap={2} flexWrap={'wrap'} flexDirection={'row'}>
                {isFetchingProducts ? (
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
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <ProductSkeleton key={idx} />
                    ))}
                  </Box>
                ) : isError ? (
                  <Typography color="error" sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                    {t('Error loading products')}: {`${error}`}
                  </Typography>
                ) : products?.length === 0 ? (
                  <Typography sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                    {t('No products found')}
                  </Typography>
                ) : (
                  products?.map((product) => <Product key={product.id} product={product} />)
                )}
              </Stack>
            </MainCard>
          )}
          {/* {orders[currentOrder]?.currentStep === 2 && <InvoicePdf />} */}
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          {orders[currentOrder]?.currentStep === 0 && <AddInvoice forAdmin={forAdmin} isJustForReview={isJustForReview} />}

          {isStepOne && <ReaderSerialNumberForPurchaseOrder />}
        </Grid>
      </Grid>
    </PurchaseOrderProvider.Provider>
  )
}

export default PurchaseOrderForAdminAndCasher
