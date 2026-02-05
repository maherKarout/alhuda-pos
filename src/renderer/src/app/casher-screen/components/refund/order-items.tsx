import { TResponseInvoiceById, useGetInvoicesByIdQuery } from '@renderer/app/invoices'
import { useFormikContext } from 'formik'
import React, { useEffect } from 'react'
import { TInitialValuesType } from './refund-orders-popup'
import { Stack } from '@mui/material'
import ItemBox from './item-box'

function OrderItems() {
  const { values, setFieldValue } = useFormikContext<TInitialValuesType>()
  const { data, isLoading, isError, isFetching } = useGetInvoicesByIdQuery(values.orderId ?? '', {
    skip: !values.orderId
  })
  useEffect(() => {
    if (data) {
      // Map the invoice items to the formik items
      const mappedItems: TResponseInvoiceById['products'][0][] = data.products.map((product) => ({
        guid: product.guid,
        productName: product.productName,
        unitPrice: product.unitPrice,
        quantity: product.quantity,
        mainQuantity: product.quantity
      }))
      setFieldValue('items', mappedItems)
    }
  }, [isFetching])

  return (
    <Stack gap={2} flexWrap={'wrap'} flexDirection={'row'}>
      {values.items.map((item, index) => (
        <ItemBox item={item} index={index} />
      ))}
    </Stack>
  )
}
export default OrderItems
