import { privilegeKeys } from 'src/shared/privileges'
import { menuItemType } from 'src/types'

export default [
  {
    id: 'casher-login',
    title: 'Casher login',
    privileges: [privilegeKeys.all],
    caption: 'Casher login management',
    type: 'item',
    url: '/casher-login',
    icon: 'casher-login'
  }
] as menuItemType[]
