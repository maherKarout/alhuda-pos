import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import AuthorizedCheckWrapper from 'src/components/authorized-check-wrapper'
import GenerateForm from 'src/components/generate-form-component'
import { promiseWrapper } from 'src/helpers/promise-wrapper'
import { privilegeFeature } from 'src/shared/privileges'
import { DynamicFormTypeFields, FormikOnSubmitType, inputType } from 'src/types'
import { Yup } from 'src/validation'
import { useEditCustomersMutation, useGetCustomersByIdQuery } from '../services/api'

function EditCustomers() {
  const { t } = useTranslation('translation')
  const { id } = useParams()

  const [editCustomers] = useEditCustomersMutation()

  const { data: customersData, isFetching: isLoadingData } = useGetCustomersByIdQuery(id ?? '')

  const fields: DynamicFormTypeFields = [
    { name: 'name', label: t('Name'), inputType: inputType.text },
    { name: 'phone', label: t('Phone'), inputType: inputType.text }
  ]

  let initialValues = {
    name: customersData?.data.name,
    phone: customersData?.data.phone
  }

  const validationSchema = Yup.object({
    name: Yup.text({ isRequired: true }),
    phone: Yup.text({ isRequired: true })
  })

  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (
    values,
    helpers,
    submitType
  ) => {
    const payload = {
      name: values.name || '',
      phone: Number(values.phone) || 0
    }

    return promiseWrapper({
      fn: editCustomers,
      helpers: helpers,
      dataToSend: { id, data: payload },
      isNew: false,
      submitType
    })
  }
  return (
    <GenerateForm
      title={t('Edit Customers')}
      isMultiLanguage={false}
      fields={fields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      loading={isLoadingData}
    />
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.customer,
  type: 'edit'
})(EditCustomers)
