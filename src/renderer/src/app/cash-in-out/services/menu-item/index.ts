import { routeName } from '@renderer/shared/routeName'
import { privilegeKeys } from 'src/shared/privileges'
import { menuItemType } from 'src/types'
import CashInOutIcon from 'src/assets/images/sidebar-icons/cash-in-out.svg'
export default [
  {
    id: 'cash-in-out',
    title: '',
    privileges: [privilegeKeys.createOrder, privilegeKeys.updateOrder, privilegeKeys.viewOrder],
    caption: '',
    type: 'group',
    url: '',
    children: [
      {
        id: 'cash-in-out',
        title: 'cash-in-out',

        privileges: [privilegeKeys.createOrder, privilegeKeys.viewOrder, privilegeKeys.updateOrder],
        caption: '',
        type: 'item',
        url: routeName.CASH_IN_OUT,
        icon: CashInOutIcon
      }
    ],
    icon: null
  }
] as menuItemType[]
