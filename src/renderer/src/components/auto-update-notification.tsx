import React, { useEffect, useState } from 'react'
import {
  Snackbar,
  Alert,
  AlertTitle,
  Button,
  LinearProgress,
  Box,
  Typography,
  Stack
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'

interface UpdateInfo {
  version?: string
  releaseDate?: string
  releaseName?: string
}

interface ProgressInfo {
  bytesPerSecond: number
  percent: number
  transferred: number
  total: number
}

export default function AutoUpdateNotification() {
  const { t } = useTranslation('translation')
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updateDownloaded, setUpdateDownloaded] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({})
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if running in Electron
    if (!window.autoUpdater) {
      console.warn('AutoUpdater API not available')
      return
    }

    // Listen for update events
    const unsubscribe = window.autoUpdater.onUpdateStatus((event, data) => {
      console.log('Update event:', event, data)

      switch (event) {
        case 'checking-for-update':
          console.log('Checking for updates...')
          break

        case 'update-available':
          setUpdateAvailable(true)
          setUpdateInfo(data)
          break

        case 'update-not-available':
          console.log('No updates available')
          break

        case 'download-progress':
          setDownloading(true)
          setProgress(Math.round(data.percent))
          break

        case 'update-downloaded':
          setDownloading(false)
          setUpdateDownloaded(true)
          setUpdateInfo(data)
          break

        case 'update-error':
          setError(data.message)
          setDownloading(false)
          break

        default:
          break
      }
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const handleDownload = () => {
    if (window.autoUpdater) {
      window.autoUpdater.downloadUpdate()
      setUpdateAvailable(false)
    }
  }

  const handleInstall = () => {
    if (window.autoUpdater) {
      window.autoUpdater.quitAndInstall()
    }
  }

  const handleCheckForUpdates = () => {
    if (window.autoUpdater) {
      window.autoUpdater.checkForUpdates()
    }
  }

  return (
    <>
      {/* Update Available Notification */}
      <Snackbar
        open={updateAvailable}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setUpdateAvailable(false)}
      >
        <Alert
          severity="info"
          icon={<CloudDownloadIcon />}
          action={
            <Stack direction="row" spacing={1}>
              <Button color="inherit" size="small" onClick={() => setUpdateAvailable(false)}>
                {t('Later') || 'Later'}
              </Button>
              <Button color="inherit" size="small" variant="outlined" onClick={handleDownload}>
                {t('Download') || 'Download'}
              </Button>
            </Stack>
          }
          sx={{ minWidth: 400 }}
        >
          <AlertTitle>{t('Update Available') || 'Update Available'}</AlertTitle>
          {updateInfo.version && (
            <Typography variant="body2">
              {t('Version') || 'Version'} {updateInfo.version} {t('is available') || 'is available'}
            </Typography>
          )}
        </Alert>
      </Snackbar>

      {/* Downloading Update */}
      <Snackbar open={downloading} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity="info" icon={<CloudDownloadIcon />} sx={{ minWidth: 400 }}>
          <AlertTitle>{t('Downloading Update') || 'Downloading Update'}</AlertTitle>
          <Box sx={{ width: '100%', mt: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {progress}% {t('complete') || 'complete'}
            </Typography>
          </Box>
        </Alert>
      </Snackbar>

      {/* Update Downloaded - Ready to Install */}
      <Snackbar open={updateDownloaded} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert
          severity="success"
          icon={<SystemUpdateAltIcon />}
          action={
            <Stack direction="row" spacing={1}>
              <Button color="inherit" size="small" onClick={() => setUpdateDownloaded(false)}>
                {t('Later') || 'Later'}
              </Button>
              <Button color="inherit" size="small" variant="outlined" onClick={handleInstall}>
                {t('Restart Now') || 'Restart Now'}
              </Button>
            </Stack>
          }
          sx={{ minWidth: 400 }}
        >
          <AlertTitle>{t('Update Ready') || 'Update Ready'}</AlertTitle>
          <Typography variant="body2">
            {t('Update has been downloaded. Restart to install.') ||
              'Update has been downloaded. Restart to install.'}
          </Typography>
        </Alert>
      </Snackbar>

      {/* Error Notification */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => setError(null)} sx={{ minWidth: 400 }}>
          <AlertTitle>{t('Update Error') || 'Update Error'}</AlertTitle>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Snackbar>
    </>
  )
}

