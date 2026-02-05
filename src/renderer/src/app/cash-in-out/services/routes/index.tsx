import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import SuspenseWrapper from 'src/components/suspenseWrapper'

const CashInOut = SuspenseWrapper(lazy(() => import('src/app/cash-in-out/pages/cash-in-out')))

const routes: RouteObject[] = [
  {
    path: '/cash-in-out',
    element: <CashInOut />
  }
]

export default routes
