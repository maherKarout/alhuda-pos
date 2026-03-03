import {
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

// Import SVG icons
import GenericButton from '@renderer/components/generic-button'
import { showSuccessToasts } from '@renderer/components/toasts'
import { TypeOrder } from '@renderer/consts'
import { decimalPriceToNumber, priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
import useUpdateCasherBox from '@renderer/hooks/use-update-casher-box'
import useIsUpdateCustomerOrder from '../../hooks/use-is-update-customer-order'
import { TBodyRefund, useSendRefundOrderMutation } from '../../services/api'
import useCasherScreen from '../../hooks/use-casher-screen'
import calcTotalAmount from '../../utils/calc-total-amount'
import AutoCompleteCustomerField from '../auto-complete-customer-field'
import DiscountPercentageField from '../dsicount/discount-percentage-field'
import RefundOrderPopup from '../refund/refund-orders-popup'
import PopupPayLater from '../popup-pay-later'
import PopupConfirmOrderPurchase from '../popup-confirm-order-purchase'
import AccordionWrapper from './accordion-wrapper'
import { Percent as PercentIcon } from '@mui/icons-material'

interface AddInvoiceProps {
  onCustomerSelect?: (customerId: string) => void
}

const AddInvoice: React.FC<AddInvoiceProps> = ({ onCustomerSelect }) => {
  const { t } = useTranslation('translation')
  const updateCasherBox = useUpdateCasherBox()

  const isUpdateCustomerOrder = useIsUpdateCustomerOrder()

  const [openPopupConfirmOrderPurchase, setOpenPopupConfirmOrderPurchase] = useState(false)
  const [openPopupConfirmRefundOrderPurchase, setOpenPopupRefundConfirmOrderPurchase] =
    useState(false)
  const [openPopupRefundOrder, setOpenPopupRefundOrder] = useState(false)
  const [openPopupPayLater, setOpenPopupPayLater] = useState(false)
  const [isRefundMode, setIsRefundMode] = useState(false)
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({})
  const [expandedAccordionItemId, setExpandedAccordionItemId] = useState<string | null>(null)

  const [sendRefund, { isLoading: isLoadingRefund }] = useSendRefundOrderMutation()

  // Get items from casher screen context
  const { orders, setOrders, currentOrder, discount, setDiscount, allBranches } = useCasherScreen()
  const items = orders[currentOrder]?.items || []

  const orderCalculation = calcTotalAmount(items, {
    taxAmount: 0, // Auto tax (fixed amount)
    discountType: discount?.type,
    discountAmount: discount?.amount
  })
  const { subtotal, taxAmount, discountAmount, totalAmount } = orderCalculation

  // Check if confirm button should be enabled
  const isConfirmEnabled = items.length > 0 && orders[currentOrder]?.customerId
  const isConfirmRefundPurcahseOrder = items.length > 0

  const handleQuantityChange = (itemId: string, change: number, resetOldValue: boolean = false) => {
    if (!setOrders || currentOrder === undefined) return

    setOrders((prev) => {
      const newOrders = [...prev]
      const currentOrderData = newOrders[currentOrder]

      if (!currentOrderData) return prev

      newOrders[currentOrder] = {
        ...currentOrderData,
        items: currentOrderData.items
          .map((item) => {
            if (item.id === itemId) {
              if (resetOldValue) {
                const newQuantity = Math.max(0, change)
                return { ...item, quantity: newQuantity }
              }
              const newQuantity = Math.max(0, item.quantity + change)
              return { ...item, quantity: newQuantity }
            }
            return item
          })
          .filter((item) => item.quantity > 0) // Remove items with 0 quantity
      }

      return newOrders
    })
  }

  const handleRemoveItem = (itemId: string) => {
    if (!setOrders || currentOrder === undefined) return

    setOrders((prev) => {
      const newOrders = [...prev]
      const currentOrderData = newOrders[currentOrder]

      if (!currentOrderData) return prev

      newOrders[currentOrder] = {
        ...currentOrderData,
        items: currentOrderData.items.filter((item) => item.id !== itemId)
      }

      return newOrders
    })
  }

  const getCurrentDate = () => {
    const now = new Date()
    return (
      now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) +
      ', ' +
      now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    )
  }
  const onConfirm = (type?: TypeOrder) => {
    if (!setOrders || currentOrder === undefined) return
    setOrders((prev) => {
      const newOrders = [...prev]
      newOrders[currentOrder] = {
        ...newOrders[currentOrder],
        currentStep: newOrders[currentOrder].currentStep + 1,
        type: type ?? TypeOrder.NORMAL
      }
      return newOrders
    })
  }
  // ======================== On reset ======================== //
  const onReset = () => {
    if (!setOrders || currentOrder === undefined) return
    setOrders((prev) => {
      const newOrders = [...prev]
      newOrders[currentOrder] = { ...newOrders[currentOrder], items: [] }
      return newOrders
    })
  }

  // Refund mode handlers
  const handleRefundClick = () => {
    if (!isRefundMode) {
      // Enter refund mode
      setIsRefundMode(true)
      // Initialize edited prices with current prices
      const initialPrices: Record<string, number> = {}
      items.forEach((item) => {
        initialPrices[item.id] = item.price * item.quantity
      })
      setEditedPrices(initialPrices)
    } else {
      // Confirm refund
      handleConfirmRefund()
    }
  }

  const handleBackFromRefund = () => {
    setIsRefundMode(false)
    setEditedPrices({})
  }

  const handlePriceChange = (itemId: string, newPrice: string) => {
    const price = parseFloat(newPrice) || 0
    setEditedPrices((prev) => ({
      ...prev,
      [itemId]: price
    }))
  }

  // ====================== Handel change individual price ======================
  const handelChangeIndividualPrice = (itemId: string, newPrice: string) => {
    const price = parseFloat(newPrice) || 0
    if (!setOrders || currentOrder === undefined) return
    setOrders((prev) => {
      const newOrders = [...prev]
      const currentOrderData = newOrders[currentOrder]
      if (!currentOrderData) return prev
      newOrders[currentOrder] = {
        ...currentOrderData,
        items: currentOrderData.items.map((item) =>
          item.id === itemId ? { ...item, price: price } : item
        )
      }
      return newOrders
    })
  }

  const handleConfirmRefund = () => {
    // Update items with new prices
    if (!setOrders || currentOrder === undefined) return
    const newData: TBodyRefund = {
      customer: orders[currentOrder]?.customerId,
      items: orders[currentOrder]?.items?.map((item) => ({
        productGuid: item.id,
        quantity: item.quantity
      })),
      amount: {
        syp: Object.keys(editedPrices).reduce((acc, key) => acc + editedPrices[key], 0) || 0,
        usd: 0
      }
    }
    sendRefund(newData)
      .unwrap()
      .then((res) => {
        updateCasherBox()
        showSuccessToasts(t('Refunded successfully'))
      })
    // Exit refund mode
    setIsRefundMode(false)
    setEditedPrices({})
  }

  return (
    <Card
      sx={{
        height: 'calc(100vh - 110px)',
        display: 'flex',
        flexDirection: 'column',
        // border: '1px solid #dadce0',
        borderTopLeftRadius: currentOrder === 0 ? '0' : '8px',
        overflowY: 'auto'
      }}
    >
      <CardContent sx={{ flex: 1, padding: 3 }}>
        <Stack
          direction="column"
          justifyContent={'space-between'}
          sx={{ height: '100%', maxHeight: '100%', pt: 0 }}
        >
          <div>
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ marginBottom: 1 }}
            >
              <Typography variant="h5" fontWeight="bold">
                {t('Add invoice')}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" color="primary.main" fontWeight="500">
                  {getCurrentDate()}
                </Typography>
              </Stack>
            </Stack>

            {/* Customer Search with Autocomplete */}
            <AutoCompleteCustomerField />

            {/* Cart Items Header */}
            <Stack direction="row" justifyContent="space-between" sx={{ marginBottom: 2 }}>
              <Typography variant="body2" fontWeight="bold" color="text.secondary" sx={{ flex: 2 }}>
                {t('Items')}
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
                sx={{ width: '60px', textAlign: 'center' }}
              >
                {t('QTY')}
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
                sx={{ width: '80px', textAlign: 'right' }}
              >
                {t('Price')}
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
                sx={{ width: '60px', textAlign: 'center' }}
              >
                {t('Dis')}
                <PercentIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
                sx={{ width: '80px', textAlign: 'right' }}
              >
                {t('total')}
              </Typography>

              <Box sx={{ width: '40px' }} />
            </Stack>

            {/* Cart Items List */}
            <Stack
              spacing={1}
              sx={{ marginBottom: 3, maxHeight: '100%', minHeight: '140px', overflowY: 'auto' }}
            >
              {items.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ padding: 2 }}
                >
                  {t('No items in cart')}
                </Typography>
              ) : (
                items.map((item, index) => (
                  <AccordionWrapper
                    key={item.id}
                    item={item}
                    index={index}
                    expandedItemId={expandedAccordionItemId}
                    onToggle={(itemId) => setExpandedAccordionItemId(itemId)}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        padding: 0.8,
                        borderRadius: 1,
                        backgroundColor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        marginBottom: '0px',
                        width: '100%'
                      }}
                    >
                      {/* Item Info */}
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                        <Chip
                          label={String(index + 1).padStart(2, '0')}
                          size="small"
                          sx={{
                            backgroundColor: '#84CAFF',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '10px',
                            minWidth: '24px',
                            height: '24px'
                          }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight="500"
                          sx={{
                            fontSize: '12px',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal',
                            maxWidth: '100%'
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Stack>

                      {/* Quantity Controls */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: 'white',
                          border: '1px solid',
                          borderColor: 'grey.300',
                          borderRadius: '9px',
                          width: '40px',
                          height: '30px',
                          overflow: 'hidden'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Quantity Display */}
                        <Box
                          sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            borderRight: '1px solid',
                            borderColor: 'grey.200'
                          }}
                        >
                          <input
                            className="quantity-input"
                            onChange={(e) =>
                              handleQuantityChange(item.id, parseInt(e.target.value), true)
                            }
                            value={item.quantity}
                            style={{
                              display: 'block',
                              width: '100%',
                              textAlign: 'center'
                            }}
                          />
                        </Box>

                        {/* Arrow Controls */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '15px',
                            height: '100%'
                          }}
                        >
                          {/* Up Arrow */}
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            sx={{
                              width: '100%',
                              height: '50%',
                              borderRadius: 0,
                              backgroundColor: 'transparent',
                              color: 'grey.500',
                              '&:hover': {
                                backgroundColor: 'grey.100',
                                color: 'primary.main'
                              },
                              '&:active': {
                                backgroundColor: 'grey.200'
                              }
                            }}
                          >
                            <KeyboardArrowUpIcon sx={{ fontSize: 12 }} />
                          </IconButton>

                          {/* Down Arrow */}
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            sx={{
                              width: '100%',
                              height: '50%',
                              borderRadius: 0,
                              backgroundColor: 'transparent',
                              color: 'grey.500',
                              '&:hover': {
                                backgroundColor: 'grey.100',
                                color: 'primary.main'
                              },
                              '&:active': {
                                backgroundColor: 'grey.200'
                              }
                            }}
                          >
                            <KeyboardArrowDownIcon sx={{ fontSize: 12 }} />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* individual price per item */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        sx={{ width: '80px', justifyContent: 'center' }}
                      >
                        {!item.openPrice ? (
                          <Typography variant="caption" color="text.secondary">
                            {/* {false ? (<Typography variant="caption" color="text.secondary"> */}
                            {priceToDecimalPrice(item.price.toString())}
                          </Typography>
                        ) : (
                          <Tooltip title="You can modify price this item" arrow>
                            <TextField
                              value={priceToDecimalPrice(item.price?.toString() || '0')}
                              onClick={(e: any) => {
                                e.stopPropagation()
                              }}
                              onChange={(e) =>
                                handelChangeIndividualPrice(
                                  item.id,
                                  decimalPriceToNumber(e.target.value) + ''
                                )
                              }
                              size="small"
                              sx={{
                                marginX: '5px',
                                minWidth: '60px',
                                '& .MuiInputBase-root': {
                                  paddingRight: '0px !important'
                                },
                                '& .MuiInputBase-input': {
                                  textAlign: 'center',
                                  fontSize: '12px',
                                  paddingY: '6px !important',
                                  paddingX: '1px !important'
                                  // width: `${Math.max(40, (priceToDecimalPrice(item.individualPrice?.toString() || '0').length * 8) + 8)}px`,
                                  // minWidth: '60px'
                                }
                              }}
                              type="text"
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </Tooltip>
                        )}
                      </Stack>

                      {/* Discount */}
                      <Stack sx={{ width: '60px', alignItems: 'center' }}>
                        <DiscountPercentageField item={item} />
                      </Stack>

                      {/* Total Price */}
                      {isRefundMode ? (
                        <TextField
                          value={priceToDecimalPrice(
                            editedPrices[item.id]?.toString() || item.price?.toString() || '0'
                          )}
                          onChange={(e) =>
                            handlePriceChange(item.id, decimalPriceToNumber(e.target.value) + '')
                          }
                          size="small"
                          sx={{
                            marginX: '5px',
                            '& .MuiInputBase-input': {
                              textAlign: 'right',
                              fontSize: '12px',
                              padding: '6px',
                              paddingX: '3px',
                              minWidth: 'fit-content',
                              maxWidth: '80px'
                            }
                          }}
                          type="text"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          sx={{ width: '80px', textAlign: 'right', fontSize: '12px' }}
                        >
                          {priceToDecimalPrice((item.price * item.quantity).toString())}
                        </Typography>
                      )}

                      {/* Delete Button */}
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(item.id)}
                        sx={{
                          width: '24px',
                          height: '24px',
                          color: 'error.main',
                          marginLeft: '5px'
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                  </AccordionWrapper>
                ))
              )}
            </Stack>
          </div>
          <div>
            {/* Invoice Summary */}
            <Box sx={{ marginBottom: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ marginBottom: 1 }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {t('Invoice')}
                </Typography>
                {/* <Button
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'none', fontSize: '12px' }}
                >
                  {t('Add Discount')}
                </Button> */}
              </Stack>

              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">{t('Tax')}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    SYP{taxAmount.toLocaleString()}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">{t('subtotal')}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    SYP{subtotal.toLocaleString()}
                  </Typography>
                </Stack>

                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" fontWeight="bold">
                    {t('Total amount')} (SYP)
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary.main">
                    {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" spacing={1}>
              {isRefundMode ? (
                // Refund mode buttons
                <>
                  <GenericButton
                    title="Back"
                    onClick={handleBackFromRefund}
                    color="secondary"
                    sx={{
                      fontSize: '12px',
                      flex: 1,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  />
                  <GenericButton
                    title="Confirm Refund"
                    onClick={handleRefundClick}
                    color="success"
                    sx={{
                      fontSize: '12px',
                      flex: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      backgroundColor: 'success.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'success.dark'
                      }
                    }}
                  />
                </>
              ) : (
                // Normal mode buttons
                <>
                  <GenericButton
                    title={isUpdateCustomerOrder ? t('Update Customer Order') : t('customer order')}
                    onClick={() => onConfirm(TypeOrder.RESERVATION)}
                    disabled={!isConfirmEnabled || allBranches}
                    // color="success"
                    sx={{
                      fontSize: '12px',
                      flex: 1,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      backgroundColor: isConfirmEnabled ? 'primary.main' : 'grey.400',
                      color: 'white',
                      // '&:hover': {
                      //   backgroundColor: isConfirmEnabled ? 'success.dark' : 'grey.400'
                      // },
                      '&:disabled': {
                        backgroundColor: 'grey.400',
                        color: 'white'
                      }
                    }}
                  />
                  <GenericButton
                    title="purchase order"
                    onClick={() => setOpenPopupConfirmOrderPurchase(true)}
                    disabled={items.length <= 0}
                    sx={{
                      fontSize: '12px',
                      width: 'fit-content',
                      flex: 1,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      backgroundColor: items.length >= 0 ? 'primary.main' : 'grey.400',
                      color: 'white',
                      // '&:hover': {
                      //   backgroundColor: items.length >= 0 ? 'success.dark' : 'grey.400'
                      // },
                      '&:disabled': {
                        backgroundColor: 'grey.400',
                        color: 'white'
                      }
                    }}
                  />
                  <GenericButton
                    title="مترجع مشتريات"
                    onClick={() => setOpenPopupRefundConfirmOrderPurchase(true)}
                    disabled={!isConfirmRefundPurcahseOrder}
                    loading={isLoadingRefund}
                    color="warning"
                    sx={{
                      flex: 1,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      color: 'white',
                      '&:disabled': {
                        backgroundColor: 'grey.400',
                        color: 'white'
                      }
                    }}
                  />
                  <GenericButton
                    title="Reset"
                    color="error"
                    onClick={onReset}
                    sx={{
                      fontSize: '12px',
                      flex: 1,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  />

                  <GenericButton
                    title="refund"
                    onClick={handleRefundClick}
                    disabled={!isConfirmEnabled}
                    loading={isLoadingRefund}
                    color="warning"
                    sx={{
                      flex: 1,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      backgroundColor: isConfirmEnabled ? 'warning.main' : 'grey.400',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: isConfirmEnabled ? 'warning.dark' : 'grey.400'
                      },
                      '&:disabled': {
                        backgroundColor: 'grey.400',
                        color: 'white'
                      }
                    }}
                  />
                  <GenericButton
                    title="cache"
                    onClick={() => onConfirm(TypeOrder.NORMAL)}
                    disabled={!isConfirmEnabled || allBranches}
                    color="success"
                    sx={{
                      fontSize: '12px',
                      flex: 1,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      backgroundColor: isConfirmEnabled ? 'success.main' : 'grey.400',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: isConfirmEnabled ? 'success.dark' : 'grey.400'
                      },
                      '&:disabled': {
                        backgroundColor: 'grey.400',
                        color: 'white'
                      }
                    }}
                  />
                </>
              )}
            </Stack>
          </div>
        </Stack>
        <RefundOrderPopup open={openPopupRefundOrder} setOpen={setOpenPopupRefundOrder} />
        <PopupPayLater open={openPopupPayLater} setOpen={setOpenPopupPayLater} />
        <PopupConfirmOrderPurchase
          open={openPopupConfirmOrderPurchase || openPopupConfirmRefundOrderPurchase}
          setOpen={(b) => {
            setOpenPopupConfirmOrderPurchase(b)
            setOpenPopupRefundConfirmOrderPurchase(b)
          }}
          onReset={onReset}
          isRefundPurchaseOrder={!!openPopupConfirmRefundOrderPurchase}
        />
      </CardContent>
    </Card>
  )
}

export default AddInvoice
