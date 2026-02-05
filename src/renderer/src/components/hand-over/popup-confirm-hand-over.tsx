import { Box, Divider, Stack, Typography } from '@mui/material'
import SimpleDialog from '@renderer/components/dialog'
import { useAppDispatch } from '@renderer/hooks/useAppDispatch'
import { setShowPopConfirmHandover } from '@renderer/redux-config/global-config-slice'
import { RootState } from '@renderer/redux-config/store'
import {
  useGetHandOverDataQuery,
  useSendConfirmHandOverMutation
} from '@renderer/sahred-api/shared-api'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import handOverIcon from 'src/assets/images/icons/hand-over.svg'
import MainCard from '../cards/Main-card'
import GenericButton from '../generic-button'
import { useAppSelector } from '@renderer/hooks/useAppSelector'
import { useLogout } from '@renderer/hooks/use-logo-out'
import LogoutIcon from '@mui/icons-material/Logout'
import { priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
import useUpdateCasherBox from '@renderer/hooks/use-update-casher-box'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

interface HandoverData {
  supValue: string
  usdValue: string
  selectedCasher: string
}

const PopupConfirmHandOver = () => {
  const { t } = useTranslation('translation')
  const updateCasherBox = useUpdateCasherBox()
  const showPopConfirmHandover = useAppSelector(
    (state: RootState) => state.globalConfig.showPopConfirmHandover
  )
  const {
    data,
    isLoading,
    isSuccess,
    refetch: refetchCasherBoxData
  } = useGetHandOverDataQuery(undefined, { skip: false })

  const [handOver] = useSendConfirmHandOverMutation()

  const dispatch = useAppDispatch()
  const handleLogout = useLogout()

  const [handoverData, setHandoverData] = useState<HandoverData>({
    supValue: '',
    usdValue: '',
    selectedCasher: ''
  })

  const [isConfirmLoading, setIsConfirmLoading] = useState(false)
  const [isCancelLoading, setIsCancelLoading] = useState(false)
  useEffect(() => {
    refetchCasherBoxData()
  }, [showPopConfirmHandover])

  useEffect(() => {
    if (data) {
      setHandoverData((prev) => ({
        ...prev,
        supValue: data?.syp?.toString(),
        usdValue: data?.usd?.toString()
      }))
    }
  }, [isSuccess])

  const onSubmit = (isConfirm: boolean) => {
    if (isConfirm) {
      setIsConfirmLoading(true)
    } else {
      setIsCancelLoading(true)
    }

    handOver({
      isConfirmedHandOver: isConfirm
    })
      .unwrap()
      .then((res) => {
        dispatch(setShowPopConfirmHandover(false))
        updateCasherBox()
      })
      .finally(() => {
        // dispatch(setShowPopConfirmHandover(false))
        setIsConfirmLoading(false)
        setIsCancelLoading(false)
      })
  }

  return (
    <SimpleDialog
      open={showPopConfirmHandover || false}
      // open={true}
      setOpen={() => {}}
      title=""
      fullWidth={true}
      maxWidth="sm"
    >
      <MainCard loading={isLoading}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ p: 0 }}
        >
          <img src={handOverIcon} alt="hand-over" style={{ width: '60px', height: '60px' }} />
          <Typography variant="h3" fontWeight={'600'} textAlign="center" fontSize={'16px'}>
            {t('an_amount_has_been_transferred')} {data?.senderCasher} {t('To_your_box')}
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
              <Stack direction={'row'} spacing={2}>
                <Typography variant="h5" textAlign="center" fontSize={'16px'}>
                  {t('Current SYP')}:
                </Typography>
                <Typography variant="h3" fontWeight={'600'} textAlign="center" fontSize={'16px'}>
                  {priceToDecimalPrice(data?.syp + '')}
                </Typography>
              </Stack>
              <Stack direction={'row'} spacing={2}>
                <Typography variant="h5" textAlign="center" fontSize={'16px'}>
                  {t('Current USD')}:
                </Typography>
                <Typography variant="h3" fontWeight={'600'} textAlign="center" fontSize={'16px'}>
                  {priceToDecimalPrice(data?.usd + '')}
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Stack direction={'row'} spacing={2}>
            <Typography>{t('Sender Casher')}:</Typography>
            <Typography>{data?.senderCasher}</Typography>
          </Stack>
          <Stack direction={'row'} spacing={2}>
            <GenericButton
              title={t('Confirm Hand Over')}
              onClick={() => onSubmit(true)}
              loading={isConfirmLoading}
              disabled={isConfirmLoading || isCancelLoading}
              sx={{ width: '150px', height: '40px' }}
            />
            <GenericButton
              title={t('cancel')}
              variant="outlined"
              onClick={() => onSubmit(false)}
              loading={isCancelLoading}
              disabled={isConfirmLoading || isCancelLoading}
              sx={{ width: '150px', height: '40px' }}
            />
          </Stack>

          {/* Logout Link */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                transition: 'color 0.2s ease-in-out',
                '&:hover': {
                  color: '#dc3545'
                }
              }}
              onClick={handleLogout}
            >
              <LogoutIcon sx={{ fontSize: 18 }} />
              {t('Logout')}
            </Typography>
          </Box>
        </Stack>
      </MainCard>
    </SimpleDialog>
  )
}

export default PopupConfirmHandOver
