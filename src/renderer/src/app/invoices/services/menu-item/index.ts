import { paginationStringConcatenation } from 'src/helpers/pagination-string-concatenation'
import { routeName } from '@renderer/shared/routeName'
import { privilegeKeys } from 'src/shared/privileges'
import { menuItemType } from 'src/types'
import InvoicesIcon from 'src/assets/images/sidebar-icons/invoices.svg'
export default [
  {
    id: 'invoices-screen',
    title: '',
    privileges: [privilegeKeys.viewOrder],
    caption: '',
    type: 'group',
    url: routeName.INVOICES_SCREEN,
    icon: null,
    children: [
      {
        id: 'invoices-screen',
        title: 'Invoices',
        type: 'item',
        privileges: [privilegeKeys.viewOrder],
        url: paginationStringConcatenation(routeName.INVOICES_SCREEN),
        icon: InvoicesIcon
      }
    ]
  }
] as menuItemType[]
