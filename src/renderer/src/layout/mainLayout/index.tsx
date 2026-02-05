import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

// material-ui
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material'
import { styled as muiStyled, useTheme } from '@mui/material/styles'

// project imports

// assets
import FreezeScreen from '@renderer/components/hand-over/freeze-screen'
import { useEffect } from 'react'
import { useAppDispatch } from 'src/hooks/useAppDispatch'
import { useAppSelector } from 'src/hooks/useAppSelector'
import { setMenu } from 'src/redux-config/layout-slice'
import Header from './Header'
import Sidebar from './Sidebar'
import useSynData from '@renderer/hooks/use-sync-data'
import useCheckWhenServerByOnline from '@renderer/hooks/use-check-when-server-by-online'

const drawerWidth = 260
// Define the props interface for the Main component
interface MainProps {
  open: boolean
}

// styles
const Main = muiStyled('main')<MainProps>(({ theme, open }) => ({
  backgroundColor: theme.palette.background.default,
  width: '100%',
  minHeight: 'calc(100vh - 70px)',
  flexGrow: 1,
  padding: '10px',
  marginTop: '70px',
  marginRight: '10px',
  // marginLeft: "200px",
  borderRadius: `12px`,
  ...(!open && {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    [theme.breakpoints.up('md')]: {
      marginLeft: -(drawerWidth - 10),
      width: `calc(100% - ${drawerWidth}px)`
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px',
      width: `calc(100% - ${drawerWidth}px)`,
      padding: '16px'
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10px',
      width: `calc(100% - ${drawerWidth}px)`,
      padding: '16px',
      marginRight: '10px'
    }
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: `calc(100% - ${drawerWidth}px)`,
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px'
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10px'
    }
  })
}))

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  useSynData()
  useCheckWhenServerByOnline()
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'))
  // Handle left drawer
  const leftDrawerOpened = useAppSelector((state) => state.layout.opened)
  const dispatch = useAppDispatch()
  const handleLeftDrawerToggle = () => {
    dispatch(setMenu({ opened: !leftDrawerOpened }))
  }
  const { token, account } = useAppSelector((state) => state.auth)
  const { waitConfirmHandOver } = useAppSelector((state) => state.globalConfig)

  const isLoggedOut = token === 'invalid'
  useEffect(() => {
    if (!token || isLoggedOut)
      navigate('/casher-login', { state: isLoggedOut ? '/' : location.pathname })
    if (!isLoggedOut && token && !account) navigate('/change-password')
  }, [location.pathname, token])

  if (!token || isLoggedOut)
    return <Navigate to="/casher-login" state={isLoggedOut ? '/' : location.pathname} />
  return (
    <Box sx={{ display: 'flex', bgcolor: theme.palette.background.paper }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.paper,
          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none',
          zIndex: 10,
          // minHeight: "30px",
          height: '70px'
        }}
      >
        <Toolbar sx={{ bgcolor: theme.palette.background.paper }}>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar
        drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened}
        drawerToggle={handleLeftDrawerToggle}
      />
      <FreezeScreen open={!!waitConfirmHandOver} />

      {/* main content */}
      <Main open={leftDrawerOpened}>
        <Outlet />
      </Main>
    </Box>
  )
}

export default MainLayout
