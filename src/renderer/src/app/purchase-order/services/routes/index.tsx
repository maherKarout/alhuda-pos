import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import SuspenseWrapper from 'src/components/suspenseWrapper'
import { routeName } from 'src/shared/routeName'

const PurchaseOrder = SuspenseWrapper(
  lazy(() => import('src/app/purchase-order/pages/purchase-order'))
)
const AllPurchaseOrder = SuspenseWrapper(
  lazy(() => import('src/app/purchase-order/pages/all-purchase'))
)

const routes: RouteObject[] = [
  {
    path: routeName.PURCHASE_ORDER,
    element: <PurchaseOrder />
  },
  {
    path: routeName.PURCHASE_ORDER + '/:id',
    element: <PurchaseOrder />
  },
  {
    path: routeName.ALL_PURCHASE_ORDER,
    element: <AllPurchaseOrder />
  }
]

export default routes
