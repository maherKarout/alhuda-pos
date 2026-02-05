import { getSelectedBranch } from './get-set-branch-data'

const MANAGEMENT_BRANCH_ID = '80D0D318-E44D-4A00-9F7B-9DE4E45A9368'

/**
 * Checks if the currently selected branch is the management branch
 * @returns {boolean} True if the selected branch ID matches the management branch ID
 */
export const isManagementBranch = (): boolean => {
  const selectedBranchId = getSelectedBranch()
  return selectedBranchId === MANAGEMENT_BRANCH_ID
}
