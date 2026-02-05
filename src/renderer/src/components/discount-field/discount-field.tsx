import React, { useState, useRef } from 'react'
import { Box, TextField, MenuItem, IconButton, Menu, Button } from '@mui/material'
import { KeyboardArrowDown } from '@mui/icons-material'
import { DiscountType } from '@renderer/consts'

interface DiscountFieldProps {
  value?: number
  type?: DiscountType
  onChange?: (value: number, type: DiscountType) => void
  disabled?: boolean
  placeholder?: string
  width?: string | number
  widthInput?: string | number
  widthSelection?: string | number
}

const DiscountField: React.FC<DiscountFieldProps> = ({
  value = 0,
  type = DiscountType.PERCENTAGE,
  onChange,
  disabled = false,
  placeholder = 'Enter discount',
  width = '120px',
  widthInput = '100px',
  widthSelection = '40px'
}) => {
  const [discountType, setDiscountType] = useState<DiscountType>(type)
  const [discountValue, setDiscountValue] = useState<string>(value.toString())
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setDiscountValue(newValue)

    const numericValue = parseFloat(newValue) || 0
    onChange?.(numericValue, discountType)
  }

  const handleTypeChange = (newType: DiscountType) => {
    setDiscountType(newType)
    setAnchorEl(null)

    const numericValue = parseFloat(discountValue) || 0
    onChange?.(numericValue, newType)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        border: '1px solid #E0E0E0',
        borderRadius: '5px',
        fontSize: '10px !important',
        backgroundColor: 'white',
        overflow: 'hidden',
        width: width,
        '&:hover': {
          borderColor: '#BDBDBD'
        },
        '&:focus-within': {
          borderColor: '#1976d2',
          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
        }
      }}
    >
      {/* Left Section - Discount Type Selector */}
      <Button
        id="discount-type-button"
        aria-controls={open ? 'discount-type-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disabled={disabled}
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '0px 12px',
          borderRight: '1px solid #E0E0E0',
          backgroundColor: '#F5F5F5',
          cursor: disabled ? 'default' : 'pointer',
          minWidth: widthSelection,
          maxWidth: widthSelection,
          borderRadius: 0,
          textTransform: 'none',
          fontSize: 'inherit',
          '&:hover': {
            backgroundColor: disabled ? '#F5F5F5' : '#EEEEEE'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#666666',
            fontSize: 'inherit',
            fontWeight: 500
          }}
        >
          {discountType === DiscountType.PERCENTAGE ? '%' : 'A'}
          <IconButton
            size="small"
            sx={{
              padding: '0px',
              marginLeft: '4px',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              color: '#666666'
            }}
          >
            <KeyboardArrowDown fontSize="small" />
          </IconButton>
        </Box>
      </Button>

      {/* Menu */}
      <Menu
        id="discount-type-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'discount-type-button'
          }
        }}
      >
        <MenuItem
          onClick={() => handleTypeChange(DiscountType.PERCENTAGE)}
          sx={{
            color: discountType === DiscountType.PERCENTAGE ? '#1976d2' : '#333333',
            backgroundColor: discountType === DiscountType.PERCENTAGE ? '#F3F9FF' : 'transparent'
          }}
        >
          %
        </MenuItem>
        <MenuItem
          onClick={() => handleTypeChange(DiscountType.AMOUNT)}
          sx={{
            color: discountType === DiscountType.AMOUNT ? '#1976d2' : '#333333',
            backgroundColor: discountType === DiscountType.AMOUNT ? '#F3F9FF' : 'transparent'
          }}
        >
          Amount
        </MenuItem>
      </Menu>

      {/* Right Section - Value Input */}
      <Box sx={{ flex: 1, width: widthInput, fontSize: 'inherit' }}>
        <TextField
          value={discountValue}
          onChange={handleValueChange}
          placeholder={placeholder}
          disabled={disabled}
          type="number"
          inputProps={{
            min: 0,
            step: discountType === DiscountType.PERCENTAGE ? 0.01 : 0.01
          }}
          sx={{
            fontSize: 'inherit',
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
            },
            '& .MuiInputBase-input': {
              padding: '5px 12px',
              fontSize: 'inherit',
              color: '#333333',
              '&::placeholder': {
                color: '#999999'
              }
            }
          }}
        />
      </Box>
    </Box>
  )
}
export default DiscountField
