import { Button, Grid, Typography } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import AuthorizedCheckWrapper, { ComponentPropsType } from 'src/components/authorized-check-wrapper'
import MainCard from 'src/components/cards/Main-card'
import { privilegeFeature } from 'src/shared/privileges'
import CategorySection from '../components/category-section'
import OrderTabs from '../components/order-tabs'
import PaymentSuccessful from '../components/payment-successful'
import PricingAndCurrency from '../components/pricing-and-currency'
import ProductSearch from '../components/product-search'
import ReaderSerialNumberForCasher from '../components/reader-serial-number-for-casher'
import {
  CasherProvider,
  CasherScreenContextType,
  initCacherState,
  invoiceDetails
} from '../hooks/use-casher-screen'
// import useGetDBFunctions from '../hooks/use-get-db-functions'
import { useGetInvoicesByIdQuery } from '@renderer/app/invoices'
import { useParams } from 'react-router-dom'
import InvoicePdf from '../components/invoice-pdf'
import Products from '../components/products'
import { DtoOrderById } from '../utils/dto-order-by-id'
import Loader from '@renderer/components/loader'
import { useTranslation } from 'react-i18next'
import AddInvoice from '../components/add-invoice/add-invoice'

function CasherScreen({ canEdit }: ComponentPropsType) {
  const { customer_id_order } = useParams()
  const { t } = useTranslation('translation')
  const isUpdateCustomerOrder =
    customer_id_order !== 'add-new-order' &&
    customer_id_order !== '' &&
    customer_id_order !== undefined

  const { data: customerOrderData, isLoading: isLoadingCustomerOrder } = useGetInvoicesByIdQuery(
    customer_id_order ?? '',
    {
      skip: !isUpdateCustomerOrder
    }
  )

  const intiValue = structuredClone(initCacherState)
  delete intiValue.setOrders

  const [orders, setOrders] = useState<CasherScreenContextType['orders']>(intiValue.orders)
  console.log('🚀 ~ CasherScreen ~ orders:', orders)

  const [allBranches, setAllBranches] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [currentOrder, setCurrentOrder] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('')

  const invoiceIdRef = useRef<invoiceDetails | null>(null)
  const [discount, setDiscount] = useState<CasherScreenContextType['discount']>(intiValue.discount)

  // ====================== Update Customer Order Data by id ======================
  useEffect(() => {
    if (customerOrderData) {
      setOrders((prev) => {
        const newOrders = [...prev]
        newOrders[0] = DtoOrderById(customerOrderData)
        return newOrders
      })
    }
  }, [isLoadingCustomerOrder])

  // const products = productsData?.data
  const isStepOne = orders[currentOrder]?.currentStep === 0
  // Handle search input change - use the pagination hook's search
  const handleSearchChange = useCallback((searchTerm: string) => {
    setSearchText(searchTerm)
  }, [])

  // Handle branch filter change
  const handleBranchFilterChange = useCallback((allBranches: boolean) => {
    setAllBranches(allBranches)
  }, [])
  if (isLoadingCustomerOrder) return <Loader />
  return (
    <CasherProvider.Provider
      value={{
        orders: orders,
        setOrders: setOrders,
        currentOrder: currentOrder,
        setCurrentOrder: setCurrentOrder,
        selectedCategory: selectedCategory,
        setSelectedCategory: setSelectedCategory,
        allBranches: allBranches,
        ResponseInvoiceDetails: invoiceIdRef,
        discount: discount,
        setDiscount: setDiscount
      }}
    >
      {/* <Button onClick={() => window.electronLocalStorage.testInvokeToken()}>
        Test Invoke Token
      </Button> */}
      {/* <Button onClick={() => window.api.createLocalOrderTest()}>
        Test 
      </Button> */}
      {isUpdateCustomerOrder && (
        <Typography variant="h3" sx={{ marginBottom: '10px' }}>
          {t('edit_customer_order')} {customerOrderData?.customerName}
        </Typography>
      )}

      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)', position: 'relative' }}
        >
          {isStepOne && (
            <MainCard>
              <CategorySection />
              <ProductSearch
                onSearchChange={handleSearchChange}
                onBranchFilterChange={handleBranchFilterChange}
                allBranches={allBranches}
              />
              <Products searchText={searchText} />
            </MainCard>
          )}
          {orders[currentOrder]?.currentStep === 2 && <InvoicePdf />}
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <OrderTabs />
          {orders[currentOrder]?.currentStep === 0 && <AddInvoice />}
          {orders[currentOrder]?.currentStep === 1 && <PricingAndCurrency />}
          {orders[currentOrder]?.currentStep === 2 && (
            <PaymentSuccessful
              onPrintReceipt={() =>
                // @ts-ignore
                toPDF().then((pdfInstance) => {
                  // 1. Check if the instance has the output method (common for jsPDF)
                  if (pdfInstance && typeof pdfInstance.output === 'function') {
                    // 2. Call .output('blob') to get the final PDF data as a Blob
                    const pdfBlob = pdfInstance.output('blob')

                    // 3. Now you have a valid Blob to pass to your print function
                    // printPdfBlob(pdfBlob) // TODO: This function for print pdf on the web
                    window.printPdfFile.printPdfFile(URL.createObjectURL(pdfBlob))
                  }
                })
              }
            />
          )}
          {isStepOne && <ReaderSerialNumberForCasher />}
        </Grid>
      </Grid>
    </CasherProvider.Provider>
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.order,
  type: 'view'
})(CasherScreen)
