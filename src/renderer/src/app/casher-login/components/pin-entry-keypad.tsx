import BackspaceIcon from '@mui/icons-material/Backspace'
import { Box, Button, Stack, Typography } from '@mui/material'
import { setLoginData } from '@renderer/app/login/services/slice'
import {
  setShowPopConfirmHandover,
  setWaitConfirmHandOver
} from '@renderer/redux-config/global-config-slice'
import { useEffect } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'src/hooks/useAppDispatch'
import { useCasherLogin } from '../hooks/use-casher-login'
import { useLoginCasherMutation } from '../services/api'
import useUpdateCasherBox from '@renderer/hooks/use-update-casher-box'

const PinEntryKeypad = () => {
  const { t } = useTranslation('translation')
  const dispatch = useAppDispatch()
  const updateCasherBox = useUpdateCasherBox()
  const [loginCasher, { isLoading, isError, error }] = useLoginCasherMutation()
  const { pinCode, addPinDigit, removePinDigit, handleLogin, isAuthenticating, selectedUser } =
    useCasherLogin()

  const keypadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['X', '0', '']
  ]
  const onSubmit = () => {
    loginCasher({ username: selectedUser + '', password: pinCode })
      .unwrap()
      .then((data) => {
        dispatch(setLoginData(data))
        // if (data?.account?.showPopConfirmHandover)
        dispatch(setShowPopConfirmHandover(!!data?.account?.showPopConfirmHandover))
        dispatch(setWaitConfirmHandOver(!!data?.account?.waitConfirmHandOver))
        updateCasherBox()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleKeyPress = (key: string) => {
    if (key === 'X') {
      removePinDigit()
    } else if (key !== '') {
      addPinDigit(key)
    }
  }

  // Keyboard support for PIN entry
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key

      // Handle number keys (0-9)
      if (key >= '0' && key <= '9' && pinCode.length < 4) {
        addPinDigit(key)
        event.preventDefault()
      }
      // Handle backspace/delete
      else if ((key === 'Backspace' || key === 'Delete') && pinCode.length > 0) {
        removePinDigit()
        event.preventDefault()
      }
      // Handle Enter key to submit if PIN is complete
      else if (key === 'Enter' && pinCode.length === 4 && selectedUser) {
        onSubmit()
        event.preventDefault()
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyPress)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [pinCode, selectedUser, isAuthenticating, isLoading, addPinDigit, removePinDigit, onSubmit])

  const renderPinDots = () => {
    return Array.from({ length: 4 }, (_, index) => (
      <Box
        key={index}
        sx={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: index < pinCode.length ? 'white' : 'rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease'
        }}
      />
    ))
  }

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: '#21479B',
        padding: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        minHeight: { xs: '50vh', md: '100vh' },
        color: 'white'
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 0, textAlign: 'center' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: 5,
            color: '#FFFFFF',
            fontSize: { xs: '1.2rem', md: '1.5rem' }
          }}
        >
          {t('Enter your Pin')}
        </Typography>

        {/* PIN Dots */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          {renderPinDots()}
        </Stack>
      </Box>

      {/* Keypad */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Stack spacing={2} sx={{ maxWidth: 300, mx: 'auto', width: '100%' }}>
          {keypadNumbers.map((row, rowIndex) => (
            <Stack key={rowIndex} direction="row" spacing={2} justifyContent="center">
              {row.map((key, keyIndex) => (
                <Button
                  key={`${rowIndex}-${keyIndex}`}
                  onClick={() => handleKeyPress(key)}
                  disabled={key === ''}
                  sx={{
                    width: 80,
                    height: 80,
                    minWidth: 80,
                    borderRadius: '8px',
                    backgroundColor: key !== 'X' ? '#4A72B8' : 'transparent',
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    border: 'none',
                    '&:hover': {
                      backgroundColor: '#5A82C8',
                      transform: 'scale(1.05)'
                    },
                    '&:disabled': {
                      opacity: 0,
                      cursor: 'default'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  {key === 'X' ? <BackspaceIcon /> : key}
                </Button>
              ))}
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* Submit Button */}
      <Box sx={{ textAlign: 'center', my: 3 }}>
        <Button
          onClick={onSubmit}
          disabled={pinCode.length !== 4 || isAuthenticating || isLoading}
          sx={{
            backgroundColor: pinCode.length === 4 ? 'white' : 'rgba(255, 255, 255, 0.3)',
            color: pinCode.length === 4 ? '#1976d2' : 'rgba(255, 255, 255, 0.7)',
            padding: '12px 32px',
            borderRadius: '25px',
            fontWeight: 'bold',
            fontSize: '1rem',
            textTransform: 'none',
            minWidth: '120px',
            '&:hover': {
              backgroundColor: pinCode.length === 4 ? '#f5f5f5' : 'rgba(255, 255, 255, 0.3)',
              transform: pinCode.length === 4 ? 'scale(1.02)' : 'none'
            },
            '&:disabled': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'not-allowed'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {isAuthenticating || isLoading ? t('Authenticating...') : t('Login')}
        </Button>
      </Box>

      {/* Help Text */}
      <Box sx={{ textAlign: 'center', mt: 'auto' }}>
        <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
          {t('Having Trouble logging in?')}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem',
            cursor: 'pointer',
            '&:hover': {
              color: 'white'
            }
          }}
        >
          {t('Please Contact your administrator')}
        </Typography>
        <Link to="/login">admin login</Link>
      </Box>
    </Box>
  )
}

export default PinEntryKeypad
