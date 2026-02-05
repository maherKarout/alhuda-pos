import { useAppDispatch } from './useAppDispatch'
import { setExchangeRates } from 'src/redux-config/global-config-slice'
import { useAppSelector } from './useAppSelector'

export const useGlobalConfig = () => {
  const dispatch = useAppDispatch()
  const globalConfig = useAppSelector((state) => state.globalConfig)

  return {
    exchangeRates: globalConfig.exchangeRates,
    actions: {
      setExchangeRates: (rates: any[]) => dispatch(setExchangeRates(rates))
    }
  }
}
