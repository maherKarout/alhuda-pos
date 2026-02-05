import { FormikOnSubmitType, inputType } from 'src/types'
import GenerateForm from 'src/components/generate-form-component'
import { Yup } from 'src/validation'
import { useTranslation } from 'react-i18next'
import { DynamicFormTypeFields } from 'src/types'
import AuthorizedCheckWrapper from 'src/components/authorized-check-wrapper'
import { privilegeFeature, privilegeKeys } from 'src/shared/privileges'
import { useEditInventoryMutation } from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import { showSuccessToasts } from 'src/components/toasts'
import { useEffect } from 'react'
import { useGetInventoryByIdQuery } from '../services/api'
import { navigateTo } from 'src/components/navigation-component'
import { promiseWrapper } from 'src/helpers/promise-wrapper'
import moment from 'moment'

function EditInventory() {
  const { t } = useTranslation('translation')
  const { id } = useParams()

  const [editInventory, { isLoading, isError }] = useEditInventoryMutation()

  const { data: inventoryData, isLoading: isLoadingData } = useGetInventoryByIdQuery(id ?? '', {
    skip: !id
  })

  const fields: DynamicFormTypeFields = [
    { name: '', label: t(''), inputType: inputType.text },
    { name: '', label: t(''), inputType: inputType.select },
    { name: '', label: t(''), inputType: inputType.checkbox },
    { name: '', label: t(''), inputType: inputType.fileEditor },
    { name: '', label: t(''), inputType: inputType.date }
  ]

  const initialValues = {}

  const validationSchema = Yup.object({
    text: Yup.text({ isRequired: true }),
    select: Yup.text({ isRequired: true }),
    checkbox: Yup.text({ isRequired: true }),
    fileeditor: Yup.text({ isRequired: true }),
    date: Yup.dateRequired()
  })

  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (
    values,
    helpers,
    submitType
  ) => {
    return promiseWrapper({
      fn: editInventory,
      helpers: helpers,
      dataToSend: { id, data: values },
      isNew: false,
      submitType
    })
  }

  return (
    <GenerateForm
      title={t('Edit Inventory')}
      isMultiLanguage={false}
      fields={fields}
      initialValues={inventoryData || initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      isError={isError}
      loading={isLoading || isLoadingData}
    />
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.order,
  type: 'edit'
})(EditInventory)
