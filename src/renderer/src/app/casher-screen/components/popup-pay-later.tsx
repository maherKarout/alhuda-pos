import { useState } from 'react'
import { Divider, Stack, Typography, TextField, Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import SimpleDialog from '@renderer/components/dialog'
import PaymentsIcon from '@mui/icons-material/Payments'
import { useAddOrderMutation, useGetCasherBoxMutation } from '../services/api'
import GenericButton from '@renderer/components/generic-button'
import { CurrencyGuid, PaidStatus } from '@renderer/consts'
import useCasherScreen from '../hooks/use-casher-screen'
import { useAppDispatch } from '@renderer/hooks/useAppDispatch'
import { setCasherBox } from '@renderer/app/login/services/slice'
import { decimalPriceToNumber, priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
import { CURRENCIES, getBaseCurrency, getCurrencyGuid } from '@renderer/config/currencies'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

interface PaymentData {
  currencyValues: Record<string, string> // Dynamic: { syp: string, usd: string, ... }
}

const PopupPayLater = ({ open, setOpen }: Props) => {
  const { t } = useTranslation('translation')
  const [addOrder, { isLoading }] = useAddOrderMutation()
  const { orders, currentOrder, setOrders, ResponseInvoiceDetails } = useCasherScreen()
  const [getCasherBox, { isLoading: isFetchingCasherBox }] = useGetCasherBoxMutation()
  const dispatch = useAppDispatch()
  const baseCurrency = getBaseCurrency()
  const [paymentData, setPaymentData] = useState<PaymentData>({
    currencyValues: Object.fromEntries(CURRENCIES.map((c) => [c.code, '']))
  })

  const handleCurrencyChange = (currencyCode: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData((prev) => ({
      ...prev,
      currencyValues: {
        ...prev.currencyValues,
        [currencyCode]: decimalPriceToNumber(event.target.value) + ''
      }
    }))
  }

  const handleConfirmSale = () => {
    // Build amount object for API (keeping current format for backward compatibility)
    const amount: Record<string, number> = {}
    CURRENCIES.forEach((currency) => {
      amount[currency.code] = Number(paymentData.currencyValues[currency.code] || 0)
    })

    // For backward compatibility, ensure usd and syp are present
    const amountForAPI: { usd: number; syp: number;[key: string]: number } = {
      usd: amount.usd || 0,
      syp: amount.syp || 0,
      ...amount
    }

    addOrder({
      items: orders[currentOrder]?.items.map((item) => ({
        productGuid: item.id,
        quantity: item.quantity
      })),
      amount: amountForAPI,
      paymentMethod: 'CASH',
      // @ts-ignore
      currency: getCurrencyGuid(baseCurrency.code) || CurrencyGuid.SYP,
      status: PaidStatus.notPaid,
      customer: orders[currentOrder]?.customerId || ''
      // orderId: new Date().getTime().toString()
    })
      .unwrap()
      .then((res) => {
        ResponseInvoiceDetails.current = {
          orderGuid: res.orderGuid,
          billNumber: res.billNumber,
          customerBalance: res.customerBalance
        }
        getCasherBox()
          .unwrap()
          .then((res) => {
            dispatch(setCasherBox(res))
            // dispatch(setExchangeRates(res))
          })
          .catch((error) => {
          })
        // Advance to payment successful step (step 2)
        if (!setOrders || currentOrder === undefined) return
        setOrders((prev) => {
          const newOrders = [...prev]
          newOrders[currentOrder] = {
            ...newOrders[currentOrder],
            currentStep: 2
          }
          return newOrders
        })
      })
      .catch((error) => {
      })
  }

  return (
    <SimpleDialog open={open} setOpen={setOpen} fullWidth={true} maxWidth="sm">
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        sx={{ p: 3, px: 5 }}
      >
        <PaymentsIcon color="primary" sx={{ fontSize: 100 }} />

        <Typography variant="h3" fontWeight={'600'} textAlign="center">
          {t('Do you need to pay later or do you need to pay partial payment?')}
        </Typography>

        <Divider sx={{ width: '100%' }} />

        {/* Payment Fields */}
        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            {t('Payment Amount')}:
          </Typography>
          <Stack spacing={3}>
            {CURRENCIES.map((currency) => (
              <TextField
                key={currency.code}
                label={t(`${currency.label} Value`)}
                value={priceToDecimalPrice(paymentData.currencyValues[currency.code] || '0')}
                onChange={handleCurrencyChange(currency.code)}
                fullWidth
                variant="outlined"
                placeholder={t(`Enter ${currency.label} amount`)}
              />
            ))}
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => setOpen(false)} sx={{ minWidth: 100 }}>
            {t('Cancel')}
          </Button>
          <GenericButton
            title={t('Save for Later')}
            onClick={handleConfirmSale}
            loading={isLoading}
            disabled={isLoading}
            sx={{ borderRadius: '5px' }}
          />
        </Stack>
      </Stack>
    </SimpleDialog>
  )
}

export default PopupPayLater
