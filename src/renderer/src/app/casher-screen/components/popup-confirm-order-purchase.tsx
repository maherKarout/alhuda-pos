import InfoIcon from '@mui/icons-material/Info'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { useAddPurchaseOrderMutation } from '@renderer/app/purchase-order'
import SimpleDialog from '@renderer/components/dialog'
import { showSuccessToasts } from '@renderer/components/toasts'
import { getSelectedBranchName } from '@renderer/helpers/get-set-branch-data'
import { useTranslation } from 'react-i18next'
import useCasherScreen from '../hooks/use-casher-screen'
import GenericButton from '@renderer/components/generic-button'

interface ProductItem {
  productName: string
  quantity: number
}

interface PopupConfirmOrderPurchaseProps {
  open: boolean
  setOpen: (open: boolean) => void
  onReset: Function,

  isRefundPurchaseOrder?: boolean
}

function PopupConfirmOrderPurchase({ open, setOpen, onReset, isRefundPurchaseOrder }: PopupConfirmOrderPurchaseProps) {
  const { t } = useTranslation('translation')
  const { setOrders, currentOrder, orders } = useCasherScreen()
  const [addPurchaseOrder, { isLoading, isError, error, isSuccess }] = useAddPurchaseOrderMutation()

  const items = orders[currentOrder]?.items
  const customer = orders[currentOrder]?.customerId
  const handleConfirm = () => {
    onConfirm()
    // setOpen(false)
  }

  // ======================== On confirm ======================== //
  const onConfirm = () => {
    if (!setOrders || currentOrder === undefined) return
    const funcOrder = addPurchaseOrder
    funcOrder({
      isRefund: isRefundPurchaseOrder,
      customer: customer ?? undefined,
      items: items.map((item) => ({
        productGuid: item.id,
        quantity: item.quantity,
        itemNote: item.note
      }))
    })
      .unwrap()
      .then(() => {
        showSuccessToasts(t('Purchase order added successfully'))
        onReset()
        setOpen(false)
      }).catch(() => { setOpen(false) })
  }
  return (
    <SimpleDialog
      open={open}
      setOpen={() => { }}
      PaperProps={{
        sx: {
          minWidth: '400px',
          maxWidth: '500px',
          p: 3,
          borderRadius: '12px'
        }
      }}
    >
      <Stack spacing={3} alignItems="center">
        {/* Info Icon */}
        <Box
          sx={(theme) => ({
            width: 64,
            height: 64,
            borderRadius: '8px',
            backgroundColor: (theme) => theme.palette.action.hover,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          })}
        >
          <InfoIcon sx={{ fontSize: 40, color: '#2196F3' }} />
        </Box>

        {/* Title */}
        <Typography variant="h3" textAlign="center" fontWeight={500} px={2}>
          {t('Are you sure you want to submit this request to the admin?') ||
            'Are you sure you want to submit this request to the admin?'}
        </Typography>

        {/* Details Box */}
        <Box
          sx={(theme) => ({
            width: '100%',
            backgroundColor: (theme) => theme.palette.action.hover,
            borderRadius: '8px',
            p: 2
          })}
        >
          <Stack spacing={1.5}>
            {/* Branch */}
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary" fontSize={14}>
                {t('Branch') || 'Branch'}
              </Typography>
              <Typography fontWeight={500} fontSize={14}>
                {getSelectedBranchName()}
              </Typography>
            </Stack>



            {/* Divider */}
            <Divider sx={{ my: 1 }} />

            {/* Products Header */}
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary" fontSize={14} fontWeight={500}>
                {t('Product Name') || 'Product Name'}
              </Typography>
              <Typography color="text.secondary" fontSize={14} fontWeight={500}>
                {t('QTY') || 'QTY'}
              </Typography>
            </Stack>

            {/* Products List */}
            {items.map((product, index) => (
              <Stack key={index} direction="row" justifyContent="space-between">
                <Typography fontSize={14}>{product.name}</Typography>
                <Typography fontSize={14}>{product.quantity}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} width="100%">
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setOpen(false)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: 14,
              py: 1
            }}
          >
            {t('Cancel') || 'Cancel'}
          </Button>
          {/* <Button
            fullWidth
            variant="contained"
            onClick={handleConfirm}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: 14,
              py: 1
            }}
          >
            {t('Confirm') || 'Confirm'}
          </Button> */}
          <GenericButton title={t("Confrim")} loading={isLoading} onClick={handleConfirm} />
        </Stack>
      </Stack>
    </SimpleDialog>
  )
}

export default PopupConfirmOrderPurchase
