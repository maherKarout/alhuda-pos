import { privilegeKeys } from 'src/shared/privileges'
import { menuItemType } from 'src/types'
import branchesIcon from 'src/assets/images/sidebar-icons/Branches.svg'
import { paginationStringConcatenation } from '@renderer/helpers/pagination-string-concatenation'
import { routeName } from 'src/shared/routeName'
export default [
  {
    id: 'branches',
    title: '',
    privileges: [privilegeKeys.createPOS, privilegeKeys.updatePOS, privilegeKeys.deletePOS],
    caption: 'Branches management',
    type: 'group',
    children: [
      {
        id: 'branches',
        title: 'All Branches',
        privileges: [privilegeKeys.createPOS, privilegeKeys.updatePOS, privilegeKeys.deletePOS],
        caption: '',
        type: 'item',
        url: paginationStringConcatenation(routeName.BRANCHES),
        icon: branchesIcon
      }
    ]
  }
] as menuItemType[]
