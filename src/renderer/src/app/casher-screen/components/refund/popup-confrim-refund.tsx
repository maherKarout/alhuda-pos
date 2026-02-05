import { useState } from 'react'
import { Divider, Stack, Typography, TextField, Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import SimpleDialog from '@renderer/components/dialog'
import PaymentsIcon from '@mui/icons-material/Payments'
import GenericButton from '@renderer/components/generic-button'
import { CurrencyGuid, PaidStatus } from '@renderer/consts'
import { useAppDispatch } from '@renderer/hooks/useAppDispatch'
import { setCasherBox } from '@renderer/app/login/services/slice'
import { decimalPriceToNumber, priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
import {
  TBodyRefund,
  useAddOrderMutation,
  useGetCasherBoxMutation,
  useSendRefundOrderMutation
} from '../../services/api'
import { useFormikContext } from 'formik'
import { TInitialValuesType } from './refund-orders-popup'
import { CURRENCIES } from '@renderer/config/currencies'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  closeRefundPopup: Function
}

interface PaymentData {
  currencyValues: Record<string, string> // Dynamic: { syp: string, usd: string, ... }
}

const PopupConfirmRefund = ({ open, setOpen, closeRefundPopup }: Props) => {
  const { t } = useTranslation('translation')
  const { values, resetForm } = useFormikContext<TInitialValuesType>()
  const [getCasherBox, { isLoading: isFetchingCasherBox }] = useGetCasherBoxMutation()
  const [sendRefund, { isLoading: isLoadingRefund }] = useSendRefundOrderMutation()
  const dispatch = useAppDispatch()
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
      amount[currency.code] = +paymentData.currencyValues[currency.code] || 0
    })
    
    // For backward compatibility, ensure usd and syp are present
    const amountForAPI: { usd: number; syp: number; [key: string]: number } = {
      usd: amount.usd || 0,
      syp: amount.syp || 0,
      ...amount
    }
    
    const newData: TBodyRefund = {
      // orderId: values?.orderId,
      customer: values?.customerId,
      items: values.items?.map((item) => ({ productGuid: item.guid, quantity: item.quantity })),
      amount: amountForAPI
    }
    sendRefund(newData)
      .unwrap()
      .then((res) => {
        setOpen(false)
        resetForm()
        closeRefundPopup()
        getCasherBox()
          .unwrap()
          .then((res) => {
            dispatch(setCasherBox(res))
          })
          .catch((error) => {
            console.log(error)
          })
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
          {t('Enter the refund amount')}
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
            title={t('confirm')}
            onClick={handleConfirmSale}
            loading={isLoadingRefund}
            disabled={isLoadingRefund}
            sx={{ borderRadius: '5px', width: '100px' }}
          />
        </Stack>
      </Stack>
    </SimpleDialog>
  )
}

export default PopupConfirmRefund
