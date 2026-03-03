import { useGetAllBranchesWithoutPaginationQuery } from '@renderer/app/branches'
import { useGetAllRoleQuery } from '@renderer/app/role/services/api'
import DynamicInput from '@renderer/components/formik-input'
import { isManagementBranch } from '@renderer/helpers/is-management-branch'
import { useField } from 'formik'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { inputType } from 'src/types'

function BranchesSelector() {
  const [field, meta, helpers] = useField('role')
  const { t } = useTranslation('translation')
  const { data: roleData } = useGetAllRoleQuery()

  const {
    isLoading: isLoadingBranches,
    data: branchesData,
    isError: isErrorBranches
  } = useGetAllBranchesWithoutPaginationQuery()

  const roleOption = useMemo(
    () => roleData?.data?.find((d, i) => d.id === field.value),
    [field.value]
  )
  if (!roleOption?.isNeedBrash) return null
  return (
    <DynamicInput
      name="pos"
      label={t('POS')}
      inputType={inputType.multiSelect}
      options={branchesData?.data?.map((d, i) => ({ key: d.name, value: d.id }))}
    />
  )
}

export default BranchesSelector
