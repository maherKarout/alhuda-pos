import { FormControl, Grid, Select, TextField, MenuItem } from '@mui/material'
import { ResType } from '@renderer/app/customers'
import OutlinedTextInput from '@renderer/components/formik-input/outlined-text-input'
import SelectInput from '@renderer/components/formik-input/select-input'
import { useFormikContext } from 'formik'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { initialValuesCashOutType } from './cash-out-form'
import FormRadioGroup from '@renderer/components/formik-input/Form-radio-group'
import { decimalPriceToNumber, priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
import { PurchaseReasonType } from '@renderer/consts'
import AutoCompleteField from '@renderer/components/formik-input/auto-complete-fiedl'
import { CURRENCIES, getBaseCurrency, CurrencyCode } from '@renderer/config/currencies'

function CashOutFormFields({ customersData }: { customersData: any }) {
  const { t } = useTranslation('translation')
  const { values, setFieldValue } = useFormikContext<initialValuesCashOutType>()

  const baseCurrency = getBaseCurrency()
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>(baseCurrency.code as CurrencyCode)

  const customersOptions = customersData?.data?.map((customer: any) => ({
    label: customer?.name,
    value: customer?.customerId
  }))
  return (
    <Grid container spacing={2}>
      <Grid component="div" size={{ xs: 12, md: 6 }}>
        <FormRadioGroup
          options={[
            { value: PurchaseReasonType.EXPENSES, key: 'expenses' },
            { value: PurchaseReasonType.SUPPLIER, key: 'supplier' },
            { value: PurchaseReasonType.CUSTOMER, key: 'Customer' },
          ]}
          name="reason"
          label="Payment Reason"
          isRow
        />
      </Grid>
      <Grid component="div" size={{ xs: 12, md: 12 }}></Grid>
      <Grid component="div" size={{ xs: 12, md: 6 }}>
        {/* <SelectInput
          name="customer"
          label={t('Customer')}
          options={customersOptions}
          disabled={values.reason !== PurchaseReasonType.CUSTOMER}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 340 }
            }
          }}
        /> */}
        <AutoCompleteField name="customer" label={t('Customer')} optionsAutoComplete={customersOptions} />

      </Grid>
      <Grid component="div" size={{ xs: 12, md: 12 }}></Grid>

      <Grid component="div" size={{ xs: 12, md: 6 }}>
        <TextField
          // name={`amount.${currentCurrency}`}
          label="amount"
          onChange={(e) => {
            const value = e.target.value
            if (value.includes(',')) {
              e.target.value = value.replace(',', '.')
            }
            setFieldValue(`amount.${currentCurrency}`, decimalPriceToNumber(value))
          }}
          value={priceToDecimalPrice(values.amount[currentCurrency]?.toString() || '0')}
          sx={{ width: '100%' }}
          slotProps={{
            input: {
              endAdornment: (
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <Select
                    value={currentCurrency}
                    onChange={(e) => {
                      const newValue = e.target.value as CurrencyCode
                      // Reset all other currency amounts to 0
                      CURRENCIES.forEach((currency) => {
                        if (currency.code !== newValue) {
                          setFieldValue(`amount.${currency.code}`, 0)
                        }
                      })
                      setCurrentCurrency(newValue)
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
              // endAdornment: (
              //   <select
              //     value={currentCurrency}
              //     onChange={(e) => setCurrentCurrency(e.target.value as currencyType)}
              //   >
              //     <option value="syp">{t('SYP')}</option>
              //     <option value="usd">{t('USD')}</option>
              //   </select>
              // )
            }
          }}
        // slotProps={{
        //   input: {
        //     endAdornment: (
        //       <select
        //         value={currentCurrency}
        //         onChange={(e) => setCurrentCurrency(e.target.value as currencyType)}
        //       >
        //         <option value="syp">{t('SYP')}</option>
        //         <option value="usd">{t('USD')}</option>
        //       </select>
        //     )
        //   }
        // }}
        />
      </Grid>
      <Grid component="div" size={{ xs: 12, md: 6 }}></Grid>
      <Grid component="div" size={{ xs: 12, md: 6 }}>
        <OutlinedTextInput name="notes" label="notes" rows={3} multiline />
      </Grid>
      <Grid component="div" size={{ xs: 12, md: 6 }}></Grid>
    </Grid>
  )
}

export default CashOutFormFields
