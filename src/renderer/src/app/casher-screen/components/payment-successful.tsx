import React from 'react'
import { Box, Button, Card, CardContent, Stack, Typography, Avatar } from '@mui/material'
import { CheckCircle as CheckCircleIcon, Print as PrintIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import useCasherScreen, { initCacherState } from '../hooks/use-casher-screen'
import getTotalAmountForOrder from '../utils/calc-total-amount'
// import SavePdf from './pdf/save-pdf'
import { PDFDownloadLink } from '@react-pdf/renderer'
import InvoicePdfFile from './pdf/generate-invoice-pdf'
import DownloadPdfInvoice from './pdf/download-pdf'
import { useNavigate } from 'react-router'
import { routeName } from '@renderer/shared/routeName'

interface PaymentSuccessfulProps {
  onNewOrder?: () => void
  onPrintReceipt?: () => void
}

const PaymentSuccessful: React.FC<PaymentSuccessfulProps> = ({ onNewOrder, onPrintReceipt }) => {
  const navigate = useNavigate()
  const { t } = useTranslation('translation')
  const { orders, setOrders, currentOrder, discount } = useCasherScreen()

  // Get total amount using the reusable calculation function
  const items = orders[currentOrder]?.items || []
  const orderCalculation = getTotalAmountForOrder(items, {
    taxAmount: 0, // Auto tax (fixed amount)
    discountAmount: discount?.amount,
    discountType: discount?.type
  })
  const { totalAmount } = orderCalculation

  const handleNewOrder = () => {

    if (!setOrders || currentOrder === undefined) return

    // Reset the current order to step 0 and clear items
    setOrders((prev) => {
      const newOrders = [...prev]
      newOrders[currentOrder] = {
        ...newOrders[currentOrder],
        ...initCacherState.orders[0]
      }
      return newOrders
    })

    if (onNewOrder) {   
      onNewOrder()
    }
    navigate(routeName.CASHER_SCREEN + 'add-new-order')
  }

  const handlePrintReceipt = () => {
    // Implement print functionality here
    if (onPrintReceipt) {
      onPrintReceipt()
    }
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, padding: 4 }}>
        <Stack
          spacing={4}
          alignItems="center"
          justifyContent="center"
          sx={{ height: '100%', textAlign: 'center' }}
        >
          {/* Success Icon */}
          <Box>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                backgroundColor: '#E8F5E8',
                margin: '0 auto',
                mb: 2
              }}
            >
              <CheckCircleIcon
                sx={{
                  fontSize: 50,
                  color: '#4CAF50'
                }}
              />
            </Avatar>
          </Box>

          {/* Success Message */}
          <Box>
            <Typography variant="h4" fontWeight="bold" color="#4CAF50" sx={{ mb: 2 }}>
              {t('Payment Successful')}
            </Typography>
            <Typography variant="h5" fontWeight="500" color="text.secondary">
              SYP {totalAmount.toLocaleString()}
            </Typography>
          </Box>

          {/* Print Receipt Button */}
          {/* <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrintReceipt}
              fullWidth
              sx={{
                py: 2,
                borderColor: '#E0E0E0',
                color: 'text.primary',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                '&:hover': {
                  borderColor: '#BDBDBD',
                  backgroundColor: '#F5F5F5'
                }
              }}
            >
              {t('Print Full Receipt')}
            </Button>
          </Box> */}
          <DownloadPdfInvoice />

          {/* New Order Button */}
          <Box sx={{ width: '100%', maxWidth: 400, mt: 'auto' }}>
            <Button
              variant="contained"
              onClick={handleNewOrder}
              fullWidth
              sx={{
                py: 2,
                backgroundColor: '#4CAF50',
                color: 'white',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '18px',
                '&:hover': {
                  backgroundColor: '#45a049'
                }
              }}
            >
              {t('New Order')}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default PaymentSuccessful
