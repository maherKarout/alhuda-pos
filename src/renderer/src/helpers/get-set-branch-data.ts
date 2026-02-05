const SELECTED_BRANCH_KEY = 'selectedBranchId'
const SELECTED_BRANCH_NAME_KEY = 'selectedBranchName'

// Helper functions for localStorage
export const saveSelectedBranch = (branchId: string, branchName: string) => {
  localStorage.setItem(SELECTED_BRANCH_KEY, branchId)
  localStorage.setItem(SELECTED_BRANCH_NAME_KEY, branchName)
}

export const getSelectedBranch = (): string | null => {
  return localStorage.getItem(SELECTED_BRANCH_KEY)
}

export const clearSelectedBranch = () => {
  localStorage.removeItem(SELECTED_BRANCH_KEY)
  localStorage.removeItem(SELECTED_BRANCH_NAME_KEY)
}

export const getSelectedBranchName = (): string | null => {
  return localStorage.getItem(SELECTED_BRANCH_NAME_KEY)
}
