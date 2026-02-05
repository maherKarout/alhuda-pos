import { privilegeKeys } from 'src/shared/privileges'
import { menuItemType } from 'src/types'
import { routeName } from 'src/shared/routeName'
import PurchaseOrderIcon from 'src/assets/images/sidebar-icons/pos.svg'
import { paginationStringConcatenation } from '@renderer/helpers/pagination-string-concatenation'

export default [
  {
    id: 'purchase-order',
    title: '',
    privileges: [privilegeKeys.createPOSPurchase, privilegeKeys.viewPOSPurchase],
    caption: '',
    type: 'group',
    url: routeName.PURCHASE_ORDER,
    icon: null,
    children: [
      {
        id: 'purchase-order-pos',
        title: 'purchase-order-pos',
        type: 'item',
        privileges: [privilegeKeys.createPOSPurchase, privilegeKeys.viewPOSPurchase],
        url: paginationStringConcatenation(routeName.ALL_PURCHASE_ORDER),
        icon: PurchaseOrderIcon
      }
    ]
  }
] as menuItemType[]
