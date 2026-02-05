import { routeName } from '@renderer/shared/routeName'
import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import SuspenseWrapper from 'src/components/suspenseWrapper'

const EditInventory = SuspenseWrapper(lazy(() => import('src/app/inventory/pages/edit-inventory')))
const AllInventory = SuspenseWrapper(lazy(() => import('src/app/inventory/pages/all-inventory')))

const routes: RouteObject[] = [
  {
    path: `/${routeName.INVENTORY}`,
    element: <AllInventory />
  },

  {
    path: `/${routeName.INVENTORY}/edit/:id`,
    element: <EditInventory />
  }
]

export default routes
