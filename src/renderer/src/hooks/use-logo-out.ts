import { useAppDispatch } from './useAppDispatch'
import { logout } from '@renderer/app/login/services/slice'
import { resetGlobalConfig } from '@renderer/redux-config/global-config-slice'

export const useLogout = () => {
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    // Reset global config state
    dispatch(resetGlobalConfig())
    // Logout user
    dispatch(logout())
  }

  return handleLogout
}
