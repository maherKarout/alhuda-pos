import { Snackbar, Alert, Typography, Slide } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { resetAuthData } from 'src/app/login/services/slice'
import { getErrorMessageFromCode } from 'src/helpers/get-error-message-from-code'
import handleErrorTokenFromErrorCode from 'src/helpers/handle-error-token-from-error-code'
import { useAppDispatch } from 'src/hooks/useAppDispatch'
import WarningIcon from '@mui/icons-material/ErrorOutline'
import CheckIcon from '@mui/icons-material/CheckOutlined'
let showErrorToasts: Function
let showSuccessToasts: Function
let showStringErrorToasts: Function

const success = (message: string) => (
  <Alert
    sx={{ p: 2, borderRadius: '20px', bgcolor: 'success.main' }}
    severity="success"
    icon={<CheckIcon sx={{ color: 'white' }} />}
  >
    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: 'white' }}>{message}</Typography>
  </Alert>
)

const error = (message: string) => (
  <Alert
    sx={{
      p: 2,
      borderRadius: '20px',
      bgcolor: 'error.main',
      color: 'white'
    }}
    security="error"
    icon={<WarningIcon sx={{ color: 'white' }} />}
  >
    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>{message}</Typography>
  </Alert>
)

const Toasts = () => {
  const { t } = useTranslation('translation')
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState<{
    code: number | null | string
    message: string | null
  }>({
    code: null,
    message: null
  })

  const [stringError, setStringError] = useState<string | null>(null)

  const handleClose = () => {
    setOpen({ code: null, message: null })
  }

  const handleStringErrorClose = () => {
    setStringError(null)
  }
  showErrorToasts = (code: number | string) => {
    handleErrorTokenFromErrorCode(`${code}`) ? dispatch(resetAuthData()) : null
    setOpen({ code: code, message: null })
  }
  showStringErrorToasts = (message: string) => {
    setStringError(message)
  }

  showSuccessToasts = (message: string) => {
    setOpen({ code: null, message: message })
  }

  return (
    <>
      <>
        <Snackbar
          key={open.code + new Date().toISOString()}
          TransitionComponent={(props) => <Slide {...props} direction="right" />}
          open={Boolean(open.code)}
          autoHideDuration={6000}
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'bottom'
          }}
          onClose={handleClose}
        >
          {error(t(getErrorMessageFromCode(open.code ?? '')))}
        </Snackbar>
      </>
      <>
        <Snackbar
          key={open.code + '1' + new Date().toISOString()}
          TransitionComponent={(props) => <Slide {...props} direction="right" />}
          open={Boolean(open.message)}
          autoHideDuration={6000}
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'bottom'
          }}
          onClose={handleClose}
        >
          {success(t(open.message ?? '') ?? '')}
        </Snackbar>
      </>
      <>
        <Snackbar
          key={open.code + '1' + new Date().toISOString()}
          TransitionComponent={(props) => <Slide {...props} direction="right" />}
          open={Boolean(open.message)}
          autoHideDuration={6000}
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'bottom'
          }}
          onClose={handleClose}
        >
          {success(t(open.message ?? '') ?? '')}
        </Snackbar>
      </>

      <Snackbar
        key={'string-error' + new Date().toISOString()}
        TransitionComponent={(props) => <Slide {...props} direction="right" />}
        open={Boolean(stringError)}
        autoHideDuration={6000}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom'
        }}
        onClose={handleStringErrorClose}
      >
        {error(stringError ?? '')}
      </Snackbar>
    </>
  )
}
export { showErrorToasts, showSuccessToasts, showStringErrorToasts }

export default Toasts
