import DynamicInput from '@renderer/components/formik-input'
import { inputType } from '@renderer/types'
import { useField, useFormikContext } from 'formik'
import React, { useEffect } from 'react'
import { useGetOrdersByCustomerIdQuery } from '../../services/api'
import { TInitialValuesType } from './refund-orders-popup'
import { useTranslation } from 'react-i18next'

function OrderSelection() {
  const { values, setFieldValue } = useFormikContext<TInitialValuesType>()
  const { t } = useTranslation('translation')
  const { data, isLoading } = useGetOrdersByCustomerIdQuery(values?.customerId ?? '', {
    skip: !values?.customerId
  })
  useEffect(() => {
    setFieldValue('orderId', '')
    setFieldValue('items', [])
  }, [values?.customerId])

  const options = data?.data?.map((order) => ({
    key: order?.billNumber + '',
    value: order?.guid
  }))

  return (
    <DynamicInput
      name="orderId"
      label={t('Order')}
      inputType={inputType.select}
      options={options ?? []}
    />
  )
}

export default OrderSelection
