import React, { useState, useEffect } from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  SelectChangeEvent,
  Chip
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { PurchaseStatus } from '@renderer/consts'
import { useUpdatePurchaseOrderStatusMutation } from '../services/api'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CancelIcon from '@mui/icons-material/Cancel'

type Props = {
  purchaseOrderId: string
  currentStatus: string
  onStatusUpdated?: () => void
}

function UpdatePurchaseOrderStatus({ purchaseOrderId, currentStatus, onStatusUpdated }: Props) {
  const { t } = useTranslation('translation')
  const [status, setStatus] = useState<string>(currentStatus)
  const [updateStatus, { isLoading }] = useUpdatePurchaseOrderStatusMutation()

  useEffect(() => {
    setStatus(currentStatus)
  }, [currentStatus])

  const handleStatusChange = async (event: SelectChangeEvent<string>) => {
    const newStatus = event.target.value as PurchaseStatus
    setStatus(newStatus)

    try {
      await updateStatus({
        id: purchaseOrderId,
        status: newStatus
      }).unwrap()

      onStatusUpdated?.()
    } catch (error) {
      // Revert on error
      setStatus(currentStatus)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case PurchaseStatus.UNDER_PROCESS:
        return '#ff9800'
      case PurchaseStatus.IN_PROGRESS:
        return '#2196f3'
      case PurchaseStatus.SENT:
        return '#9c27b0'
      case PurchaseStatus.DELIVERED:
        return '#4CAF50'
      case PurchaseStatus.REFUNDED:
        return '#f44336'
      default:
        return '#757575'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case PurchaseStatus.UNDER_PROCESS:
        return <PendingIcon sx={{ fontSize: 18 }} />
      case PurchaseStatus.IN_PROGRESS:
        return <CheckCircleIcon sx={{ fontSize: 18 }} />
      case PurchaseStatus.SENT:
        return <LocalShippingIcon sx={{ fontSize: 18 }} />
      case PurchaseStatus.DELIVERED:
        return <LocalShippingIcon sx={{ fontSize: 18 }} />
      case PurchaseStatus.REFUNDED:
        return <CancelIcon sx={{ fontSize: 18 }} />
      default:
        return <PendingIcon sx={{ fontSize: 18 }} />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case PurchaseStatus.UNDER_PROCESS:
        return t('Under Process')
      case PurchaseStatus.IN_PROGRESS:
        return t('In Progress')
      case PurchaseStatus.SENT:
        return t('Sent')
      case PurchaseStatus.DELIVERED:
        return t('Delivered')
      case PurchaseStatus.REFUNDED:
        return t('Refunded')
      default:
        return '??' + status
    }
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <FormControl
        fullWidth={false}
        disabled={isLoading}
        sx={{
          minWidth: 140,
          '& .MuiOutlinedInput-root': {
            border: 'none',
            '& fieldset': {
              border: 'none'
            },
            '&:hover fieldset': {
              border: 'none'
            },
            '&.Mui-focused fieldset': {
              border: 'none'
            }
          }
        }}
      >
        <Select
          value={status}
          onChange={handleStatusChange}
          disabled={isLoading}
          sx={{
            '& .MuiSelect-select': {
              padding: 0,
              minHeight: 'auto'
            },
            '& .MuiSelect-icon': {
              display: 'none'
            }
          }}
          renderValue={(selected) => (
            <Chip
              icon={getStatusIcon(selected)}
              label={getStatusLabel(selected)}
              size="medium"
              sx={{
                backgroundColor: getStatusColor(selected),
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                height: 32,
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease-in-out',
                '& .MuiChip-icon': {
                  color: 'white',
                  marginX: '3px'
                },
                '& .MuiChip-label': {
                  paddingLeft: '4px',
                  paddingRight: '12px',
                  fontSize: '12px'
                },
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }
              }}
            />
          )}
        >
          <MenuItem value={PurchaseStatus.UNDER_PROCESS}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#fff3e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PendingIcon sx={{ color: '#ff9800', fontSize: 18 }} />
              </Box>
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {t('Under Process')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('Order is waiting for approval')}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem value={PurchaseStatus.IN_PROGRESS}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#e3f2fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CheckCircleIcon sx={{ color: '#2196f3', fontSize: 18 }} />
              </Box>
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {t('In Progress')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('Order has been approved')}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem value={PurchaseStatus.SENT}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#e8f5e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LocalShippingIcon sx={{ color: '#4CAF50', fontSize: 18 }} />
              </Box>
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {t('Sent')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('Order has been sent')}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem value={PurchaseStatus.DELIVERED}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#e8f5e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LocalShippingIcon sx={{ color: '#4CAF50', fontSize: 18 }} />
              </Box>
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {t('Delivered')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('Order has been delivered')}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem value={PurchaseStatus.REFUNDED}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#ffebee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CancelIcon sx={{ color: '#f44336', fontSize: 18 }} />
              </Box>
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {t('Refunded')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('Order has been refunded')}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default UpdatePurchaseOrderStatus
