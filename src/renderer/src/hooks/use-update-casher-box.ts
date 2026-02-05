import { useCallback } from 'react'
import { useGetCasherBoxMutation } from '@renderer/app/casher-screen/services/api'
import { useAppDispatch } from '@renderer/hooks/useAppDispatch'
import { setCasherBox } from '@renderer/app/login/services/slice'

function useUpdateCasherBox() {
  //TODO need to check this code
  const dispatch = useAppDispatch()
  const [getCasherBox] = useGetCasherBoxMutation()

  const updateCasherBox = useCallback(async () => {
    try {
      const res = await getCasherBox().unwrap()
      dispatch(setCasherBox(res))
    } catch (error) {
      // Ignore errors here; caller can handle their own error UI if needed
    }
  }, [dispatch, getCasherBox])

  return updateCasherBox
}

export default useUpdateCasherBox
