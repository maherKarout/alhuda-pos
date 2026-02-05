import { FormikOnSubmitType, inputType } from 'src/types'
import GenerateForm from 'src/components/generate-form-component'
import { Yup } from 'src/validation'
import { useTranslation } from 'react-i18next'
import { DynamicFormTypeFields } from 'src/types'
import AuthorizedCheckWrapper from 'src/components/authorized-check-wrapper'
import { privilegeFeature } from 'src/shared/privileges'
import {
  useEditPosUsersMutation,
  useGetPosUsersByIdQuery,
  posUsersType,
  AddPosUsersType
} from '../services/api'
import { useParams } from 'react-router-dom'
import { promiseWrapper } from 'src/helpers/promise-wrapper'
import { useGetAllBranchesWithoutPaginationQuery } from '@renderer/app/branches/services/api'
import { useGetAllRoleQuery } from '@renderer/app/role/services/api'

function EditPosUsers() {
  const { t } = useTranslation('translation')
  const { id } = useParams()

  const [editPosUsers, { isLoading, isError }] = useEditPosUsersMutation()

  const { data: posUsersData, isLoading: isLoadingData } = useGetPosUsersByIdQuery(id ?? '', {
    skip: !id
  })

  const { isLoading: isLoadingRole, data, isError: isErrorRole } = useGetAllRoleQuery()
  const {
    isLoading: isLoadingBranches,
    data: branchesData,
    isError: isErrorBranches
  } = useGetAllBranchesWithoutPaginationQuery()

  const fields: DynamicFormTypeFields = [
    { name: 'fullName', label: t('Full Name'), inputType: inputType.text },
    { name: 'phoneNumber', label: t('Phone Number'), inputType: inputType.text },
    { name: 'username', label: t('Username'), inputType: inputType.text },
    {
      name: 'role',
      label: t('Role'),
      inputType: inputType.select,
      options: data?.data?.map((d, i) => ({ key: d.name, value: d.id }))
    },
    {
      name: 'pos',
      label: t('POS'),
      inputType: inputType.multiSelect,
      options: branchesData?.data?.map((d, i) => ({ key: d.location, value: d.id }))
    }
  ]

  const initialValues: Partial<AddPosUsersType> = {
    fullName: '',
    phoneNumber: '',
    username: '',
    role: '',
    pos: []
  }

  const validationSchema = Yup.object({
    fullName: Yup.text({ isRequired: true, max: 100 }),
    // phoneNumber: Yup.phoneNumber(['SY'], true),
    username: Yup.text({ isRequired: true, min: 3, max: 50 }),
    role: Yup.text({ isRequired: true }),
    pos: Yup.array().min(1, 'POS is required')
  })

  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (
    values,
    helpers,
    submitType
  ) => {
    // Convert pos from string to array if needed
    const processedValues = {
      ...values,
      pos: Array.isArray(values.pos) ? values.pos : [values.pos].filter(Boolean)
    }

    return promiseWrapper({
      fn: editPosUsers,
      helpers: helpers,
      dataToSend: { id, data: processedValues },
      isNew: false,
      submitType
    })
  }

  return (
    <GenerateForm
      title={t('Edit POS User')}
      isMultiLanguage={false}
      fields={fields}
      initialValues={posUsersData?.data || initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      isError={isErrorRole || isErrorBranches}
      loading={isLoading || isLoadingData || isLoadingRole || isLoadingBranches}
    />
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.pos,
  type: 'edit'
})(EditPosUsers)
