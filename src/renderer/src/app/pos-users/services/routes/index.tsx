import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import SuspenseWrapper from 'src/components/suspenseWrapper'

const EditPosUsers = SuspenseWrapper(lazy(() => import('src/app/pos-users/pages/edit-pos-users')))
const AllPosUsers = SuspenseWrapper(lazy(() => import('src/app/pos-users/pages/all-pos-users')))
const AddPosUsers = SuspenseWrapper(lazy(() => import('src/app/pos-users/pages/add-pos-users')))

const routes: RouteObject[] = [
  {
    path: '/pos-users',
    element: <AllPosUsers />
  },
  {
    path: '/pos-users/add',
    element: <AddPosUsers />
  },
  {
    path: '/pos-users/edit/:id',
    element: <EditPosUsers />
  }
]

export default routes
