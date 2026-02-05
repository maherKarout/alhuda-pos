import { forwardRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

// material-ui
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'src/hooks/useAppDispatch'
import { useAppSelector } from 'src/hooks/useAppSelector'
import { setMenu } from 'src/redux-config/layout-slice'

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }: any) => {
  const theme: any = useTheme()
  const { t } = useTranslation('translation')
  const dispatch = useAppDispatch()
  const { opened } = useAppSelector((state) => state.layout)
  const matchesSM = useMediaQuery(theme.breakpoints.down('lg'))
  const location = useLocation()
  const Icon = item.icon
  const itemIcon = item?.icon ? (
    typeof Icon === 'string' ? (
      <img
        src={Icon}
        alt={item.title}
        style={{ color: '#393A6B', width: '25px', height: 'auto' }}
      />
    ) : (
      <Icon sx={{ color: '#393A6B' }} />
    )
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: 6,
        height: 6
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  )

  let itemTarget = '_self'
  if (item.target) {
    itemTarget = '_blank'
  }

  let listItemProps: any = {
    component: forwardRef((props: any, ref) => (
      <Link ref={ref} {...props} to={item.url} target={itemTarget} />
    ))
  }
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget }
  }

  const itemHandler = () => {
    if (matchesSM) dispatch(setMenu({ opened: !opened }))
  }
  const itemUrlObj = new URL(item.url, window.location.origin)
  const currentUrlObj = new URL(location.pathname + location.search, window.location.origin)
  const selected = itemUrlObj.pathname === currentUrlObj.pathname
  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: `12px`,
        mb: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
        // py: level > 1 ? 1 : 1.25,
        // pl: `${level * 24}px`,
        padding: '5px',
        flexDirection: 'column',
        color: selected ? theme.palette.primary.main : theme.palette.text.primary,
        '&:hover': {
          // backgroundColor: 'transparent !important',
          color: 'black !important'
        }
      }}
      selected={selected} ///to edit
      onClick={() => itemHandler()}
    >
      <ListItemIcon
        sx={{
          my: 'auto',
          minWidth: !item?.icon ? 18 : 36,
          color: 'grey.500',
          justifyContent: 'center'
        }}
      >
        {itemIcon}
        {/* {!item.icon && selected ? itemIcon : ""} */}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant={
              false ///to edit
                ? 'h5'
                : 'body1'
            }
            // color="grey.500"
            sx={{
              fontWeight: selected ? 'bold' : '',
              transition: 'all 0.3s ',
              // color: selected ? theme.palette.primary.main : theme.palette.text.primary,
              color: 'inherit !important',
              marginTop: '5px',
              fontSize: '10px',
              textAlign: 'center'
            }}
          >
            {t(item.title)}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography
              variant="caption"
              sx={{ ...theme.typography.subMenuCaption }}
              display="block"
              gutterBottom
            >
              {t(item.caption)}
            </Typography>
          )
        }
      />
      {/* {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )} */}
    </ListItemButton>
  )
}

export default NavItem
