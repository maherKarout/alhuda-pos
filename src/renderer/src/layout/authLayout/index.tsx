import { styled } from '@mui/material'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppSelector } from 'src/hooks/useAppSelector'
import { getSelectedBranch } from '@renderer/helpers/get-set-branch-data'
const AuthWrapper1 = styled('div')(({ theme }) => ({
  // backgroundColor: theme.palette.primary.light,
  minHeight: '100vh'
}))

const AuthLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, account } = useAppSelector((state) => state.auth)
  const unProtectedRoutes = ['/casher-login', '/login']
  const isLoggedOut = token === 'invalid'
  const isMainegerBranch = getSelectedBranch() === "80D0D318-E44D-4A00-9F7B-9DE4E45A9368"
  const navigationPath = isMainegerBranch ? '/login' : '/casher-login';

  useEffect(() => {
    if (!token || isLoggedOut) {
      if (isMainegerBranch) navigate(navigationPath, { replace: false, state: location.state })
      if (unProtectedRoutes.includes(location.pathname)) {
        return
      }
      navigate(navigationPath, { replace: false, state: location.state })
    } else if (token && !isLoggedOut && account) navigate(location.state ?? '/', { replace: true })
    if (token && !isLoggedOut && !account) navigate('/change-password', { state: location.state })
  }, [location.pathname, token])

  return (
    <AuthWrapper1>
      <Outlet />
    </AuthWrapper1>
  )
}

export default AuthLayout
