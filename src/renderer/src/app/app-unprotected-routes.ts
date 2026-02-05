import { RouteObject } from 'react-router-dom'
import { changePasswordRoutes } from './change-password'
import { loginRoutes } from './login'
import { CasherLoginRoutes } from './casher-login'

const appRoutesUnprotected: RouteObject[] = [
  changePasswordRoutes,
  loginRoutes,
  CasherLoginRoutes
].flat()
export default appRoutesUnprotected
