import { HashRouter as Router } from 'react-router-dom'
import Routes from './routes'
import Toasts from './components/toasts'
import NavigationComponent from './components/navigation-component'
import { useGetExchangeRatesMutation } from './app/casher-screen/services/api'
import { useGlobalConfig } from './hooks/use-global-config'
import PopupForceSelectBranch from './components/select-brach/popup-select-branch'
import AutoUpdateNotification from './components/auto-update-notification'

function App() {
  // const [getExchangeRates] = useGetExchangeRatesMutation()
  // const { actions } = useGlobalConfig()

  // Handle offline ready state
  // const token = store.getState().auth.token
  // useEffect(() => {
  //   if (token) {
  //     window.electronLocalStorage.setItem('token', token)
  //   }
  // }, [token])

  return (
    <div className="App">
      <PopupForceSelectBranch />
      <AutoUpdateNotification />

      <Router>
        <Routes />
        <Toasts />
        <NavigationComponent />
      </Router>
    </div>
  )
}

export default App
