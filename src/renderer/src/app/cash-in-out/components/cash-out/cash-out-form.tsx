import { inputType } from '@renderer/types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import GenerateForm from 'src/components/generate-form-component'
import CashOutFormFields from './cash-out-form-field'
import * as Yup from 'yup'
import { promiseWrapper } from '@renderer/helpers/promise-wrapper'
import { useAddCashOutMutation } from '../../services/api'
import { PurchaseReasonType } from '@renderer/consts'
import useGetCustomers from '@renderer/app/casher-screen/hooks/use-get-customers'
import { CURRENCIES, createEmptyAmountObject, getBaseCurrency } from '@renderer/config/currencies'

export type initialValuesCashOutType = {
  reason: PurchaseReasonType | string
  customer?: string
  amount: Record<string, number> // Dynamic: { syp: number, usd: number, ... }
  notes: string
}

type CashOutFormProps = {
  onSuccess: () => void
  onSetPrintData?: (data: any) => void
}

function CashOutForm({ onSuccess, onSetPrintData }: CashOutFormProps) {
  const { t } = useTranslation('translation')
  const { data: customersData, isLoading: isLoadingCustomers, isError: isErrorCustomers } = useGetCustomers()
  const [addCashOut, { isLoading: isLoadingAddCashOut, isError: isErrorAddCashOut }] =
    useAddCashOutMutation()
  const fields = [
    {
      name: '',
      label: '',
      inputType: inputType.custom,
      renderComponent: <CashOutFormFields customersData={customersData} />,
      md: 12
    }
  ]
  const baseCurrency = getBaseCurrency()
  const initialValues: initialValuesCashOutType = {
    reason: PurchaseReasonType.EXPENSES,
    customer: undefined,
    amount: createEmptyAmountObject(),
    notes: ''
  }
  // Build dynamic validation schema for amounts
  const amountValidationSchema: Record<string, any> = {}
  CURRENCIES.forEach((currency) => {
    amountValidationSchema[currency.code] = Yup.number().min(
      0,
      t(`${currency.label} amount must be greater than or equal to 0`)
    )
  })

  const validationSchema = Yup.object({
    amount: Yup.object(amountValidationSchema).test('amount-validation', function (value: any) {
      const { amountType } = this.parent
      const selectedCurrency = CURRENCIES.find((c) => c.code === amountType)

      if (!selectedCurrency) {
        return this.createError({
          path: 'amountType',
          message: t('Invalid currency selected')
        })
      }

      if (!value?.[amountType] || value[amountType] <= 0) {
        return this.createError({
          path: `amount.${amountType}`,
          message: t(`${selectedCurrency.label} amount is required and must be greater than 0`)
        })
      }

      return true
    }),
    notes: Yup.string().required(t('Notes is required')),
    reason: Yup.string().required(t('Reason is required'))
  })
  const onSubmit = (values: initialValuesCashOutType, helpers: any) => {
    // Resolve customer display name (if a customer is selected)
    const customerId = (values as any).customer as string | undefined
    const customerName =
      (customerId &&
        customersData?.data?.find((customer: any) => customer.customerId === customerId)?.name) ||
      ''

    // Build a translated label for the cash-out reason
    let reasonLabel = values.reason
    if (values.reason === PurchaseReasonType.EXPENSES) {
      reasonLabel = t('expenses')
    } else if (values.reason === PurchaseReasonType.SUPPLIER) {
      reasonLabel = t('supplier')
    } else if (values.reason === PurchaseReasonType.CUSTOMER) {
      reasonLabel = t('Customer')
    }

    // Store the sent data (plus some enriched fields) for printing in the parent state
    onSetPrintData?.({
      ...values,
      kind: 'cashOut',
      customerId,
      customerName,
      reasonLabel
    })

    // Convert amount object to ensure all values are numbers
    const amount: Record<string, number> = {}
    CURRENCIES.forEach((currency) => {
      amount[currency.code] = +(values.amount[currency.code] || 0)
    })
    const newValues = {
      ...values,
      amount
    }
    return promiseWrapper({
      fn: addCashOut,
      helpers: helpers,
      dataToSend: newValues,
      isNew: true,
      onSuccess: onSuccess,
      disableNavigate: true
    })
  }

  return (
    <GenerateForm
      isMultiLanguage={false}
      fields={fields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      isError={isErrorAddCashOut}
      loading={isLoadingAddCashOut}
      hideCardContainer={true}
    />
  )
}

export default CashOutForm
