import { inputType } from '@renderer/types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import GenerateForm from 'src/components/generate-form-component'
import CashInFormFields from './cash-in-form-fields'
import useGetCustomers from '@renderer/app/casher-screen/hooks/use-get-customers'
import { useAddCashInMutation } from '../../services/api'
import { promiseWrapper } from '@renderer/helpers/promise-wrapper'
import moment from 'moment'
import { TypePayment } from '@renderer/consts'
import { Yup } from '@renderer/validation'
import { CURRENCIES, createEmptyAmountObject, getBaseCurrency, CurrencyCode } from '@renderer/config/currencies'

export type initialValuesCashInType = {
  date: string
  customer: string
  amount: Record<string, number> // Dynamic: { syp: number, usd: number, ... }
  kind?: string
  customerId?: string
  customerName?: string
  notes: string
  type: TypePayment
  orderNumber: string
  amountType: CurrencyCode
}

type CashInFormProps = {
  onSuccess: () => void
  onSetPrintData?: (data: initialValuesCashInType) => void
}

function CashInForm({ onSuccess, onSetPrintData }: CashInFormProps) {
  const { t } = useTranslation('translation')
  const {
    data: customersData,
    isLoading: isLoadingCustomers,
    isError: isErrorCustomers
  } = useGetCustomers()
  const [addCashIn, { isLoading: isLoadingAddCashIn, isError: isErrorAddCashIn }] =
    useAddCashInMutation()
  const fields = [
    {
      name: '',
      label: '',
      inputType: inputType.custom,
      renderComponent: <CashInFormFields customersData={customersData} />,
      md: 12
    }
  ]
  const baseCurrency = getBaseCurrency()
  const initialValues: initialValuesCashInType = {
    date: '2025-09-03T11:26:29.399Z',
    customer: '',
    amount: createEmptyAmountObject(),
    notes: '',
    type: TypePayment.RECEIPT,
    orderNumber: '',
    amountType: baseCurrency.code as CurrencyCode
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
    customer: Yup.text({ isRequired: true }),
    // orderNumber: Yup.string().required(t('Order number is required')),
    amountType: Yup.text({ isRequired: true }),
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
    type: Yup.string().required(t('Type is required')),
    date: Yup.date().required()
  })
  const onSubmit = (values: initialValuesCashInType, helpers: any) => {
    // Resolve customer display name for printing
    const customerName =
      customersData?.data?.find((customer: any) => customer.customerId === values.customer)?.name ||
      ''

    // Store the sent data (plus some enriched fields) for printing in the parent state
    onSetPrintData?.({
      ...values,
      kind: 'cashIn',
      customerId: values.customer,
      customerName
    })

    const { amountType, ...restValues } = values
    const newValues = {
      ...restValues,
      orderNumber: undefined,
      orderGuid: values.orderNumber
      //   date: moment(values.date).format('YYYY-MM-DD')
    }
    return promiseWrapper({
      fn: addCashIn,
      helpers: helpers,
      dataToSend: newValues,
      isNew: true,
      onSuccess: onSuccess,
      disableNavigate: true
    })
  }
  const isError = isErrorCustomers
  const isLoading = isLoadingCustomers
  return (
    <GenerateForm
      isMultiLanguage={false}
      fields={fields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      isError={isError}
      loading={isLoading}
      hideCardContainer={true}
    />
  )
}

export default CashInForm
