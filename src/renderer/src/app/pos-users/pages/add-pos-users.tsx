import { FormikOnSubmitType, inputType } from 'src/types'
import GenerateForm from 'src/components/generate-form-component'
import { Yup } from 'src/validation'
import { useTranslation } from 'react-i18next'
import { DynamicFormTypeFields } from 'src/types'
import AuthorizedCheckWrapper from 'src/components/authorized-check-wrapper'
import { privilegeFeature, privilegeKeys } from 'src/shared/privileges'
import { useAddPosUsersMutation, AddPosUsersType } from '../services/api'
import { promiseWrapper } from 'src/helpers/promise-wrapper'
import { useGetAllRoleQuery } from '@renderer/app/role/services/api'
import { useGetAllBranchesWithoutPaginationQuery } from '@renderer/app/branches/services/api'

function AddPosUsers() {
  const { t } = useTranslation('translation')

  const [addPosUsers, { isError }] = useAddPosUsersMutation()
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
    { name: 'password', label: t('password'), inputType: inputType.password },
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
      options: branchesData?.data?.map((d, i) => ({ key: d.name, value: d.id }))
    }
  ]

  const initialValues: AddPosUsersType = {
    fullName: '',
    phoneNumber: '',
    username: '',
    password: '',
    role: '',
    pos: []
  }

  const validationSchema = Yup.object({
    fullName: Yup.text({ isRequired: true, max: 100 }),
    phoneNumber: Yup.phoneNumber(['SY'], true),
    username: Yup.text({ isRequired: true, min: 3, max: 50 }),
    password: Yup.string()
      .length(4, 'Password must be exactly 4 characters')
      .matches(/^\d{4}$/, 'Password must be a 4-digit number'),
    role: Yup.text({ isRequired: true }),
    pos: Yup.array().min(1, 'POS is required')
  })

  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (
    values,
    helpers,
    submitType
  ) => {
    return promiseWrapper({
      fn: addPosUsers,
      helpers: helpers,
      dataToSend: values,
      isNew: true,
      submitType
    })
  }

  return (
    <GenerateForm
      title={t('Add POS User')}
      isMultiLanguage={false}
      fields={fields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      isError={isErrorRole || isErrorBranches}
      loading={isLoadingRole || isLoadingBranches}
    />
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.pos,
  type: 'add'
})(AddPosUsers)
