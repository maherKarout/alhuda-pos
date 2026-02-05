import { Autocomplete, Box, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { branchesType } from '@renderer/app/branches'
import { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'

type Props = {
  branches?: branchesType[]
  selectedBranch?: branchesType | null
  onBranchSelect?: (branchId: string) => void
  isLoading?: boolean
  label?: string
  placeholder?: string
}

function BranchesField({
  branches,
  selectedBranch,
  onBranchSelect,
  isLoading = false,
  label = 'Select Branch',
  placeholder = 'Choose a branch...'
}: Props) {
  const [inputValue, setInputValue] = useState('')
  const { t } = useTranslation('translation')
  return (
    <Autocomplete
      disablePortal
      options={branches || []}
      getOptionLabel={(option) => option.name || ''}
      value={selectedBranch}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      onChange={(event, newValue) => {
        if (onBranchSelect && newValue) {
          onBranchSelect(newValue.id)
        }
      }}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Stack direction="column" spacing={0.5}>
            <Typography variant="body2" fontWeight={500}>
              {option.name}
            </Typography>
          </Stack>
        </Box>
      )}
      loading={isLoading}
      sx={{ marginBottom: 3 }}
      renderInput={(params) => (
        <div ref={params.InputProps.ref}>
          <TextField
            {...params}
            fullWidth
            placeholder={t(label)}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
          />
        </div>
      )}
    />
  )
}

export default BranchesField
