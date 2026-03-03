import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from '@mui/material'
import React, { useCallback } from 'react'
import useCasherScreen, { ItemType } from '../../hooks/use-casher-screen'
import { Percent as PercentIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
const MAX_DISCOUNT_PERCENTAGE = 10

type DiscountPercentageFieldProps = {
  item: ItemType
}
/** Restricts a number to be within the specified min and max range. */
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const getDiscountedValues = (item: ItemType, nextPercentage: number) => {
  const basePrice = item.individualPrice ?? item.price
  const clampedPercentage = clamp(
    Number.isFinite(nextPercentage) ? nextPercentage : 0,
    0,
    MAX_DISCOUNT_PERCENTAGE
  )

  const discountValue = +(basePrice / ((clampedPercentage + 100) / 100)).toFixed(3)
  const discountedPrice = +Math.max(basePrice - discountValue, 0).toFixed(3)

  return {
    percentage: clampedPercentage,
    discountValue,
    discountedPrice
  }
}

function DiscountPercentageField({ item }: DiscountPercentageFieldProps) {
  const { setOrders, currentOrder } = useCasherScreen()
  const { t } = useTranslation('translation')

  const updateDiscount = useCallback(
    (nextValue: number) => {
      if (!setOrders) return

      setOrders((prev) => {
        const newOrders = [...prev]
        const currentOrderData = newOrders[currentOrder]

        if (!currentOrderData) return prev

        newOrders[currentOrder] = {
          ...currentOrderData,
          items: currentOrderData.items.map((orderItem) => {
            if (orderItem.id !== item.id) return orderItem

            const { percentage, discountValue, discountedPrice } = getDiscountedValues(
              orderItem,
              nextValue
            )
            return {
              ...orderItem,
              price: discountedPrice,
              discountPercentage: percentage,
              discountValue
            }
          })
        }

        return newOrders
      })
    },
    [currentOrder, item.id, setOrders]
  )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value)
    updateDiscount(Number.isNaN(newValue) ? 0 : newValue)
  }

  const handleArrowClick = (delta: number) => {
    updateDiscount((item.discountPercentage ?? 0) + delta)
  }

  const discountPercentage = item.discountPercentage ?? 0

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      onClick={(e) => e.stopPropagation()}
    >
      <Tooltip
        title={t("You can't add discount more than {{max}}%", { max: MAX_DISCOUNT_PERCENTAGE })}
        placement="top"
        disableHoverListener={discountPercentage < MAX_DISCOUNT_PERCENTAGE}
      >
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
        >
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
            {/* <PercentIcon sx={{ fontSize: 12, color: 'text.secondary' }} /> */}
            <input
              className="quantity-input"
              type="number"
              min={0}
              max={MAX_DISCOUNT_PERCENTAGE}
              value={discountPercentage}
              onChange={handleInputChange}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '12px',
                border: 'none'
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '15px',
              height: '100%'
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleArrowClick(1)}
              disabled={discountPercentage >= MAX_DISCOUNT_PERCENTAGE}
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
                '&:disabled': {
                  color: 'grey.300'
                },
                '&:active': {
                  backgroundColor: 'grey.200'
                }
              }}
            >
              <KeyboardArrowUp sx={{ fontSize: 12 }} />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => handleArrowClick(-1)}
              disabled={discountPercentage <= 0}
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
                '&:disabled': {
                  color: 'grey.300'
                },
                '&:active': {
                  backgroundColor: 'grey.200'
                }
              }}
            >
              <KeyboardArrowDown sx={{ fontSize: 12 }} />
            </IconButton>
          </Box>
        </Box>
      </Tooltip>
    </Box>
  )
}

export default DiscountPercentageField
