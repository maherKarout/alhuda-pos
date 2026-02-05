import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useGetAllCustomersWithoutPaginationQuery } from '@renderer/app/customers'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import useCasherScreen from '../hooks/use-casher-screen'
import DrawerAddCustomer from './drawer-add-customer'
import useIsUpdateCustomerOrder from '../hooks/use-is-update-customer-order'
import { useGetAllCustomers } from '@renderer/app/customers/hooks/use-get-customers'

// Import SVG icons

function AutoCompleteCustomerField() {
  const isUpdateCustomerOrder = useIsUpdateCustomerOrder()
  const { setOrders, currentOrder, orders } = useCasherScreen()
  const { t } = useTranslation('translation')

  const [inputValue, setInputValue] = useState(orders[currentOrder]?.customerName || '')

  // ====================== Update Customer Name for customer order ======================
  useEffect(() => {
    setInputValue(orders[currentOrder]?.customerName || '')
  }, [orders[currentOrder]?.customerName])

  const [debouncedSearchValue, setDebouncedSearchValue] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [openCustomerDrawer, setOpenCustomerDrawer] = useState(false)

  const { data: customersData, isLoading: isLoadingCustomers } =
    // useGetAllCustomersWithoutPaginationQuery({ searchValue: debouncedSearchValue })
    useGetAllCustomers({ searchValue: debouncedSearchValue })

  // Debounce the search value with 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(inputValue)
    }, 500)

    return () => clearTimeout(timer)
  }, [inputValue])

  // Sync selectedCustomer state with orders when currentOrder changes
  // useEffect(() => {
  //   if (customersData?.data && orders[currentOrder]?.customerId) {
  //     const customer = customersData.data.find(
  //       (c) => c.customerId === orders[currentOrder]?.customerId
  //     )
  //     if (customer) {
  //       setSelectedCustomer(customer)
  //       setInputValue(customer.name || '**')
  //     }
  //   } else {
  //     setSelectedCustomer(null)
  //     setInputValue('--')
  //   }
  // }, [currentOrder])

  // ====================== update customer ======================
  // useEffect(() => {
  //   if (isLoadingCustomers) return
  //   const customer = customersData?.data?.find(
  //     (c) => c.customerId === orders[currentOrder]?.customerId
  //   )
  //   setInputValue(customer?.name || '-')
  //   setSelectedCustomer(customer?.customerId)
  // }, [orders[currentOrder].customerId, isLoadingCustomers])
  return (
    <>
      <div>
        <Autocomplete
          freeSolo
          disablePortal
          options={customersData?.data?.slice(0, 50) || []}
          getOptionLabel={(option) => `${option.name} - ${option?.phone}` || ''}
          value={selectedCustomer}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            // if (newInputValue !== '')
            setInputValue(newInputValue)
          }}
          onChange={(event, newValue) => {
            setSelectedCustomer(newValue)
            if (setOrders && currentOrder !== undefined) {
              setOrders((prev) => {
                const newOrders = [...prev]
                newOrders[currentOrder] = {
                  ...newOrders[currentOrder],
                  customerId: newValue?.customerId || ''
                }
                return newOrders
              })
            }
            event.preventDefault()
            event.stopPropagation()
          }}
          onKeyDown={(event) => {
            event.preventDefault
          }}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Stack direction="column" spacing={0.5}>
                <Typography variant="body2" fontWeight={500}>
                  {option.name} - {option?.phone}
                </Typography>
                {/* <Typography variant="caption" color="text.secondary">
                  {option.phone} • ID: {option.customerId}
                </Typography> */}
              </Stack>
            </Box>
          )}
          loading={isLoadingCustomers}
          sx={{ marginBottom: 3 }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              placeholder={t('Search existing customer')}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Stack direction="row" spacing={1} alignItems="center">
                    {params.InputProps.endAdornment}
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      sx={{ textTransform: 'none', fontSize: '12px' }}
                      onClick={() => {
                        setOpenCustomerDrawer(true)
                      }}
                    >
                      {t('Add New')}
                    </Button>
                  </Stack>
                )
              }}
            />
          )}
        />
        <DrawerAddCustomer
          open={openCustomerDrawer}
          setOpen={setOpenCustomerDrawer}
          setInputValue={setInputValue}
        />
      </div>
    </>
  )
}

export default AutoCompleteCustomerField
