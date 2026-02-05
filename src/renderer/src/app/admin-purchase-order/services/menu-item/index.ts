import { privilegeKeys } from 'src/shared/privileges'
import { menuItemType } from 'src/types'
import { routeName } from 'src/shared/routeName'
import PurchaseOrderIcon from 'src/assets/images/sidebar-icons/pos.svg'
import { paginationStringConcatenation } from '@renderer/helpers/pagination-string-concatenation'

export default [
  {
    id: 'admin-purchase-order',
    title: '',
    privileges: [privilegeKeys.createPurchase, privilegeKeys.viewPurchase],
    caption: '',
    type: 'group',
    url: '/admin-purchase-order',
    children: [
      {
        id: 'admin-purchase-order-list',
        title: 'shope_orders',
        privileges: [privilegeKeys.createPurchase, privilegeKeys.viewPurchase],
        caption: '',
        type: 'item',
        url: paginationStringConcatenation(routeName.SUPER_ADMIN_PURCHASE_ORDER),
        icon: PurchaseOrderIcon
      },
      {
        id: 'admin-purchase-order-list-invoicess',
        title: 'shope_invoices',
        privileges: [privilegeKeys.createPurchase, privilegeKeys.viewPurchase],
        caption: '',
        type: 'item',
        url: paginationStringConcatenation(routeName.ADMIN_PURCHASE_ORDER_INVOICES),
        icon: PurchaseOrderIcon
      }
    ]
  }
] as menuItemType[]
