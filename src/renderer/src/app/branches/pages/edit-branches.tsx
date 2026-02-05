import { FormikOnSubmitType, inputType } from 'src/types'
import GenerateForm from 'src/components/generate-form-component'
import { Yup } from 'src/validation'
import { useTranslation } from 'react-i18next'
import { DynamicFormTypeFields } from 'src/types'
import AuthorizedCheckWrapper from 'src/components/authorized-check-wrapper'
import { privilegeFeature, privilegeKeys } from 'src/shared/privileges'
import { useEditBranchesMutation } from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import { showSuccessToasts } from 'src/components/toasts'
import { useEffect } from 'react'
import { useGetBranchesByIdQuery } from '../services/api'
import { navigateTo } from 'src/components/navigation-component'
import { promiseWrapper } from 'src/helpers/promise-wrapper'
import moment from 'moment'

function EditBranches() {
  const { t } = useTranslation('translation')
  const { id } = useParams()

  const [editBranches, { isLoading, isError }] = useEditBranchesMutation()

  const { data: branchesData, isLoading: isLoadingData } = useGetBranchesByIdQuery(id ?? '', {
    skip: !id
  })

  const fields: DynamicFormTypeFields = [
    { name: 'title', label: t('title'), inputType: inputType.text },
    { name: 'location', label: t('location'), inputType: inputType.text }
  ]

  const initialValues = {}

  const validationSchema = Yup.object({
    title: Yup.text({ isRequired: true }),
    location: Yup.text({ isRequired: true })
  })

  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (
    values,
    helpers,
    submitType
  ) => {
    return promiseWrapper({
      fn: editBranches,
      helpers: helpers,
      dataToSend: { id, data: values },
      isNew: false,
      submitType
    })
  }

  return (
    <GenerateForm
      title={t('Edit Branches')}
      isMultiLanguage={false}
      fields={fields}
      initialValues={branchesData || initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      isError={isError}
      loading={isLoading || isLoadingData}
    />
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.pos,
  type: 'edit'
})(EditBranches)
