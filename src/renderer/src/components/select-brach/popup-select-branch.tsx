import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import StorefrontIcon from '@mui/icons-material/Storefront'
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography
} from '@mui/material'
import { useGetAllBranchesWithoutAuthQuery } from '@renderer/app/branches'
import { navigateTo } from '@renderer/components/navigation-component'
import { saveSelectedBranch } from '@renderer/helpers/get-set-branch-data'
import { useBranchSelection } from '@renderer/hooks/use-branch-selection'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useGetDirection from 'src/hooks/use-get-direction'
import GenericButton from '../generic-button'

function PopupForceSelectBranch() {
  const { t } = useTranslation('translation')
  const dir = useGetDirection()
  const [selectedBranchId, setSelectedBranchId] = useState<string>('')
  const { showBranchSelection, handleBranchSelected } = useBranchSelection()

  const {
    isLoading: isLoadingBranches,
    data: branchesData,
    isError: isErrorBranches
  } = useGetAllBranchesWithoutAuthQuery(undefined, {
    skip: !showBranchSelection
  })

  const handleConfirmSelection = () => {
    if (selectedBranchId) {
      saveSelectedBranch(
        selectedBranchId,
        branchesData?.data?.find((branch) => branch.id === selectedBranchId)?.name ?? ''
      )
      handleBranchSelected()
    }
  }

  const handleBranchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBranchId(event.target.value)
  }

  const handleAdminLogin = () => {
    navigateTo('/login')
  }

  return (
    <Dialog
      open={showBranchSelection}
      // open={true}
      // open={false}
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
        {/* Header */}
        <Box sx={{ textAlign: 'center' }}>
          <StorefrontIcon sx={{ fontSize: 60, color: 'white', mb: 2 }} />
          <Typography
            variant="h3"
            fontWeight="600"
            textAlign="center"
            sx={{ color: 'white', fontSize: '28px' }}
          >
            {t('Select Your Branch')}
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px', maxWidth: '500px' }}
          >
            {t('Please select a branch to continue')}
          </Typography>
        </Box>

        {/* Loading State */}
        {isLoadingBranches && (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress size={80} thickness={4} sx={{ color: 'white' }} />
          </Box>
        )}

        {/* Error State */}
        {isErrorBranches && (
          <Alert
            severity="error"
            sx={{
              width: '100%',
              maxWidth: '500px',
              backgroundColor: 'rgba(211, 47, 47, 0.9)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
          >
            {t('Error loading branches. Please try again.')}
          </Alert>
        )}

        {/* Branch Selection */}
        {!isLoadingBranches && !isErrorBranches && branchesData?.data && (
          <Box
            sx={{
              width: '100%',
              maxWidth: '600px',
              maxHeight: '400px',
              overflowY: 'auto',
              paddingX: '10px'
            }}
          >
            <RadioGroup
              value={selectedBranchId}
              onChange={handleBranchChange}
              sx={{ width: '100%' }}
            >
              <Stack spacing={2}>
                {branchesData.data.map((branch) => (
                  <Card
                    key={branch.id}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      // paddingY: '0',
                      border: '1px solid',
                      padding: '0px',
                      borderColor:
                        selectedBranchId === branch.id ? '#2196f3' : 'rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: '#2196f3',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                      }
                    }}
                    onClick={() => setSelectedBranchId(branch.id)}
                  >
                    <CardContent sx={{ p: '15px' }}>
                      <FormControlLabel
                        value={branch.id}
                        control={
                          <Radio
                            sx={{
                              color:
                                selectedBranchId === branch.id
                                  ? '#2196f3'
                                  : 'rgba(255, 255, 255, 0.5)',
                              '&.Mui-checked': {
                                color: '#2196f3'
                              }
                            }}
                          />
                        }
                        label={
                          <Stack spacing={0.5} sx={{ ml: 1 }}>
                            <Typography variant="h6" fontWeight="600" sx={{ color: 'white' }}>
                              {branch.name}
                            </Typography>
                            {branch.location && (
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <LocationOnIcon
                                  sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                >
                                  {branch.location}
                                </Typography>
                              </Stack>
                            )}
                          </Stack>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </RadioGroup>
          </Box>
        )}

        {/* No Branches Available */}
        {!isLoadingBranches &&
          !isErrorBranches &&
          branchesData?.data &&
          branchesData.data.length === 0 && (
            <Alert
              severity="warning"
              sx={{
                width: '100%',
                maxWidth: '500px',
                backgroundColor: 'rgba(255, 152, 0, 0.9)',
                color: 'white',
                '& .MuiAlert-icon': {
                  color: 'white'
                }
              }}
            >
              {t('No branches available. Please contact your administrator.')}
            </Alert>
          )}

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
          <GenericButton
            title={t('Confirm')}
            onClick={handleConfirmSelection}
            disabled={!selectedBranchId || isLoadingBranches}
            sx={{
              backgroundColor: '#2196f3',
              color: 'white',
              px: 6,
              py: 1.5,
              fontSize: '16px',
              '&:hover': {
                backgroundColor: '#1976d2'
              },
              '&:disabled': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          />
        </Stack>

        {/* Admin Login Link */}
        {/* <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              transition: 'color 0.2s ease-in-out',
              '&:hover': {
                color: '#2196f3'
              }
            }}
            onClick={handleAdminLogin}
          >
            <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />
            {t('Are you an admin? Click here to login')}
          </Typography>
        </Box> */}
      </Stack>
    </Dialog>
  )
}

export default PopupForceSelectBranch
