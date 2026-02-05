import { privilegeKeys } from 'src/shared/privileges'
import { menuItemType } from 'src/types'
import AccountsIcon from 'src/assets/images/sidebar-icons/users.svg'
import { paginationStringConcatenation } from '@renderer/helpers/pagination-string-concatenation'
import { routeName } from 'src/shared/routeName'

export default [
  {
    id: 'pos-users',
    title: '',
    privileges: [
      privilegeKeys.viewPOS,
      privilegeKeys.createPOS,
      privilegeKeys.updatePOS,
      privilegeKeys.deletePOS
    ],
    caption: '',
    type: 'group',
    children: [
      {
        id: 'pos-users',
        title: 'POS users',
        privileges: [
          privilegeKeys.viewPOS,
          privilegeKeys.createPOS,
          privilegeKeys.updatePOS,
          privilegeKeys.deletePOS
        ],
        caption: '',
        type: 'item',
        url: paginationStringConcatenation(routeName.POS_USERS),
        icon: AccountsIcon
      }
    ]
  }
] as menuItemType[]
