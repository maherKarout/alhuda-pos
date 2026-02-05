import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import StoreIcon from '@mui/icons-material/Store'
import WarningIcon from '@mui/icons-material/Warning'
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme
} from '@mui/material'
import { priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useCasherScreen from '../hooks/use-casher-screen'
import { TProduct } from '../hooks/use-get-all-products'
import { getCurrencyByGuid, getBaseCurrency } from '@renderer/config/currencies'
import { CurrencyGuid } from '@renderer/consts'

// Product interface
export interface ProductProps {
  product: TProduct
}

const Product = ({ product }: ProductProps) => {
  const { t } = useTranslation('translation')
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { setOrders, orders, currentOrder, allBranches } = useCasherScreen()
  const items = orders[currentOrder]?.items || []
  const selectedItem = items.find((item) => item.id === product.id)
  const { id, name, individualPrice } = product
  const quantity = product.quantity
  const isSelected = Boolean(selectedItem) // Check if product is in cart

  // Get currency from product's currencyGuid, or fallback to base currency
  const productCurrencyGuid = (product as any).currencyGuid || (product as any).currency
  const productCurrency = productCurrencyGuid
    ? getCurrencyByGuid(productCurrencyGuid)
    : getBaseCurrency()
  const currencySymbol = productCurrency?.symbol || productCurrency?.label || getBaseCurrency().label

  const [isAnimating, setIsAnimating] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showNegativeQuantityDialog, setShowNegativeQuantityDialog] = useState(false)
  const open = Boolean(anchorEl)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const prevQuantityRef = useRef<number>(selectedItem?.quantity ?? 0)

  // Listen to quantity changes and trigger animation
  useEffect(() => {
    const currentQuantity = selectedItem?.quantity ?? 0
    const prevQuantity = prevQuantityRef.current

    // Trigger animation only if quantity actually changed
    if (currentQuantity !== prevQuantity) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsAnimating(true)

      // Set timeout to end animation
      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false)
        timeoutRef.current = null
      }, 200) // 500ms animation duration
    }

    // Update previous quantity reference
    prevQuantityRef.current = currentQuantity
  }, [selectedItem?.quantity])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleIncrement = (skipCheckQuantity = false) => {
    if (!setOrders) return
    setOrders((prev) => {
      const newOrders = [...prev]
      const currentOrderData = newOrders[currentOrder]

      if (!currentOrderData) return prev

      const existingItem = currentOrderData.items.find((item) => item.id === id)

      if (existingItem) {
        // Item exists, increment quantity
        newOrders[currentOrder] = {
          ...currentOrderData,
          items: currentOrderData.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        }
      } else {
        // Item doesn't exist, add new item
        if (Number(product?.quantity) <= 0 && !skipCheckQuantity) {
          // alert('show negative quantity dialog')
          setShowNegativeQuantityDialog(true) //TODO CHECK THIS CODE
          return prev
        }
        // alert('add new item')
        setShowNegativeQuantityDialog(false) //TODO CHECK THIS CODE
        newOrders[currentOrder] = {
          ...currentOrderData,
          items: [
            ...currentOrderData.items,
            {
              id,
              name,
              price: individualPrice,
              quantity: 1,
              code: product.code,
              individualPrice: individualPrice,
              discountPercentage: 0,
              discountValue: 0,
              note: '',
              openPrice: product.openPrice ?? false
            }
          ]
        }
      }

      return newOrders
    })
  }

  const handleDecrement = () => {
    if (!setOrders || !selectedItem) return

    setOrders((prev) => {
      const newOrders = [...prev]
      const currentOrderData = newOrders[currentOrder]

      if (!currentOrderData) return prev

      if (selectedItem.quantity > 1) {
        // Decrease quantity
        newOrders[currentOrder] = {
          ...currentOrderData,
          items: currentOrderData.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
        }
      } else {
        // Remove item completely
        newOrders[currentOrder] = {
          ...currentOrderData,
          items: currentOrderData.items.filter((item) => item.id !== id)
        }
      }

      return newOrders
    })
  }

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    handleIncrement(false)
  }

  const handleStoreMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleStoreMenuClose = () => {
    setAnchorEl(null)
  }

  const handleStoreAction = (action: string) => {
    // Handle different store actions here
    handleStoreMenuClose()
  }

  const handleCloseNegativeQuantityDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setShowNegativeQuantityDialog(false)
  }

  const handleConfirmIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // Close dialog first
    setShowNegativeQuantityDialog(false)

    // Then increment the quantity with skipCheckQuantity = true
    handleIncrement(true)
  }

  const isDecrementDisabled = false
  // const isIncrementDisabled = availableQuantity ? quantity >= availableQuantity : false

  return (
    <Card
      onClick={handleCardClick}
      sx={(theme) => ({
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #f0f0f0',
        backgroundColor: isSelected
          ? isDark
            ? theme.palette.primary.dark
            : '#84CAFF'
          : theme.palette.background.default,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '118px',
        maxWidth: '198px',
        width: '171px',
        height: 'auto',
        transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
        // boxShadow: isAnimating
        //   ? '0 8px 24px rgba(132, 202, 255, 0.5)'
        //   : '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          transform: isAnimating ? 'scale(1.1)' : 'translateY(-2px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
        }
      })}
    >
      {/* Color Border */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '5px',
          height: '100%',
          backgroundColor: '#D9D9D9',
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '10px'
        }}
      />
      <CardContent sx={{ padding: '14px 14px 14px 20px' }}>
        {/* Product Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            fontSize: '11px',
            marginBottom: '6px',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {name}
        </Typography>

        {/* Price */}
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: '13px',
            marginBottom: '3px',
            fontWeight: '500'
          }}
        >
          {/* {formatPrice(individualPrice, currency)} */}
          {priceToDecimalPrice(individualPrice?.toString())} {currencySymbol}
        </Typography>

        {/* Available Quantity */}
        {/* {availableQuantity && ( */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '11px',
            marginBottom: '6px'
          }}
        >
          QTY: {quantity}
        </Typography>
        {/* )} */}

        {/* Quantity Controls */}
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: '14px'
          }}
        >
          {allBranches && (
            <IconButton
              onClick={handleStoreMenuClick}
              size="small"
              sx={{
                marginRight: '10px',
                padding: '3px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <StoreIcon fontSize="small" />
            </IconButton>
          )}

          <IconButton
            onClick={handleDecrement}
            disabled={isDecrementDisabled}
            size="small"
            sx={(theme) => ({
              width: '30px',
              height: '30px',
              border: 1,
              borderColor: 'grey.300',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'grey.200'
              },
              '&:disabled': {
                backgroundColor: 'grey.50',
                color: 'grey.400'
              }
            })}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography
            sx={{
              minWidth: '38px',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'text.primary'
            }}
          >
            {selectedItem?.quantity ?? 0}
          </Typography>
          <IconButton
            onClick={() => {
              handleIncrement(false)
            }}
            // disabled={isIncrementDisabled}
            size="small"
            sx={(theme) => ({
              width: '30px',
              height: '30px',
              backgroundColor: true
                ? theme.palette.grey[300]
                : (theme.palette.primary as any)?.[800],
              color: true ? theme.palette.grey[900] : 'white',
              border: 1,
              borderColor: 'grey.300',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'grey.200'
              },
              '&:disabled': {
                backgroundColor: 'grey.50',
                color: 'grey.400'
              }
            })}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
        {/* {allBranches && <Typography variant="body2">{product?.branchName}</Typography>} */}
      </CardContent>

      {/* Store Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleStoreMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            minWidth: 200,
            maxWidth: 300,
            mt: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: '8px'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleStoreAction('view-locations')}>
          {/* <ListItemText primary={t('View Locations')} secondary={t('Check product availability')} /> */}
          {product?.branchName}
        </MenuItem>
      </Menu>

      {/* Negative Quantity Warning Dialog */}
      <Dialog
        open={showNegativeQuantityDialog}
        onClose={handleCloseNegativeQuantityDialog}
        maxWidth="sm"
        fullWidth
        onClick={(e) => e.stopPropagation()}
      >
        {/* <DialogTitle sx={{ textAlign: 'center', color: 'warning.main', fontWeight: 'bold' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <WarningIcon sx={{ fontSize: 28, color: 'warning.main' }} />
            {t('Low Stock Warning')}
          </Box>
        </DialogTitle> */}
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <WarningIcon sx={{ fontSize: 48, color: 'warning.main', opacity: 0.7 }} />
          </Box>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
            {t('This product has low quantity. Do you want to add it to the order?')}
          </Typography>
          <Box
            sx={{
              backgroundColor: 'warning.light',
              borderRadius: 2,
              p: 2,
              mb: 2,
              border: '1px solid',
              borderColor: 'warning.main'
              // opacity: 0.1
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {t('Product')}: <strong>{name}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {t('Available quantity')}: <strong>{quantity}</strong>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
          <Button
            onClick={handleCloseNegativeQuantityDialog}
            variant="outlined"
            color="secondary"
            sx={{ minWidth: 100 }}
          >
            {t('No')}
          </Button>
          <Button
            onClick={handleConfirmIncrement}
            variant="contained"
            color="primary"
            sx={{ minWidth: 100 }}
          >
            {t('Yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default Product
