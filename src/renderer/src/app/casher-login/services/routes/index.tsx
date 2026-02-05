import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import SuspenseWrapper from 'src/components/suspenseWrapper'

const CasherLogin = SuspenseWrapper(lazy(() => import('src/app/casher-login/pages/casher-login')))

const routes: RouteObject[] = [
  {
    path: '/casher-login',
    element: <CasherLogin />
  }
]

export default routes
