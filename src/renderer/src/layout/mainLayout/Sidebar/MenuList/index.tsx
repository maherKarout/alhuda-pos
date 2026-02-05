// material-ui
import { Typography } from '@mui/material'

// project imports
import NavGroup from './NavGroup'
import menuItem from 'src/layout/menu-items'
import { useAppSelector } from 'src/hooks/useAppSelector'
import { privilegeKeys } from 'src/shared/privileges'
import { useTranslation } from 'react-i18next'

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const { t } = useTranslation('translation')
  const { account } = useAppSelector((state) => state.auth)
  const privileges: privilegeKeys[] = account?.privileges ?? []
  const navItems = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group': {
        if (
          privileges.some((e) => item?.privileges?.includes(e)) ||
          item?.privileges?.includes(privilegeKeys.all)
        )
          return <NavGroup key={item.id} item={item} />
        else return <></>
      }
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        )
    }
  })
  navItems.push(
    <Typography
      key={' Developed by Darsoft'}
      variant="body1"
      color="grey"
      sx={{
        textDecoration: 'underline',
        textAlign: 'center',
        margin: ' 0  0 50px',
        fontSize: '12px'
      }}
    >
      {t('developed_by_darsoft')}
    </Typography>
  )
  return (
    <>
      {navItems.map((Item, index) => (
        <div key={index}>{Item}</div>
      ))}
    </>
  )
}

export default MenuList
