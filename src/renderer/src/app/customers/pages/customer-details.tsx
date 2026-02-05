import {
  Box,
  Divider,
  Stack,
  Typography
} from '@mui/material'
import MainCard from '@renderer/components/cards/Main-card'
import DateFormattedCell from '@renderer/components/date-formated-cell'
import ErrorAlert from '@renderer/components/error/error-alert'
import Loader from '@renderer/components/loader'
import MainTable from '@renderer/components/main-table'
import { privilegeFeature } from '@renderer/shared/privileges'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {
  TypeCustomerPayment,
  useGetCustomerPaymentsQuery,
  useGetCustomersByIdQuery
} from '../services/api'
import { CURRENCIES } from '@renderer/config/currencies'

function CustomerDetails() {
  const { t } = useTranslation('translation')
  const { id } = useParams()
  const { data, isLoading, isError } = useGetCustomersByIdQuery(id ?? '', {
    skip: !id
  })
  const { data: paymentsData } = useGetCustomerPaymentsQuery(id ?? '', {
    skip: !id
  })

  // Build headers dynamically for all currencies
  const currencyHeaders = CURRENCIES.map((currency) => ({
    key: `amount_${currency.code}`,
    value: t(`Amount (${currency.label})`)
  }))

  const headers = [
    { key: 'id', value: t('Order ID') },
    { key: 'createdAt', value: t('Date') },
    ...currencyHeaders,
    { key: 'type', value: t('Payment Type') },
    { key: 'casher', value: t('Casher') }
  ]

  if (isLoading) return <Loader />
  if (isError) return <ErrorAlert />
  if (!data) return null

  const customer = data?.data

  const onSearch = () => {
  }
  const createData = (data: TypeCustomerPayment) => {
    // Build amount data dynamically for all currencies
    const amountData: Record<string, string> = {}
    CURRENCIES.forEach((currency) => {
      amountData[`amount_${currency.code}`] = data.amount[currency.code]?.toLocaleString() || '0'
    })

    return {
      id: data.date,
      createdAt: <DateFormattedCell date={data.date} format="DD/MM/YYYY" />,
      ...amountData,
      type: data.type,
      casher: data.casher
    }
  }

  const differencePurchases = customer.totalPurchases - customer.totalPaymentSyp
  return (
    <Box sx={{ p: 0, mx: 'auto' }}>
      <MainCard title={customer.name} sx={{ mb: 1 }} loading={isLoading}>
        <Stack direction="row" spacing={4} divider={<Divider orientation="vertical" flexItem />}>
          {/* Phone Number */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {t('Phone Number')}
            </Typography>
            <Typography variant="body1" fontWeight="500">
              {customer.phone}
            </Typography>
          </Box>

          {/* Customer ID */}
          {/* <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {t('Customer ID')}
            </Typography>
            <Typography variant="body1" fontWeight="500">
              {customer.customerId}
            </Typography>
          </Box> */}

          {/* Total Invoices */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.primary">
              {t('count_invoices')}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              {customer.numberOfInvoices}
            </Typography>
          </Box>

          {/* Total Purchases */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.primary">
              {t('Total Purchases')}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              {customer.totalPurchases?.toLocaleString()} {t('SYP')}
            </Typography>
          </Box>
          {/* Total payments */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {t('total_payments')}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              {customer.totalPaymentSyp?.toLocaleString()} {t('SYP')}
            </Typography>
          </Box>
          {/* Purchases - payments */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {t('difference_purchases_payments')}
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={Number(differencePurchases ?? 0) > 0 ? 'warning.main' : 'error.main'}
            >
              {differencePurchases?.toLocaleString()} {t('SYP')}
            </Typography>
          </Box>
        </Stack>
      </MainCard>
      <MainTable
        title={t('Payments')}
        feature={privilegeFeature.order}
        // onAdd={canEdit ? onAdd : undef"not-paid"ined}
        handleSearch={onSearch}
        isError={isError}
        header={headers}
        rows={paymentsData?.data.map((d) => createData(d)) || []}
        totalRecords={1000}
        limit={10}
        page={1}
        onPageChange={() => { }}
        onLimitChange={() => { }}
        loading={isLoading}
      />
    </Box>
  )
}

export default CustomerDetails
