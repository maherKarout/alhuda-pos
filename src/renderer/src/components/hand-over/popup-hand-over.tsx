import { useEffect, useState } from 'react'
import {
  Divider,
  Stack,
  Typography,
  TextField,
  Box,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import SimpleDialog from '@renderer/components/dialog'
import handOverIcon from 'src/assets/images/icons/hand-over.svg'
import { useGetCasherBoxDataQuery, useHandOverMutation } from '@renderer/app/casher-screen'
import MainCard from '../cards/Main-card'
import { useGetCashersQuery } from '@renderer/app/casher-login/services/api'
import MenuItem from '@mui/material/MenuItem'
import GenericButton from '../generic-button'
import { useLogout } from '@renderer/hooks/use-logo-out'
import { useAppSelector } from '@renderer/hooks/useAppSelector'
import { decimalPriceToNumber, priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
import { CURRENCIES, createEmptyAmountObject } from '@renderer/config/currencies'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

interface HandoverData {
  currencyValues: Record<string, string> // Dynamic: { syp: string, usd: string, ... }
  selectedCasher: string
}

const popupHandOver = ({ open, setOpen }: Props) => {
  const { t } = useTranslation('translation')
  const { data, isLoading, isSuccess, refetch: refetchCasherBoxData } = useGetCasherBoxDataQuery()
  const { account } = useAppSelector((state) => state.auth)
  const {
    data: cashers,
    isError,
    isLoading: isCashersLoading,
    refetch: refetchCashers
  } = useGetCashersQuery()
  const [handOver, { isLoading: isHandOverLoading }] = useHandOverMutation()
  const handleLogout = useLogout()

  const [handoverData, setHandoverData] = useState<HandoverData>({
    currencyValues: Object.fromEntries(CURRENCIES.map((c) => [c.code, ''])),
    selectedCasher: ''
  })
  useEffect(() => {
    refetchCasherBoxData()
    refetchCashers()
  }, [open])

  useEffect(() => {
    if (data) {
      const currencyValues: Record<string, string> = {}
      CURRENCIES.forEach((currency) => {
        currencyValues[currency.code] = data?.[currency.code]?.toString() || '0'
      })
      setHandoverData((prev) => ({
        ...prev,
        currencyValues
      }))
    }
  }, [isSuccess, open])

  const handleCurrencyChange = (currencyCode: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setHandoverData((prev) => ({
      ...prev,
      currencyValues: {
        ...prev.currencyValues,
        [currencyCode]: decimalPriceToNumber(event.target.value).toString()
      }
    }))
  }

  const handleCasherChange = (event: any) => {
    setHandoverData((prev) => ({
      ...prev,
      selectedCasher: event.target.value
    }))
  }

  const handleHandOver = () => {
    // Build amount object for API (keeping current format for backward compatibility)
    const amount: Record<string, number> = {}
    CURRENCIES.forEach((currency) => {
      amount[currency.code] = Number(handoverData.currencyValues[currency.code] || 0)
    })

    // For backward compatibility, ensure usd and syp are present
    const handOverDataForAPI = {
      usd: amount.usd || 0,
      syp: amount.syp || 0,
      ...amount,
      nextCashier: handoverData.selectedCasher
    } as any // Using 'as any' because the API type expects mixed string/number properties

    handOver(handOverDataForAPI)
      .unwrap()
      .then((res) => {
        setOpen(false)
        handleLogout()
      })
  }

  const newCashers = cashers?.data?.filter((casher) => {
    // @ts-ignore
    return casher?.id !== account?.id
  })
  return (
    <SimpleDialog open={open} setOpen={setOpen} title="" fullWidth={true} maxWidth="sm">
      <MainCard loading={isLoading || isCashersLoading}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ p: 0 }}
        >
          <img src={handOverIcon} alt="hand-over" style={{ width: '60px', height: '60px' }} />
          <Typography variant="h3" fontWeight={'600'} textAlign="center" fontSize={'16px'}>
            {t('Are you sure you want to end your shift and hand over the register?')}
          </Typography>
          <Divider />

          {/* Handover Data Fields */}
          <Box sx={{ width: '100%', mt: 2 }}>
            <Stack
              justifyContent={'center'}
              alignItems={'flex-start'}
              direction={'column'}
              spacing={2}
              sx={{ mb: 2, mx: 'auto', width: 'fit-content' }}
            >
              {CURRENCIES.map((currency) => (
                <Stack key={currency.code} direction={'row'} spacing={2}>
                  <Typography variant="h5" textAlign="center" fontSize={'16px'}>
                    {t(`Current ${currency.label}`)}:
                  </Typography>
                  <Typography variant="h3" fontWeight={'600'} textAlign="center" fontSize={'16px'}>
                    {data?.[currency.code] || 0}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Stack spacing={3} direction="row">
              {CURRENCIES.map((currency) => (
                <TextField
                  key={currency.code}
                  label={t(`Current ${currency.label}`)}
                  value={priceToDecimalPrice(handoverData.currencyValues[currency.code] || '0')}
                  onChange={handleCurrencyChange(currency.code)}
                  fullWidth
                  variant="outlined"
                  placeholder={t(`Enter current ${currency.label} amount`)}
                />
              ))}
            </Stack>

            <>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="demo-simple-select-label">{t('Casher')}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  fullWidth
                  variant="outlined"
                  label={t('Casher')}
                  value={handoverData.selectedCasher}
                  onChange={handleCasherChange}
                >
                  {newCashers?.map((casher) => (
                    <MenuItem key={casher.id} value={casher.id}>
                      {casher.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          </Box>

          <GenericButton
            title={t('Hand Over')}
            onClick={handleHandOver}
            loading={isHandOverLoading}
            disabled={isHandOverLoading}
          />
        </Stack>
      </MainCard>
    </SimpleDialog>
  )
}

export default popupHandOver
