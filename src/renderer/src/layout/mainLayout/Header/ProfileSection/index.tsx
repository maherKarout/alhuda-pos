import { useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'

// material-ui
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Switch,
  Typography,
  useMediaQuery
} from '@mui/material'

// third-party
import { useTheme } from '@emotion/react'
import PerfectScrollbar from 'react-perfect-scrollbar'
// project imports

// assets
import Popover from '@mui/material/Popover'
import { IconLogout, IconSettings } from '@tabler/icons-react'
import { useLogout } from '@renderer/hooks/use-logo-out'
import MainCard from 'src/components/cards/Main-card'
import { useAppSelector } from 'src/hooks/useAppSelector'
// import useGetDirection from "src/hooks/use-get-direction";
import useGetDirection from '@renderer/hooks/use-get-direction'
import { useTranslation } from 'react-i18next'
import { version } from '../../../../../../../package.json'
// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = ({ name }: { name: string }) => {
  const theme: any = useTheme()
  const navigate = useNavigate()
  const handleLogout = useLogout()
  const [sdm, setSdm] = useState(true)
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'))
  const dir = useGetDirection()
  const { account } = useAppSelector((state) => state.auth)
  const [value, setValue] = useState('')
  const [notification, setNotification] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [open, setOpen] = useState(false)
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef: any = useRef(null)
  const { i18n, t } = useTranslation()
  const ln = i18n.language
  const handleClose = (event: any) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setOpen(false)
  }

  const handleListItemClick = (event: any, index: any, route = '') => {
    setSelectedIndex(index)
    handleClose(event)

    if (route && route !== '') {
      navigate(route)
    }
  }
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          border: 'none',
          backgroundColor: theme.palette.background.default,

          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={account?.operator?.image}
            sx={(theme) => ({
              // ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer',
              background: theme.palette.primary.light
              // color: "#5e35b1  !important",
            })}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="h4" sx={(theme) => ({ color: theme.palette.primary.dark })}>
              {account?.username}
            </Typography>{' '}
            <IconSettings color="grey" stroke={1.5} size="1.5rem" />
          </Stack>
        }
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popover
        dir={dir}
        onClose={handleClose}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
      >
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <div>
              <MainCard
                border={false}
                elevation={16}
                content={false}
                boxShadow
                shadow={theme.shadows[16]}
              >
                <Box sx={{ p: 2 }}>
                  <Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="h4">{t('good_day')}</Typography>
                      <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                        {account?.username}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
                <PerfectScrollbar
                  style={{
                    height: '100%',
                    maxHeight: 'calc(100vh - 250px)',
                    overflowX: 'hidden'
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Divider />
                    <Card
                      sx={{
                        bgcolor: theme.palette.primary.light,
                        my: 2,
                        boxShadow: 'none'
                      }}
                    >
                      <CardContent>
                        <Grid container spacing={3} direction="column">
                          <Grid component="div" size={{ xs: 12 }}>
                            <Grid
                              component="div"
                              container
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Grid component="div" size={{ xs: 12 }}>
                                <Typography variant="subtitle1">{t('language')}</Typography>
                              </Grid>
                              <Grid component="div" size={{ xs: 12 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography>{t('english')}</Typography>
                                  <Switch
                                    checked={ln === 'en'}
                                    onChange={() => {
                                      i18n.changeLanguage(ln === 'ar' ? 'en' : 'ar')
                                      window.location.reload()
                                    }}
                                  />
                                </Stack>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    <Divider />
                    <List
                      component="nav"
                      sx={{
                        width: '100%',
                        maxWidth: 350,
                        minWidth: 300,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: '10px',
                        [theme.breakpoints.down('md')]: {
                          minWidth: '100%'
                        },
                        '& .MuiListItemButton-root': {
                          mt: 0.5
                        }
                      }}
                    >
                      <ListItemButton
                        sx={{
                          borderRadius: `${12}px`
                        }}
                        selected={selectedIndex === 0}
                        onClick={(event) => handleListItemClick(event, 0, '/update-my-info')}
                      >
                        <ListItemIcon>
                          <IconSettings stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="body2">{t('Account Settings')}</Typography>}
                        />
                      </ListItemButton>

                      <ListItemButton
                        sx={{
                          borderRadius: `${12}px`
                        }}
                        selected={selectedIndex === 4}
                        onClick={handleLogout}
                      >
                        <ListItemIcon>
                          <IconLogout stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="body2">{t('Logout')}</Typography>}
                        />
                      </ListItemButton>
                    </List>
                  </Box>
                </PerfectScrollbar>
                <Box sx={{ textAlign: 'center' }}>version:{version}</Box>
              </MainCard>
            </div>
          </ClickAwayListener>
        </Paper>
      </Popover>
    </>
  )
}

export default ProfileSection
