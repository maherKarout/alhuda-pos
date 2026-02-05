import React from 'react'
import { Dialog, Stack, Typography, Box, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useLogout } from '@renderer/hooks/use-logo-out'
import GenericButton from '../generic-button'
import useGetDirection from 'src/hooks/use-get-direction'
import LogoutIcon from '@mui/icons-material/Logout'

type Props = {
  open: boolean
}

function FreezeScreen({ open }: Props) {
  const { t } = useTranslation('translation')
  const handleLogout = useLogout()
  const dir = useGetDirection()

  return (
    <Dialog
      open={open}
      dir={dir}
      fullScreen
      disableEscapeKeyDown
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)'
        }
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={4}
        sx={{ height: '100%', p: 4 }}
      >
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress size={80} thickness={4} sx={{ color: 'white' }} />
        </Box>

        <Stack spacing={2} alignItems="center">
          <Typography
            variant="h3"
            fontWeight="600"
            textAlign="center"
            sx={{ color: 'white', fontSize: '28px' }}
          >
            {t('Waiting for handover completion')}
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px', maxWidth: '500px' }}
          >
            {t('Please wait while the handover operation is being processed')}
          </Typography>
        </Stack>

        <Box sx={{ mt: 'auto' }}>
          <GenericButton
            title={t('Logout')}
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              backgroundColor: '#dc3545',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '16px',
              '&:hover': {
                backgroundColor: '#c82333'
              }
            }}
          />
        </Box>
      </Stack>
    </Dialog>
  )
}

export default FreezeScreen
