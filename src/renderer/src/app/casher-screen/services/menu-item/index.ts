import { privilegeKeys } from 'src/shared/privileges'
import { menuItemType } from 'src/types'
import { routeName } from 'src/shared/routeName'
import CasherScreenIcon from 'src/assets/images/sidebar-icons/pos.svg'

export default [
  {
    id: 'casher-screen',
    title: '',
    privileges: [
      privilegeKeys.createOrder,
      privilegeKeys.viewOrder
      // privilegeKeys.viewProducts,
      // privilegeKeys.viewCategory,
      // privilegeKeys.viewCustomer
    ],
    caption: '',
    type: 'group',
    url: routeName.CASHER_SCREEN + 'add-new-order',
    icon: null,
    children: [
      {
        id: 'casher-screen',
        title: 'Casher Screen',
        type: 'item',
        privileges: [
          privilegeKeys.createOrder,
          privilegeKeys.viewOrder,
          privilegeKeys.viewProducts,
          privilegeKeys.viewCategory,
          privilegeKeys.viewCustomer
        ],
        url: routeName.CASHER_SCREEN + 'add-new-order',
        icon: CasherScreenIcon
      }
    ]
  }
] as menuItemType[]
