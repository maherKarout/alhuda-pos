import PurchaseOrderForAdminAndCasher from '@renderer/app/purchase-order/components'
import AuthorizedCheckWrapper from '@renderer/components/authorized-check-wrapper'
import { privilegeFeature } from '@renderer/shared/privileges'
import React from 'react'

function EditAdminOrderPurchase() {
  return <PurchaseOrderForAdminAndCasher forAdmin={true} />
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.purchase,
  type: 'view'
})(EditAdminOrderPurchase)
