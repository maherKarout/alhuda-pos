import { Grid, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material'
import OutlinedTextInput from '@renderer/components/formik-input/outlined-text-input'
import SelectInput from '@renderer/components/formik-input/select-input'
import { useFormikContext } from 'formik'
import { useTranslation } from 'react-i18next'
import { initialValuesCashInType } from './cash-in-form'
import { useGetCustomerNotCompletedOrdersQuery } from '../../services/api'
import DateTimeInput from '@renderer/components/formik-input/date-time-input'
import { decimalPriceToNumber, priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
import { OrderType } from '@renderer/consts'
import AutoCompleteField from '@renderer/components/formik-input/auto-complete-fiedl'
import { CURRENCIES, CurrencyCode } from '@renderer/config/currencies'
function CashInFormFields({ customersData }: { customersData: any }) {
  const { t } = useTranslation('translation')
  const { values, setFieldValue, errors } = useFormikContext<initialValuesCashInType>()

  const { data, isLoading, isError } = useGetCustomerNotCompletedOrdersQuery(
    values.customer ?? '',

    {
      skip: !values.customer
    }
  )
  const customersOptions = customersData?.data?.map((customer: any) => ({
    label: customer?.name,
    value: customer?.customerId
  }))
  const orderOptions = data?.data?.map((order) => {
    const key = `${order?.billNumber} - ${order?.orderType === OrderType.CUSTOMER ? 'طلبية' : 'فاتورة'}`
    return {
      key: key,
      value: order?.guid
    }
  })

  return (
    <Grid container spacing={2}>
      <Grid component="div" size={{ xs: 12, md: 6 }}>
        {/* <SelectInput name="customer" label={t('Customer')} options={customersOptions} MenuProps={{
          PaperProps: {
            sx: { maxHeight: 340 }
          }
        }} /> */}
        <AutoCompleteField name="customer" label={t('Customer')} optionsAutoComplete={customersOptions} />
      </Grid>
      <Grid component="div" size={{ xs: 12, md: 6 }}></Grid>
      <Grid component="div" size={{ xs: 12, md: 6 }}>
        <SelectInput
          name="orderNumber"
          label="orderNumber"
          options={orderOptions}
          disabled={!values?.customer || isLoading || isError}
        />
      </Grid>
      <Grid component="div" size={{ xs: 12, md: 6 }}></Grid>
      <Grid component="div" size={{ xs: 12, md: 6 }}>
        <TextField
          // name={`amount.${values.amountType}`}
          onChange={(e) => {
            const value = e.target.value
            if (value.includes(',')) {
              e.target.value = value.replace(',', '.')
            }
            setFieldValue(`amount.${values.amountType}`, decimalPriceToNumber(value))
          }}
          value={priceToDecimalPrice(values.amount[values.amountType]?.toString() || '0')}
          label={
            CURRENCIES.find((c) => c.code === values.amountType)?.label + ' ' + t('Amount') ||
            t('Amount')
          }
          type="text"
          sx={{ width: '100%' }}
          slotProps={{
            input: {
              endAdornment: (
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <Select
                    value={values.amountType}
                    onChange={(e) => {
                      const newValue = e.target.value as CurrencyCode
                      // Reset all other currency amounts to 0
                      CURRENCIES.forEach((currency) => {
                        if (currency.code !== newValue) {
                          setFieldValue(`amount.${currency.code}`, 0)
                        }
                      })
                      setFieldValue('amountType', newValue)
                    }}
                    sx={{
                      width: 'fit-content',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '& .MuiSelect-select': {
                        padding: '8px 14px',
                        fontSize: '14px'
                      }
                    }}
                  >
                    {CURRENCIES.map((currency) => (
                      <MenuItem key={currency.code} value={currency.code}>
                        {t(currency.label)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            }
          }}
          error={Boolean(errors.amount?.[values.amountType])}
        />
      </Grid>
      <Grid component="div" size={{ xs: 12, md: 6 }}></Grid>
      <Grid component="div" size={{ xs: 12, md: 6 }}>
        <DateTimeInput name="date" label="date" />
      </Grid>
      <Grid component="div" size={{ xs: 12, md: 6 }}></Grid>
      <Grid component="div" size={{ xs: 12, md: 6 }}>
        <OutlinedTextInput name="notes" label="notes" rows={3} multiline />
      </Grid>
      <Grid component="div" size={{ xs: 12, md: 6 }}></Grid>
    </Grid>
  )
}

export default CashInFormFields
