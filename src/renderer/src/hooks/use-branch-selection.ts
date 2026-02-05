import { getSelectedBranch } from '@renderer/helpers/get-set-branch-data'
import { useState, useEffect } from 'react'
import { useAppDispatch } from './useAppDispatch'
import { api } from '@renderer/redux-config/store'

/**
 * Hook to manage branch selection on app launch
 * Returns whether the branch selection popup should be shown
 */
export function useBranchSelection() {
  const [showBranchSelection, setShowBranchSelection] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Check if branch is already selected in localStorage
    const selectedBranchId = getSelectedBranch()

    if (!selectedBranchId) {
      // No branch selected, show popup
      setShowBranchSelection(true)
    }

    setIsChecking(false)
  }, [])

  const handleBranchSelected = () => {
    setShowBranchSelection(false)
    // Invalidate Cashers tag to trigger refetch in casher login screen
    dispatch(api.util.invalidateTags(['Cashers'] as any))
  }

  return {
    showBranchSelection,
    isChecking,
    handleBranchSelected
  }
}
