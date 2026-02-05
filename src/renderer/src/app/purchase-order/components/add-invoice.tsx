import {
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import BranchesField from '@renderer/app/admin-purchase-order/components/branches-field'
import { useGetAllBranchesWithoutPaginationQuery } from '@renderer/app/branches'
import { showSuccessToasts } from '@renderer/components/toasts'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import usePurchaseOrder from '../hooks/use-purchase-order'
import { useAddAdminPurchaseOrderMutation, useAddPurchaseOrderMutation, useUpdateAdminPurchaseOrderMutation, useUpdatePurchaseOrderMutation } from '../services/api'
import calcTotalAmount from '../utils/calc-total-amount'
import { paginationStringConcatenation } from '@renderer/helpers/pagination-string-concatenation'
import { routeName } from '@renderer/shared/routeName'
import { navigateTo } from '@renderer/components/navigation-component'
import { PurchaseStatus } from '@renderer/consts'

// Types
interface ItemType {
  id: string
  name: string
  price: number
  quantity: number
}
type Props = {
  forAdmin?: Boolean
  isJustForReview?: Boolean
}
const AddInvoice = ({ forAdmin, isJustForReview }: Props) => {
  const { t } = useTranslation('translation')
  const navigate = useNavigate()
  const { id: isUpdateOrder } = useParams()

  const [discount, setDiscount] = useState(0)
  // ====================== Hook RTK query ======================
  const [addPurchaseOrder] = useAddPurchaseOrderMutation()
  const [addPurchaseOrderForAdmin] = useAddAdminPurchaseOrderMutation()

  const [updatePurchaseOrder] = useUpdatePurchaseOrderMutation()
  const [updatePurchaseOrderForAdmin] = useUpdateAdminPurchaseOrderMutation()

  const { data: branchesData } = useGetAllBranchesWithoutPaginationQuery(undefined, {
    skip: !forAdmin
  })

  // Get items from purchase order context
  const { orders, setOrders, currentOrder } = usePurchaseOrder()
  const items = orders[currentOrder]?.items || []

  // Calculate totals using utility function
  const orderCalculation = calcTotalAmount(items, {
    taxAmount: 0, // Auto tax (fixed amount)
    discountPercentage: discount
  })
  const { subtotal, taxAmount, discountAmount, totalAmount } = orderCalculation


  // ====================== Check if he can update the order ======================
  const allowedStatusesForCasher = [PurchaseStatus.UNDER_PROCESS, PurchaseStatus.SENT]
  const allowedStatusesForAdmin = [PurchaseStatus.UNDER_PROCESS, PurchaseStatus.IN_PROGRESS]

  const canUpdateOrder = () => {
    if (isJustForReview) return false

    if (forAdmin) {
      return allowedStatusesForAdmin.includes(orders[currentOrder]?.status as PurchaseStatus)
    } else {
      return allowedStatusesForCasher.includes(orders[currentOrder]?.status as PurchaseStatus)
    }
  }

  // Check if confirm button should be enabled
  const isConfirmEnabled = items.length > 0

  const handleQuantityChange = (itemId: string, change: number) => {
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

  // ======================== On reset ======================== //
  const onReset = () => {
    if (!setOrders || currentOrder === undefined) return
    setOrders((prev) => {
      const newOrders = [...prev]
      newOrders[currentOrder] = { ...newOrders[currentOrder], items: [] }
      return newOrders
    })
    navigateTo(paginationStringConcatenation(forAdmin ? routeName.ADMIN_PURCHASE_ORDER : routeName.ALL_PURCHASE_ORDER))
  }

  // ======================== On confirm ======================== //
  const onConfirm = () => {
    if (!setOrders || currentOrder === undefined) return

    let funcOrder: any;
    if (forAdmin) {
      if (isUpdateOrder) {
        funcOrder = updatePurchaseOrderForAdmin
      } else {
        funcOrder = addPurchaseOrderForAdmin
      }
    } else {
      if (isUpdateOrder) {
        funcOrder = updatePurchaseOrder
      } else {
        funcOrder = addPurchaseOrder
      }
    }
    // ====================== fun send data ======================
    funcOrder({
      items: items.map((item) => ({
        productGuid: item.id,
        quantity: item.quantity
      })),
      pos: orders[0]?.branchId ?? isUpdateOrder,
      id: isUpdateOrder ? isUpdateOrder : undefined
    })
      .unwrap()
      .then(() => {
        onReset()
        showSuccessToasts(
          isUpdateOrder
            ? t('Purchase order updated successfully')
            : t('Purchase order added successfully')
        )
        navigate(paginationStringConcatenation(forAdmin ? routeName.ADMIN_PURCHASE_ORDER : routeName.ALL_PURCHASE_ORDER))
      })
  }
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        // border: '1px solid #dadce0',
        borderTopLeftRadius: currentOrder === 0 ? '0' : '8px'
      }}
    >      <CardContent sx={{ flex: 1, padding: 3 }}>
        <Stack
          direction="column"
          justifyContent={'space-between'}
          sx={{ height: '90%', maxHeight: '90%' }}
        >
          <div>
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ marginBottom: 3 }}
            >
              <Typography variant="h5" fontWeight="bold">
                {t('bill_number')}:
                {orders[currentOrder]?.billNumber}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" color="primary.main" fontWeight="500">
                  {getCurrentDate()}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" sx={{ marginBottom: "20px" }} spacing={0.5}>
              <Typography>طلبية من فرع </Typography>
              <Typography variant='h5' sx={{ fontWeight: "bold" }}>{orders[currentOrder]?.branch}</Typography>
              {orders[currentOrder]?.customerName && <>
                <Typography>للزبون </Typography>
                <Typography variant='h5'>{orders[currentOrder]?.customerName}</Typography></>
              }
            </Stack>

            {/* Cart Items Section */}
            {/* <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>
              {t('Cart Items')}
            </Typography> */}
            {false && (  // TODO: remove this after testing 
              <BranchesField
                branches={branchesData?.data}
                onBranchSelect={(e) => {
                  if (setOrders)
                    setOrders((prev) => {
                      const newOrders = [...prev]
                      newOrders[currentOrder] = { ...newOrders[currentOrder], branchId: e }
                      return newOrders
                    })
                }}
              />
            )}
            {/* Cart Items Header */}
            <Stack direction="row" justifyContent="space-between" sx={{ marginBottom: 2 }}>
              <Typography variant="body2" fontWeight="bold" color="text.secondary" sx={{ flex: 2 }}>
                {t("Items")}
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
              <Box sx={{ width: '40px' }} />
            </Stack>

            {/* Cart Items List */}
            <Stack
              spacing={1}
              sx={{ marginBottom: 3, maxHeight: '300px', minHeight: '250px', overflowY: 'auto' }}
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
                  <Stack
                    key={item.id}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      padding: 1,
                      borderRadius: 1,
                      backgroundColor: 'grey.50',
                      border: '1px solid',
                      borderColor: 'grey.200'
                    }}
                  >
                    {/* Item Info */}
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 2 }}>
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
                      <Typography variant="body2" fontWeight="500" sx={{ fontSize: '12px' }}>
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
                        width: '60px',
                        height: '36px',
                        overflow: 'hidden'
                      }}
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
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          sx={{
                            fontSize: '16px',
                            color: 'primary.main',
                            minWidth: '20px',
                            textAlign: 'center'
                          }}
                        >
                          {item.quantity}
                        </Typography>
                      </Box>

                      {/* Arrow Controls */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '24px',
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
                          <KeyboardArrowUpIcon sx={{ fontSize: 14 }} />
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
                          <KeyboardArrowDownIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Price */}
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ width: '80px', textAlign: 'right', fontSize: '12px' }}
                    >
                      {(item.price * item.quantity).toLocaleString()}
                    </Typography>


                    <IconButton
                      size="small"
                      onClick={() => handleRemoveItem(item.id)}
                      sx={{ width: '24px', height: '24px', color: 'error.main' }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Stack>
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

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">{t('Discount')}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {discount}%
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
            {/* {!isJustForReview && canUpdateOrder() && <Stack direction="row" spacing={1}> */}
            {canUpdateOrder() && <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={onReset}
                sx={{
                  flex: 1,
                  backgroundColor: 'error.main',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: 'error.dark' }
                }}
              >
                {t('Reset')}
              </Button>

              <Button
                variant="contained"
                onClick={onConfirm}
                disabled={!isConfirmEnabled}
                sx={{
                  flex: 1,
                  backgroundColor: isConfirmEnabled ? 'success.main' : 'grey.400',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: isConfirmEnabled ? 'success.dark' : 'grey.400'
                  },
                  '&:disabled': {
                    backgroundColor: 'grey.400',
                    color: 'white'
                  }
                }}
              >
                {t('Confirm')}
              </Button>
            </Stack>}
          </div>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default AddInvoice
