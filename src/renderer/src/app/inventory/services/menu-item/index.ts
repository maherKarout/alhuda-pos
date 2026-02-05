import { paginationStringConcatenation } from '@renderer/helpers/pagination-string-concatenation'
import { routeName } from '@renderer/shared/routeName'
import { privilegeKeys } from 'src/shared/privileges'
import { menuItemType } from 'src/types'
import warehouse from 'src/assets/images/sidebar-icons/warehouse.svg'

export default [
  {
    id: 'inventory',
    title: '',
    privileges: [privilegeKeys.createOrder, privilegeKeys.updateOrder],
    caption: 'inventory management',
    type: 'group',
    icon: null,
    children: [
      {
        id: 'inventory',
        title: 'inventory',
        type: 'item',
        url: paginationStringConcatenation(routeName.INVENTORY),
        privileges: [privilegeKeys.createOrder, privilegeKeys.updateOrder],
        icon: warehouse
      }
    ]
  }
] as menuItemType[]
