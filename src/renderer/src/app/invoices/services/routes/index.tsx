import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import SuspenseWrapper from 'src/components/suspenseWrapper'

const AllInvoices = SuspenseWrapper(lazy(() => import('src/app/invoices/pages/all-invoices')))
const InvoicesDetails = SuspenseWrapper(
  lazy(() => import('src/app/invoices/pages/invoices-details'))
)

const routes: RouteObject[] = [
  {
    path: '/invoices',
    element: <AllInvoices />
  },

  {
    path: '/invoices/:id',
    element: <InvoicesDetails />
  }
]

export default routes
