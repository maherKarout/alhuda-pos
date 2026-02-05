import { privilegeKeys } from "src/shared/privileges";
import { menuItemType } from "src/types";
import CustomerIcon from 'src/assets/images/sidebar-icons/Branches.svg'
import { paginationStringConcatenation } from '@renderer/helpers/pagination-string-concatenation'
import { routeName } from 'src/shared/routeName'


export default [
  {
    id: 'Customer order',
    title: '',
    privileges: [privilegeKeys.createOrder,privilegeKeys.viewOrder],
    caption: '',
    type: 'group',
    children: [
      {
        id: 'Customer',
        title: 'Customer orders',
        privileges: [privilegeKeys.createOrder,privilegeKeys.viewOrder],
        caption: '',
        type: 'item',
        url: paginationStringConcatenation(routeName.CUSTOMER_ORDERS),
        icon: CustomerIcon
      }
    ]
  }
] as menuItemType[]
