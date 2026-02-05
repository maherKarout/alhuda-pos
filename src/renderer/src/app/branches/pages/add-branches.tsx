import { FormikOnSubmitType, inputType } from 'src/types'
import GenerateForm from 'src/components/generate-form-component'
import { Yup } from 'src/validation'
import { useTranslation } from 'react-i18next'
import { DynamicFormTypeFields } from 'src/types'
import AuthorizedCheckWrapper from 'src/components/authorized-check-wrapper'
import { privilegeFeature, privilegeKeys } from 'src/shared/privileges'
import { useAddBranchesMutation } from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import { showSuccessToasts } from 'src/components/toasts'
import { useEffect } from 'react'
import { useGetBranchesByIdQuery } from '../services/api'
import { navigateTo } from 'src/components/navigation-component'
import { promiseWrapper } from 'src/helpers/promise-wrapper'
import moment from 'moment'

function AddBranches() {
  const { t } = useTranslation('translation')

  const [addBranches] = useAddBranchesMutation()

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
      fn: addBranches,
      helpers: helpers,
      dataToSend: values,
      isNew: true,
      submitType
    })
  }

  return (
    <GenerateForm
      title={t('Add Branches')}
      isMultiLanguage={false}
      fields={fields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      isError={false}
      loading={false}
    />
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.pos,
  type: 'add'
})(AddBranches)
