import AuthorizedCheckWrapper, { ComponentPropsType } from 'src/components/authorized-check-wrapper'
import { privilegeFeature } from 'src/shared/privileges'
import PurchaseOrderForAdminAndCasher from '../components'

// function PurchaseOrder({ , forAdmin }: { forAdmin: Boolean }) {
function PurchaseOrder({ canEdit }: ComponentPropsType) {
  return <PurchaseOrderForAdminAndCasher forAdmin={false} />
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.posPurchase,
  type: 'view'
})(PurchaseOrder)
