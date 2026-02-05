import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsServerOnline } from '../redux-config/global-config-slice'

function useCheckWhenServerByOnline() {
  const dispatch = useDispatch()
  const isServerOnline = useSelector((state: any) => state.globalConfig.isServerOnline)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    const checkServer = async () => {
      try {
        const result = await window.api.checkServerOnline()
        console.log('🚀 ~ checkServer ~ result:', result)
        if (result) {
          dispatch(setIsServerOnline(true))
        }
      } catch (error) {
        console.log('🚀 ~ checkServer ~ error:', error)
        // Keep it false if it fails
        dispatch(setIsServerOnline(true))
        throw new Error('Error checking server online')
      }
    }

    // Only start interval if server is currently offline
    if (!isServerOnline) {
      interval = setInterval(checkServer, 10000) // 10 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isServerOnline, dispatch])
}

export default useCheckWhenServerByOnline
