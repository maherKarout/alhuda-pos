import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import usePurchaseOrder from '../hooks/use-purchase-order'
import { priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
import StoreIcon from '@mui/icons-material/Store'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import InventoryIcon from '@mui/icons-material/Inventory'
import { TProduct } from '@renderer/app/casher-screen/hooks/use-get-all-products'
import { useTranslation } from 'react-i18next'

// Product interface
export interface ProductProps {
  product: TProduct
}

const Product = ({ product }: ProductProps) => {
  const { t } = useTranslation('translation')
  const { setOrders, orders, currentOrder, allBranches } = usePurchaseOrder()
  const items = orders[currentOrder]?.items || []
  const selectedItem = items.find((item) => item.id === product.id)
  const { id, name, individualPrice } = product
  const quantity = 10
  const isSelected = Boolean(selectedItem) // Check if product is in cart

  const [isAnimating, setIsAnimating] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
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

  const handleIncrement = () => {
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
        newOrders[currentOrder] = {
          ...currentOrderData,
          items: [
            ...currentOrderData.items,
            { id, name, price: individualPrice, quantity: 1, code: product.code, individualPrice: individualPrice, openPrice: product.openPrice ?? false }
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

  const handleCardClick = () => {
    handleIncrement()
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

  const formatPrice = (individualPrice: number, currency: string) => {
    return `${currency} ${individualPrice?.toLocaleString()}`
  }

  const isDecrementDisabled = quantity <= 0
  // const isIncrementDisabled = availableQuantity ? quantity >= availableQuantity : false

  return (
    <Card
      onClick={handleCardClick}
      sx={(theme) => ({
        borderRadius: '12px',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 2px 8px rgba(0,0,0,0.3)'
          : '0 2px 8px rgba(0,0,0,0.1)',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: isSelected
          ? theme.palette.mode === 'dark'
            ? theme.palette.primary.main
            : '#84CAFF'
          : theme.palette.background.paper,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '120px',
        maxWidth: '200px',
        width: '173px',
        height: '147px',
        transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
        '&:hover': {
          transform: isAnimating ? 'scale(1.1)' : 'translateY(-2px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 16px rgba(0,0,0,0.5)'
            : '0 4px 16px rgba(0,0,0,0.15)'
        }
      })}
    >
      {/* Color Border */}
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '6px',
          height: '100%',
          backgroundColor: theme.palette.mode === 'dark'
            ? theme.palette.grey[700]
            : theme.palette.grey[300],
          borderTopLeftRadius: '12px',
          borderBottomLeftRadius: '12px'
        })}
      />
      <CardContent sx={{ padding: '16px 16px 16px 22px' }}>
        {/* Product Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            fontSize: '12px',
            marginBottom: '8px',
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
            fontSize: '14px',
            marginBottom: '4px',
            fontWeight: '500'
          }}
        >
          {/* {formatPrice(individualPrice, currency)} */}
          {priceToDecimalPrice(individualPrice?.toString())}
        </Typography>

        {/* Available Quantity */}
        {/* {availableQuantity && ( */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '12px',
            marginBottom: '8px'
          }}
        >
          {/* QTY: {quantity} */}
        </Typography>
        {/* )} */}

        {/* Quantity Controls */}
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: '16px'
          }}
        >
          {allBranches && (
            <IconButton
              onClick={handleStoreMenuClick}
              size="small"
              sx={(theme) => ({
                marginRight: '12px',
                padding: '4px',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)'
                }
              })}
            >
              <StoreIcon fontSize="small" />
            </IconButton>
          )}

          <IconButton
            onClick={handleDecrement}
            disabled={isDecrementDisabled}
            size="small"
            sx={(theme) => ({
              width: '32px',
              height: '32px',
              border: 1,
              borderColor: 'divider',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? theme.palette.grey[700]
                  : theme.palette.grey[200]
              },
              '&:disabled': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? theme.palette.grey[800]
                  : theme.palette.grey[50],
                color: theme.palette.mode === 'dark'
                  ? theme.palette.grey[600]
                  : theme.palette.grey[400]
              }
            })}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography
            sx={{
              minWidth: '40px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'text.primary'
            }}
          >
            {selectedItem?.quantity ?? 0}
          </Typography>
          <IconButton
            onClick={handleIncrement}
            // disabled={isIncrementDisabled}
            size="small"
            sx={(theme) => ({
              width: '32px',
              height: '32px',
              backgroundColor: theme.palette.mode === 'dark'
                ? theme.palette.grey[700]
                : theme.palette.grey[300],
              color: theme.palette.mode === 'dark'
                ? theme.palette.text.primary
                : theme.palette.grey[900],
              border: 1,
              borderColor: 'divider',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? theme.palette.grey[600]
                  : theme.palette.grey[200]
              },
              '&:disabled': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? theme.palette.grey[800]
                  : theme.palette.grey[50],
                color: theme.palette.mode === 'dark'
                  ? theme.palette.grey[600]
                  : theme.palette.grey[400]
              }
            })}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>

      {/* Store Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleStoreMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: (theme) => ({
            minWidth: 200,
            maxWidth: 300,
            mt: 1,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(0,0,0,0.5)'
              : '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: '8px'
          })
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleStoreAction('view-locations')}>
          <ListItemIcon>
            <LocationOnIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('View Locations')} secondary={t('Check product availability')} />
        </MenuItem>

        <MenuItem onClick={() => handleStoreAction('inventory-details')}>
          <ListItemIcon>
            <InventoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('Inventory Details')} secondary={t('Stock levels and info')} />
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => handleStoreAction('transfer-stock')}>
          <ListItemIcon>
            <StoreIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('Transfer Stock')} secondary={t('Move between branches')} />
        </MenuItem>

        <MenuItem onClick={() => handleStoreAction('stock-history')}>
          <ListItemIcon>
            <InventoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('Stock History')} secondary={t('View movement history')} />
        </MenuItem>
      </Menu>
    </Card>
  )
}

export default Product
