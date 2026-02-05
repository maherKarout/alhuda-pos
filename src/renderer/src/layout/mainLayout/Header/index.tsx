// material-ui
import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  styled,
  Switch,
  Typography,
  useTheme
} from '@mui/material'

// project imports

// assets
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { useGetExchangeRatesMutation } from '@renderer/app/casher-screen/services/api'
import AppNavigation from '@renderer/components/app-navigation'
import GuardWrapper from '@renderer/components/guard/guard-wrapper'
import PopupConfirmHandOver from '@renderer/components/hand-over/popup-confirm-hand-over'
import PopupHandOver from '@renderer/components/hand-over/popup-hand-over'
import { CURRENCIES } from '@renderer/config/currencies'
import { AccountRole } from '@renderer/consts'
import { getSelectedBranchName } from '@renderer/helpers/get-set-branch-data'
import { priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
import { useGlobalConfig } from '@renderer/hooks/use-global-config'
import { RootState } from '@renderer/redux-config/store'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import dollarFlag from 'src/assets/images/$.svg'; // Keep as fallback for currencies without flag
import { useAppTheme } from 'src/theme/ThemeContext'
import ProfileSection from './ProfileSection'
// ==============================|| MAIN NAVBAR / HEADER ||============================== //
const MaterialUISwitch = styled(Switch)(({ theme }: { theme: any }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: theme.palette.primary.contrastText,
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          theme.palette.primary.contrastText
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.grey[400],
        ...theme.applyStyles('dark', {
          backgroundColor: theme.palette.grey[600]
        })
      }
    }
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.primary.main,
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        theme.palette.primary.contrastText
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`
    },
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.primary.main
    })
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.grey[400],
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[600]
    })
  }
}))

const RadiusDiv = styled('div')(({ theme }: { theme: any }) => ({
  // color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.grey?.[900],
  color: theme.palette.text.dark,
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey?.[100],
  minWidth: '100px',
  width: 'fit-content',
  padding: '16px 25px',
  borderRadius: 32,
  fontWeight: 'bold'
}))

const AmountComponent = ({
  img,
  title,
  amount,
  isNew
}: {
  img: string
  title: string
  amount: string
  isNew?: boolean
}) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  return (
    <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
      {/* Flag with New Badge */}
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <img src={img} alt="currency flag" width={35} height={'auto'} />
        {isNew && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: 0,
              right: 15,
              backgroundColor: theme.palette.error.main,
              color: 'white',
              fontSize: '9px',
              fontWeight: 'bold',
              padding: '2px 4px',
              borderRadius: '8px',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              transform: 'rotate(45deg)'
            }}
          >
            NEW
          </Typography>
        )}
      </Box>

      {/* Text and Amount */}
      <Stack spacing={0}>
        <Typography
          variant="caption"
          sx={(theme) => ({
            fontSize: '12px',
            // color: theme.palette.primary.main,
            lineHeight: 1.2,
            fontWeight: 'bold'
          })}
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          sx={(theme) => ({
            fontSize: '14px',
            fontWeight: 'bold',
            lineHeight: 1.2,
            marginTop: '2px',
            color:
              Number(amount) > 0
                ? isDark
                  ? 'white'
                  : theme.palette.primary.main
                : theme.palette.error.main
          })}
        >
          {/* {priceToDecimalPrice('-1000')} */}
          {priceToDecimalPrice(amount)}
        </Typography>
      </Stack>
    </Stack>
  )
}

const ProfileWithShiftComponent = ({
  setOpenPopupHandOver
}: {
  setOpenPopupHandOver: (open: boolean) => void
}) => {
  const { t } = useTranslation('translation')

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ marginX: '7px' }}>
      {/* <ProfileSection name="user name" /> */}

      {/* Shift Handover Button */}
      <Button
        variant="contained"
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontSize: '14px',
          textTransform: 'none',
          borderRadius: '8px',
          paddingX: 1,
          paddingY: 1,
          width: '140px',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark
          }
        })}
        onClick={() => setOpenPopupHandOver(true)}
      >
        {t('Shift Handover')}
      </Button>
    </Stack>
  )
}
const Header = ({ handleLeftDrawerToggle }: { handleLeftDrawerToggle: () => void }) => {
  const [openPopupHandOver, setOpenPopupHandOver] = useState(false)
  // const [openPopupConfirmHandOver, setOpenPopupConfirmHandOver] = useState(false)
  const { t } = useTranslation('translation')
  const [getExchangeRates] = useGetExchangeRatesMutation()
  const { actions, exchangeRates } = useGlobalConfig()
  const theme = useTheme()
  const { toggleTheme, mode } = useAppTheme()
  const { account } = useSelector((state: RootState) => state.auth)
  const boxCasher = account?.box
  useEffect(() => {
    getExchangeRates()
      .unwrap()
      .then((res) => {
        const data = res?.data
        if (data)
          actions.setExchangeRates(data)
      })
  }, [])

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ marginLeft: '90px', width: '100%' }}
    >
      {/* <span></span> */}
      <GuardWrapper roles={[AccountRole.CASHIER]} returnSpace>
        <Stack
          direction="row"
          justifyContent="space-start"
          alignItems="center"
          spacing={2}
          sx={{ width: '100%' }}
        >
          <RadiusDiv>
            <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>
              {t('Branch Name')} : {getSelectedBranchName() ?? '--'}
            </Typography>
          </RadiusDiv>
          <RadiusDiv
            sx={(theme: any) => ({
              paddingY: '8px',
              backgroundColor: theme.palette.action.deafult
            })}
          >
            {boxCasher && (
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                {CURRENCIES.map((currency) => (
                  <AmountComponent
                    key={currency.code}
                    img={currency.flag || dollarFlag} // Use flag from currency config, fallback to dollar flag
                    title={t(`Total Cash(${currency.label})`)}
                    amount={boxCasher?.[currency.code]?.toString() || '0'}
                    isNew={currency.isNew} // Pass isNew flag to show badge
                  />
                ))}
              </Stack>
            )}
          </RadiusDiv>
          <RadiusDiv
            sx={(theme: any) => ({
              paddingY: '14px',
              paddingX: "14px",
              backgroundColor: theme.palette.action.deafult,
              width: "fit-content"

            })}
          >
            <Stack direction="row" alignItems={"center"}>
              <AttachMoneyIcon color='success' />
              <Typography variant="h4"
                sx={(theme) => ({
                  fontWeight: 'bold',
                  width: "fit-content",
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center"
                })}>
                = {priceToDecimalPrice(exchangeRates?.find((r) => r.code === "usd")?.price + "") ?? 0}
              </Typography>
            </Stack>
          </RadiusDiv>
        </Stack>
      </GuardWrapper>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0}>
        <FormControlLabel
          control={
            <MaterialUISwitch sx={{ m: 1 }} checked={mode === 'dark'} onChange={toggleTheme} />
          }
          label=""
        />
        <ProfileSection name="user name" />
        <GuardWrapper roles={[AccountRole.CASHIER]} returnSpace>
          <ProfileWithShiftComponent setOpenPopupHandOver={setOpenPopupHandOver} />
          <PopupHandOver open={openPopupHandOver} setOpen={setOpenPopupHandOver} />
          <PopupConfirmHandOver />
        </GuardWrapper>
        <AppNavigation />
      </Stack>
    </Stack>
  )
}

export default Header
