import { privilegeKeys } from 'src/shared/privileges'
import { menuItemType } from 'src/types'
import { routeName } from 'src/shared/routeName'
import SettingsIcon from '@mui/icons-material/Settings'

export default [
  {
    id: 'config',
    title: '',
    // privileges: [privilegeKeys.viewConfig,privilegeKeys.updateConfig],
    privileges: [privilegeKeys.all],
    caption: 'config management',
    type: 'group',
    icon: null,
    children: [
      {
        id: 'config',
        title: 'config',
        type: 'item',
        url: routeName.CONFIG,
        privileges: [privilegeKeys.all],
        icon: SettingsIcon
      }
    ]
  }
] as menuItemType[]
