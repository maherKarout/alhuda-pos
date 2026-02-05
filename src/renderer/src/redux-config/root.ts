import { combineReducers } from '@reduxjs/toolkit'
import authReducer from 'src/app/login/services/slice'
import layoutReducer from 'src/redux-config/layout-slice'
import globalConfigReducer from 'src/redux-config/global-config-slice'
import { api } from './store'
/// you need to add every slice reducer you created here
export const root = () => {
  return combineReducers({
    [api.reducerPath]: api.reducer,
    layout: layoutReducer,
    auth: authReducer,
    globalConfig: globalConfigReducer
  })
}
