import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import SuspenseWrapper from 'src/components/suspenseWrapper'

const EditCustomers = SuspenseWrapper(lazy(() => import('src/app/customers/pages/edit-customers')))
const AllCustomers = SuspenseWrapper(lazy(() => import('src/app/customers/pages/all-customers')))
const AddCustomers = SuspenseWrapper(lazy(() => import('src/app/customers/pages/add-customers')))
const CustomerDetails = SuspenseWrapper(
  lazy(() => import('src/app/customers/pages/customer-details'))
)

const routes: RouteObject[] = [
  {
    path: '/customers',
    element: <AllCustomers />
  },
  {
    path: '/customers/add',
    element: <AddCustomers />
  },
  {
    path: '/customers/edit/:id',
    element: <EditCustomers />
  },
  {
    path: '/customers/details/:id',
    element: <CustomerDetails />
  }
]

export default routes
