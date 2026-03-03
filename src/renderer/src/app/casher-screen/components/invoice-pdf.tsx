import React from 'react'
import { Box, Typography, Divider, Table, TableBody, TableRow, TableCell } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '@renderer/redux-config/store'
import { useAppSelector } from '@renderer/hooks/useAppSelector'
import useCasherScreen from '../hooks/use-casher-screen'
import calcTotalAmount from '../utils/calc-total-amount'
import useGetCustomers from '../hooks/use-get-customers'
import { useTranslation } from 'react-i18next'
import { priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'

interface InvoiceItem {
  name: string
  quantity: number
  amount: number
}

const InvoicePdf = () => {
  const { t } = useTranslation('translation')
  const pos = useAppSelector((state: RootState) => state?.auth?.account?.pos)
  const account = useAppSelector((state: RootState) => state?.auth?.account)
  const accountName = account?.fullName ?? account?.username

  // Get order data from casher screen context
  const { orders, currentOrder, ResponseInvoiceDetails, discount } = useCasherScreen()
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

  // Invoice data object containing all needed keys
  const invoiceData = {
    // Company Information
    companyName: t('ALHOUDA'),
    companyArabicName: t('الهدى للبياضات'),
    branchName: pos?.location || '',
    branchPhone: '09765678920', // Default phone number (can be configured)

    // Order Information
    orderNumber: ResponseInvoiceDetails.current?.billNumber,
    orderDate: currentDate,
    orderTime: currentTime,
    customerName: selectedCustomer?.name || '',
    cashierName: accountName || t('Unknown Cashier'),

    // Items - map from current order items to invoice format
    items: currentOrderData.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      amount: item.price * item.quantity
    })),

    // Financial Information from calculated totals
    subtotal: orderCalculation.subtotal,
    // discount: orderCalculation.discountAmount,
    discount: orders[currentOrder]?.orderDiscount ?? 0,
    discountPercentage: 0, // Will be updated when discount is implemented
    tax: orderCalculation.taxAmount,
    total: orderCalculation.totalAmount,
    balance: ResponseInvoiceDetails.current?.customerBalance, // This would be calculated based on payment received

    // UI Settings
    divider: '- ',
    dividerRepeat: 15,
    width: '300px',
    padding: '20px',
    fontFamily: 'monospace',
    defaultFontSize: '12px',

    // Labels and Text
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
    orderDiscountLabel: t('Order Discount'),
    printDateLabel: t('Print Date')
  }
  const formatAmount = (amount: number) => {
    return amount.toFixed(2)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    const time = new Date(timeString)
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Don't render invoice if no items in the current order
  if (currentOrderData.items.length === 0) {
    return (
      <Box
        sx={{
          width: invoiceData.width,
          padding: invoiceData.padding,
          textAlign: 'center',
          color: 'text.secondary',
          border: '1px dashed #ddd',
          borderRadius: 1,
          margin: '0 auto',
          backgroundColor: 'white'
        }}
      >
        <Typography variant="body2" sx={{ color: 'black' }}>
          {t('No items in order - Invoice will appear here when items are added')}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '300px', margin: '0 auto' }}>
      <Box
        style={{ width: '80mm', margin: '0 auto' }}
        sx={{
          // width: invoiceData.width,
          width: '100%',
          padding: invoiceData.padding,
          fontFamily: invoiceData.fontFamily,
          fontSize: invoiceData.defaultFontSize,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          margin: '0 auto',
          borderRadius: '10px',
          color: 'black'
        }}
        id="invoice-pdf"
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', fontSize: '16px', mb: 1, color: 'black' }}
          >
            {invoiceData.companyName}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: '14px', fontWeight: 'bold', mb: 1, color: 'black' }}
          >
            {invoiceData.companyArabicName}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '11px', mb: 1, color: 'black' }}>
            {invoiceData.branchName}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '11px', color: 'black' }}>
            {invoiceData.telephonePrefix}
            {invoiceData.branchPhone}
          </Typography>
        </Box>

        {/* Divider */}
        <Typography sx={{ textAlign: 'center', fontSize: '10px', mb: 2, color: 'black' }}>
          {invoiceData.divider.repeat(invoiceData.dividerRepeat)}
        </Typography>

        {/* Order Info */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ fontSize: '12px', mb: 1, color: 'black' }}>
            {invoiceData.orderPrefix}
            {invoiceData.orderNumber}
          </Typography>
          {invoiceData.customerName && (
            <Typography variant="body2" sx={{ fontSize: '11px', mb: 0.5, color: 'black' }}>
              {invoiceData.customerLabel}: {invoiceData.customerName}
            </Typography>
          )}
          {invoiceData.cashierName && (
            <Typography variant="body2" sx={{ fontSize: '11px', mb: 0.5, color: 'black' }}>
              {invoiceData.userLabel}: {invoiceData.cashierName}
            </Typography>
          )}
          {invoiceData.discount > 0 && (
            <Typography variant="body2" sx={{ fontSize: '11px', mb: 0.5, color: 'black' }}>
              {invoiceData.orderDiscountLabel}:{' '}
              {priceToDecimalPrice(formatAmount(invoiceData.discount))}
            </Typography>
          )}
          <Typography variant="body2" sx={{ fontSize: '11px', mb: 0.5, color: 'black' }}>
            {formatDate(invoiceData.orderDate)} • {formatTime(invoiceData.orderTime)}
          </Typography>
        </Box>

        {/* Items Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 2 }}>
          <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold', color: 'black' }}>
            {invoiceData.itemHeader}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold', color: 'black' }}>
            {invoiceData.quantityHeader}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold', color: 'black' }}>
            {invoiceData.amountHeader}
          </Typography>
        </Box>

        {/* Items List */}
        <Box sx={{ mb: 2 }}>
          {invoiceData.items.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontSize: '11px', flex: 1, color: 'black' }}>
                {item.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: '11px', width: '30px', textAlign: 'center', color: 'black' }}
              >
                {invoiceData.quantityPrefix}
                {item.quantity}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: '11px', width: '50px', textAlign: 'right', color: 'black' }}
              >
                {priceToDecimalPrice(formatAmount(item.amount))}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Divider */}
        <Typography sx={{ textAlign: 'center', fontSize: '10px', mb: 2, color: 'black' }}>
          {invoiceData.divider.repeat(invoiceData.dividerRepeat)}
        </Typography>

        {/* Totals */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontSize: '11px', color: 'black' }}>
              {invoiceData.subtotalLabel}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '11px', color: 'black' }}>
              {priceToDecimalPrice(formatAmount(invoiceData.subtotal))}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontSize: '11px', color: 'black' }}>
              {invoiceData.discountPrefix}{' '}
              {invoiceData.discountPercentage > 0
                ? `(-${invoiceData.discountPercentage}${invoiceData.discountSuffix})`
                : ''}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '11px', color: 'black' }}>
              {priceToDecimalPrice(formatAmount(invoiceData.discount))}
            </Typography>
          </Box>

          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontSize: '11px', color: 'black' }}>
            {invoiceData.taxLabel}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '11px', color: 'black' }}>
            {formatAmount(invoiceData.tax)}
          </Typography>
        </Box> */}
        </Box>

        {/* Divider */}
        <Typography sx={{ textAlign: 'center', fontSize: '10px', mb: 1, color: 'black' }}>
          {invoiceData.divider.repeat(invoiceData.dividerRepeat)}
        </Typography>

        {/* Final Total */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              variant="body1"
              sx={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}
            >
              {invoiceData.totalLabel}
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}
            >
              {priceToDecimalPrice(formatAmount(invoiceData.total - invoiceData.discount))}
            </Typography>
          </Box>

          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              variant="body1"
              sx={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}
            >
              {invoiceData.balanceLabel}
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}
            >
              {priceToDecimalPrice(formatAmount(invoiceData.balance || 0))}
            </Typography>
          </Box> */}
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ fontSize: '11px', mb: 0.5, color: 'black' }}>
            {invoiceData.thankYouMessage}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '11px', color: 'black' }}>
            {invoiceData.visitAgainMessage}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '10px', mt: 0.5, color: 'black' }}>
            {invoiceData.printDateLabel}: {formatDate(invoiceData.orderDate)}{' '}
            {formatTime(invoiceData.orderTime)}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default InvoicePdf
