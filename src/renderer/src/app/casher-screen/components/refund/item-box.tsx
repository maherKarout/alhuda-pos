import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'
import { TResponseInvoiceById } from '@renderer/app/invoices'
import { priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
import { useTranslation } from 'react-i18next'
import { useFormikContext } from 'formik'
import { TInitialValuesType } from './refund-orders-popup'

type Props = {
  item: TResponseInvoiceById['products'][0]
  index: number
}

function ItemBox({ item, index }: Props) {
  const { values, setFieldValue } = useFormikContext<TInitialValuesType>()
  const { t } = useTranslation('translation')

  const selectedItem = values?.items.find((i) => i.guid === item.guid)
  const isSelected = Boolean(selectedItem) // Check if product is in cartisAnimating
  const isAnimating = false
  const isDecrementDisabled = item.quantity <= 0

  const handleIncrement = () => {
    const newQuantity = item.quantity + 1
    if (newQuantity <= Number(item.mainQuantity))
      setFieldValue(`items[${index}].quantity`, newQuantity)
  }
  const handleDecrement = () => {
    const newQuantity = item.quantity - 1
    if (item.mainQuantity ?? (0 > newQuantity && newQuantity !== 0))
      setFieldValue(`items[${index}].quantity`, newQuantity)
  }

  return (
    <Card
      //   onClick={handleCardClick}
      sx={{
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #f0f0f0',
        backgroundColor: isSelected ? '#84CAFF' : 'white',
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
      }}
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
          {item.productName}
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
          {priceToDecimalPrice(item.unitPrice?.toString())}
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
          {t('QTY')}: {item.mainQuantity}
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
            onClick={handleIncrement}
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
    </Card>
  )
}

export default ItemBox
