import { configureStore } from '@reduxjs/toolkit'
import { root } from './root'
import storage from 'redux-persist/lib/storage'
import { PERSIST, REHYDRATE, persistReducer, persistStore } from 'redux-persist'
import { featureApiGenerator } from './feature-api-generator'
import { setupListeners } from '@reduxjs/toolkit/query'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'globalConfig'] 
}
// the api instance
export const api = featureApiGenerator({ name: 'api' })

const persistedReducer = persistReducer(persistConfig, root())

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [REHYDRATE, PERSIST] }
    }).concat(api.middleware)
})
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const persister = persistStore(store)
