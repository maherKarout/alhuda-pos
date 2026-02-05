import { privilegeKeys } from 'src/shared/privileges'
import { menuItemType } from 'src/types'
import AccountsIcon from 'src/assets/images/sidebar-icons/users.svg'
import { paginationStringConcatenation } from '@renderer/helpers/pagination-string-concatenation'

export default [
  {
    id: 'customers',
    title: '',
    privileges: [
      privilegeKeys.createCustomer,
      privilegeKeys.updateCustomer,
      privilegeKeys.deleteCustomer
    ],
    caption: 'Customers management',
    type: 'group',
    icon: null,
    children: [
      {
        id: 'customers',
        title: 'Customers',
        type: 'item',
        url: paginationStringConcatenation('/customers'),
        privileges: [
          privilegeKeys.createCustomer,
          privilegeKeys.updateCustomer,
          privilegeKeys.deleteCustomer
        ],
        icon: AccountsIcon
      }
    ]
  }
] as menuItemType[]
