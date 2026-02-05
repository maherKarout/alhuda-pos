import React, { useState } from 'react'
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

const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearchChange,
  onBranchFilterChange,
  searchValue = '',
  allBranches = true
}) => {
  const { t } = useTranslation('translation')
  const [localSearchValue, setLocalSearchValue] = useState(searchValue)
  const [localAllBranches, setLocalAllBranches] = useState(allBranches)

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setLocalSearchValue(value)
    onSearchChange?.(value)
  }

  const handleBranchFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setLocalAllBranches(checked)
    onBranchFilterChange?.(checked)
  }

  return (
    <Box
      sx={{
        backgroundColor: '#f8f9fa',
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
            color: '#333',
            minWidth: 'fit-content'
          }}
        >
          {t('Items')}
        </Typography>

        {/* All Branches Checkbox */}
          {/* <FormControlLabel
            control={
              <Checkbox
                checked={localAllBranches}
                onChange={handleBranchFilterChange}
                sx={{
                  color: '#1976d2',
                  '&.Mui-checked': {
                    color: '#1976d2'
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
                  color: '#666',
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
          /> */}

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
                <SearchIcon sx={{ color: '#1976d2' }} />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e0e0e0'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#bdbdbd'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2'
              }
            }
          }}
          sx={{
            '& .MuiInputBase-input': {
              padding: '8px 12px',
              fontSize: '0.875rem',
              color: '#333',
              '&::placeholder': {
                color: '#999',
                opacity: 1
              }
            }
          }}
        />
      </Stack>
    </Box>
  )
}

export default ProductSearch
