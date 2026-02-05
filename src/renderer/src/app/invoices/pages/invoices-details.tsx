import { Print } from '@mui/icons-material'
import {
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography
} from '@mui/material'
import MainCard from '@renderer/components/cards/Main-card'
import ErrorAlert from '@renderer/components/error/error-alert'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import AuthorizedCheckWrapper, { ComponentPropsType } from 'src/components/authorized-check-wrapper'
import { privilegeFeature } from 'src/shared/privileges'
import { useGetInvoicesByIdQuery } from '../services/api'

function InvoicesDetails({ canEdit }: ComponentPropsType) {
  const { t } = useTranslation('translation')
  const { id } = useParams()
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)

  const {
    data: invoicesData,
    isLoading,
    isError
  } = useGetInvoicesByIdQuery(id ?? '', {
    skip: !id
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} SYP`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isError || !invoicesData) {
    return <ErrorAlert />
  }
  const differencePurchases = invoicesData.total - invoicesData.totalPayments
  return (
    <MainCard title={t('Invoices Details')} isLoading={isLoading} isError={isError}>
      <CardContent sx={{ p: 0 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {t("bill_number")} #{invoicesData?.billNumber}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {t('Order Date')} {formatDate(invoicesData.orderDate)}
              </Typography>
              <Chip
                label={invoicesData.orderStatus}
                color={invoicesData.orderStatus === 'paid' ? 'success' : 'default'}
                variant="outlined"
              />
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={() => { }}
          >
            {t('Print Receipt')}
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />

        {/* Info Section */}
        <Stack
          direction="row"
          spacing={4}
          divider={<Divider orientation="vertical" flexItem />}
          marginBottom="1rem"
        >
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="caption" color="text.secondary">
              {t('Branch Name')}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {invoicesData.pos}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="caption">{t('Customer Name')}</Typography>
            <Typography variant="body1" color="primary" fontWeight="bold">
              {invoicesData.customerName}
            </Typography>
          </Box>
          {/* total payments */}
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="caption">{t('total_payments')}</Typography>
            <Typography
              variant="body1"
              fontWeight="bold"
              color={Number(invoicesData.totalPayments ?? 0) > 0 ? 'success.main' : 'error.main'}
            >
              {invoicesData.totalPayments ? invoicesData.totalPayments.toLocaleString() : 0} SYP
            </Typography>
          </Box>
          {/* total payments */}
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="caption">{t('difference_purchases_payments')}</Typography>
            <Typography
              variant="body1"
              fontWeight="bold"
              color={Number(differencePurchases ?? 0) > 0 ? 'warning.main' : 'error.main'}
            >
              {differencePurchases ? differencePurchases.toLocaleString() : 0} SYP
            </Typography>
          </Box>
        </Stack>

        {/* <Divider sx={{ my: 3 }} /> */}

        {/* Tabs Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={t('Products')} />
            <Tab label={t('Payments')} />
          </Tabs>
        </Box>

        {/* Products Tab */}
        {tabValue === 0 && (
          <Box>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell>{t('Product Name')}</TableCell>
                    <TableCell align="center">{t('Quantity')}</TableCell>
                    <TableCell align="center">{t('Unit Price')}</TableCell>
                    <TableCell align="center">{t('Disc')}</TableCell>
                    <TableCell align="center">{t('Subtotal')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoicesData.products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell align="center">{product.quantity}</TableCell>
                      <TableCell align="center">{formatPrice(product.unitPrice)}</TableCell>
                      <TableCell align="center">{product?.disc?.toFixed(2)}</TableCell>
                      <TableCell align="center">{formatPrice(product?.subTotal ?? 0)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Total Price Section */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Box sx={{ minWidth: 300 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {t('Total Price')}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('Subtotal')}
                  </Typography>
                  <Typography variant="body2">{formatPrice(invoicesData.subTotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('Tax')}
                  </Typography>
                  <Typography variant="body2">{invoicesData.tax.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('Disc')}
                  </Typography>
                  <Typography variant="body2">{invoicesData.disc.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {t('Total')}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {formatPrice(invoicesData.total)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* Payments Tab */}
        {tabValue === 1 && (
          <Box>
            {invoicesData.payments && invoicesData.payments.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell>{t('Date')}</TableCell>
                      <TableCell align="center">{t('Payment Method')}</TableCell>
                      <TableCell align="center">{t('Amount (SYP)')}</TableCell>
                      <TableCell align="center">{t('Amount (USD)')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoicesData.payments.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell align="center">{payment.paymentMethod || '-'}</TableCell>
                        <TableCell align="center">
                          {payment.amountPaySYP?.toLocaleString() || 0}
                        </TableCell>
                        <TableCell align="center">
                          {payment.amountPayUSD?.toLocaleString() || 0}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  {t('No payments to display')}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </MainCard>
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.order,
  type: 'view'
})(InvoicesDetails)
