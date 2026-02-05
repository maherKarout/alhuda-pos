import React, { useState, useEffect, useRef, memo } from 'react'
import {
  Box,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Stack
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface ProductSearchProps {
  onSearchChange?: (searchTerm: string) => void
  onBranchFilterChange?: (allBranches: boolean) => void
  searchValue?: string
  allBranches?: boolean
}

const ProductSearch: React.FC<ProductSearchProps> = memo(({
  onSearchChange,
  onBranchFilterChange,
  searchValue = '',
  allBranches = true
}) => {
  const { t } = useTranslation('translation')
  const [localSearchValue, setLocalSearchValue] = useState(searchValue)
  const [localAllBranches, setLocalAllBranches] = useState(allBranches)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setLocalSearchValue(value)

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer to call onSearchChange after 300ms
    debounceTimerRef.current = setTimeout(() => {
      onSearchChange?.(value)
    }, 300)
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const handleBranchFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setLocalAllBranches(checked)
    onBranchFilterChange?.(checked)
  }

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background?.default,
        padding: 1,
        borderRadius: 1,
        marginBottom: 2
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Items Label */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: (theme) => theme.palette.text?.primary,
            minWidth: 'fit-content'
          }}
        >
          {t('Items')}
        </Typography>

        {/* All Branches Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={localAllBranches}
              onChange={handleBranchFilterChange}
              sx={{
                color: (theme) => theme.palette.primary.main,
                '&.Mui-checked': {
                  color: (theme) => theme.palette.primary.main
                },
                '& .MuiSvgIcon-root': {
                  fontSize: 20
                }
              }}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{
                color: (theme) => theme.palette.text?.secondary,
                fontWeight: 500
              }}
            >
              {t('All Branches')}
            </Typography>
          }
          sx={{
            marginLeft: 0,
            marginRight: 0,
            minWidth: 'fit-content'
          }}
        />

        {/* Search Input */}
        <TextField
          placeholder={t('Search products by id or name or barcode')}
          value={localSearchValue}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: (theme) => theme.palette.primary.main }} />
              </InputAdornment>
            ),
            sx: {
              // backgroundColor: (theme) => theme.palette.background?.default,
              borderRadius: 1,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: (theme) => theme.palette.grey[200]
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: (theme) => theme.palette.grey[300]
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: (theme) => theme.palette.primary.main
              }
            }
          }}
          sx={{
            '& .MuiInputBase-input': {
              padding: '8px 12px',
              fontSize: '0.875rem',
              color: (theme) => theme.palette.text?.primary,
              '&::placeholder': {
                color: (theme) => theme.palette.text?.secondary,
                opacity: 1
              }
            }
          }}
        />
      </Stack>
    </Box>
  )
})

ProductSearch.displayName = 'ProductSearch'

export default ProductSearch
