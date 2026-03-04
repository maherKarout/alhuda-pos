import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@renderer/hooks/useAppSelector'
import { RootState } from '@renderer/redux-config/store'
import useCasherScreen from './use-casher-screen'
import useGetCustomers from './use-get-customers'
import calcTotalAmount from '../utils/calc-total-amount'
import type { InvoiceData } from '../components/pdf/generate-invoice-pdf'
import { useGetConfigForPosQuery } from '@renderer/app/config'
import { roundToNearest } from '../components/helper/round-to-nearset'

interface InvoiceLabels {
  companyName: string
  companyArabicName: string
  branchName: string
  orderPrefix: string
  discountPrefix: string
  discountSuffix: string
  taxLabel: string
  subtotalLabel: string
  totalLabel: string
  balanceLabel: string
  quantityPrefix: string
  telephonePrefix: string
  itemHeader: string
  quantityHeader: string
  amountHeader: string
  thankYouMessage: string
  visitAgainMessage: string
  customerLabel: string
  userLabel: string
  printDateLabel: string
}

interface UseInvoiceDataReturn {
  invoiceData: InvoiceData
  invoiceLabels: InvoiceLabels
}

function useInvoiceData(): UseInvoiceDataReturn {
  const { t } = useTranslation('translation')
  const pos = useAppSelector((state: RootState) => state?.auth?.account?.pos)
  const account = useAppSelector((state: RootState) => state?.auth?.account)
  // ====================== Get approximation ======================
  const { data: configData } = useGetConfigForPosQuery()
  const approximation = configData?.approximationRatio || 0

  const accountName = account?.fullName ?? account?.username
  // Get order data from casher screen context
  const { orders, currentOrder, ResponseInvoiceDetails, discount } = useCasherScreen()
  console.log('🚀 ~ useInvoiceData ~ discount:', discount)
  const { data: customersData } = useGetCustomers()

  // Get current order data
  const currentOrderData = orders[currentOrder] || {
    items: [],
    customerId: '',
    categoryId: '',
    allBranches: false,
    searchValue: '',
    currentStep: 0
  }

  // Get customer info
  const selectedCustomer = customersData?.data?.find(
    (customer) => customer.customerId === currentOrderData.customerId
  )

  // Calculate totals using the same logic as AddInvoice
  const orderCalculation = calcTotalAmount(currentOrderData.items, {
    taxAmount: 0, // Fixed tax amount
    discountAmount: discount?.amount
  })

  // Get current date and time
  const now = new Date()
  const currentDate = now.toISOString()
  const currentTime = now.toISOString()

  // Generate invoice data
  const invoiceData: InvoiceData = {
    branchPhone: '0935898111', // Default phone number (can be configured)
    orderNumber: String(ResponseInvoiceDetails.current?.billNumber || ''),
    date: currentDate,
    time: currentTime,
    customerName: selectedCustomer?.name || '',
    cashierName: accountName || t('Unknown Cashier') || '',
    items: currentOrderData.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      amount: item.price * item.quantity
    })),
    subtotal: orderCalculation.subtotal,
    discount: orders[currentOrder]?.orderDiscount ?? 0,
    discountPercentage: 0, // Will be updated when discount is implemented
    tax: orderCalculation.taxAmount,
    total: roundToNearest(+orderCalculation.totalAmount, approximation),
    mainTotal: orderCalculation.totalAmount,
    balance: ResponseInvoiceDetails.current?.customerBalance || 0
  }

  // Additional invoice data for labels and company info
  const invoiceLabels: InvoiceLabels = {
    companyName: t('ALHOUDA'),
    companyArabicName: t('الهدى للبياضات'),
    branchName: pos?.location || '',
    orderPrefix: t('Order #'),
    discountPrefix: t('Discount'),
    discountSuffix: '%',
    taxLabel: t('Tax'),
    subtotalLabel: t('subtotal'),
    totalLabel: t('Total'),
    balanceLabel: t('Balance'),
    quantityPrefix: 'x',
    telephonePrefix: t('Tel: '),
    itemHeader: t('item'),
    quantityHeader: t('QTY'),
    amountHeader: t('Amount'),
    thankYouMessage: t('Thank you for shopping with us!'),
    visitAgainMessage: t('Visit again'),
    customerLabel: t('Customer'),
    userLabel: t('User'),
    printDateLabel: t('Print Date')
  }

  return {
    invoiceData,
    invoiceLabels
  }
}

export default useInvoiceData
