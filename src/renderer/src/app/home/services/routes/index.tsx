import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import SuspenseWrapper from 'src/components/suspenseWrapper'
const Home = SuspenseWrapper(lazy(() => import('src/app/home/pages')))

export default [
  {
    path: '/home',
    element: <Home />
  }
] as RouteObject[]
