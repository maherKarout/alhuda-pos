import React from 'react'
import { IconButton, Stack, Tooltip, Typography } from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  CloudDone as IconOnline,
  CloudOff as IconOffline
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from 'src/hooks/useAppSelector'

const AppNavigation: React.FC = () => {
  const navigate = useNavigate()
  const { isServerOnline } = useAppSelector((state) => state.globalConfig)
  const handleBack = () => navigate(-1)
  const handleForward = () => navigate(1)
  const handleRefresh = () => window.location.reload()

  return (
    <Stack>
      <Stack direction="row" alignItems="center" spacing={1} dir="ltr">
        <Tooltip title="Back">
          <span>
            <IconButton size="small" onClick={handleBack}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Forward">
          <span>
            <IconButton size="small" onClick={handleForward}>
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Refresh">
          <span>
            <IconButton size="small" onClick={handleRefresh}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={0.5} dir="ltr">
        {isServerOnline ? (
          <Stack direction="row" alignItems="center" gap={0.5} dir="ltr">
            <IconOnline sx={{ fontSize: '1rem' }} color="success" />
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
              Online
            </Typography>
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" gap={0.5} dir="ltr"  >
            <IconOffline sx={{ fontSize: '1rem' }} color="error" />
            <Typography variant="caption" color="error.main" sx={{ fontWeight: 'bold' }}>
              Your are offline
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export default AppNavigation
