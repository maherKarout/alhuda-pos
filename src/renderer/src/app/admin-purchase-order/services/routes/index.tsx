import { routeName } from '@renderer/shared/routeName'
import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import SuspenseWrapper from 'src/components/suspenseWrapper'

const AllAdminPurchaseOrder = SuspenseWrapper(
  lazy(() => import('src/app/admin-purchase-order/pages/all-admin-purchase-order'))
)
const AllAdminPurchaseOrderInvoices = SuspenseWrapper(
  lazy(() => import('src/app/admin-purchase-order/pages/all-admin-purchase-order-invoices'))
)
const EditAdminOrderPurchase = SuspenseWrapper(
  lazy(() => import('src/app/admin-purchase-order/pages/edit-admin-order-purchase'))
)
const ReviewAdminPurchaseOrderInvoice = SuspenseWrapper(
  lazy(() => import('src/app/admin-purchase-order/pages/review-admin-purchase-order-invoice'))
)

const routes: RouteObject[] = [
  {
    path: routeName.SUPER_ADMIN_PURCHASE_ORDER,
    element: <AllAdminPurchaseOrder />
  },
  {
    path: routeName.ADMIN_PURCHASE_ORDER_INVOICES,
    element: <AllAdminPurchaseOrderInvoices />
  },
  {
    path: `${routeName.SUPER_ADMIN_PURCHASE_ORDER}/:id`,
    element: <EditAdminOrderPurchase />
  },
  { 
    path: `${routeName.ADMIN_PURCHASE_ORDER_INVOICES}/:id`,
    element: <ReviewAdminPurchaseOrderInvoice />
  }
]

export default routes
