import React from 'react'
import { useParams } from 'react-router'

function useIsUpdateCustomerOrder() {
  const { customer_id_order } = useParams()
  const isUpdateCustomerOrder =
    customer_id_order !== 'add-new-order' &&
    customer_id_order !== '' &&
    customer_id_order !== undefined
  return isUpdateCustomerOrder ? customer_id_order : false
}

export default useIsUpdateCustomerOrder
