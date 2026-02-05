import React from 'react'
import { Box, Typography, Card, CardContent, Avatar, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useCasherLogin } from '../hooks/use-casher-login'
import { useGetCashersQuery } from '../services/api'
import ErrorAlert from '@renderer/components/error/error-alert'
import Loader from '@renderer/components/loader'

const UserSelectionPanel = () => {
  const { t } = useTranslation('translation')
  const { selectedCasher, setSelectedCasher } = useCasherLogin()

  const { data, isError, isLoading } = useGetCashersQuery()
  const cashers = data?.data

  const handleCasherSelect = (casher: any) => {
    setSelectedCasher(casher)
  }

  if (isError) return <ErrorAlert />
  if (isLoading) return <Loader />

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: { xs: 1.5, md: 2 },
        // display: 'flex',
        // flexDirection: 'column',
        minHeight: { xs: '50vh', md: '80vh' }
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            mb: 0.5
          }}
        >
          {t('Welcome to Alhuda')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#6c757d',
            fontSize: { xs: '0.9rem', md: '1rem' },
            marginBottom: '20px'
          }}
        >
          {t('Select User')}
        </Typography>
      </Box>

      {/* Cashers List */}
      <Box sx={{ flex: 1, maxHeight: '80vh ', overflowY: 'auto', paddingTop: '10px' }}>
        {cashers?.map((casher, index) => (
          <Card
            key={casher.username}
            onClick={() => handleCasherSelect(casher)}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '10px',
              border:
                selectedCasher?.username === casher.username
                  ? '2px solid #1976d2'
                  : '2px solid transparent',
              backgroundColor: selectedCasher?.username === casher.username ? '#e3f2fd' : 'white',
              boxShadow:
                selectedCasher?.username === casher.username
                  ? '0 4px 12px rgba(25, 118, 210, 0.3)'
                  : '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                borderColor: '#1976d2'
              }
            }}
          >
            <CardContent sx={{ padding: 1.5, '&:last-child': { paddingBottom: 1.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    backgroundColor: '#1976d2',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {/* {casher.username} */}
                  {index + 1}
                </Avatar>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#2c3e50',
                    fontWeight: '500',
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}
                >
                  {casher.name} ({casher.username})
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

export default UserSelectionPanel
