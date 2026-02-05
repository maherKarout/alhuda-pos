import { FormikOnSubmitType, inputType } from 'src/types'
import GenerateForm from 'src/components/generate-form-component'
import { Yup } from 'src/validation'
import { useTranslation } from 'react-i18next'
import { DynamicFormTypeFields } from 'src/types'
import AuthorizedCheckWrapper from 'src/components/authorized-check-wrapper'
import { privilegeFeature, privilegeKeys } from 'src/shared/privileges'
import { useAddCustomersMutation } from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import { showSuccessToasts } from 'src/components/toasts'
import { useEffect } from 'react'
import { useGetCustomersByIdQuery } from '../services/api'
import { navigateTo } from 'src/components/navigation-component'
import { promiseWrapper } from 'src/helpers/promise-wrapper'
import moment from 'moment'
import { CustomerFormData } from '@renderer/app/casher-screen/components/drawer-add-customer'

function AddCustomers() {
  const { t } = useTranslation('translation')

  const [addCustomers, { isLoading, isError }] = useAddCustomersMutation()

  const fields: DynamicFormTypeFields = [
    {
      inputType: inputType.text,
      name: 'name',
      label: t('Name'),
      xs: 12,
      md: 6
    },

    {
      inputType: inputType.text,
      name: 'cuMobile',
      label: t('cuMobile'),
      xs: 12,
      md: 6
    },
    // {
    //   inputType: inputType.text,
    //   name: 'cuPhone2',
    //   label: t('Phone 2'),
    //   xs: 12,
    //   md: 6
    // },
    // {
    //   inputType: inputType.text,
    //   name: 'cuPhone1',
    //   label: t('Phone 1'),
    //   xs: 12,
    //   md: 6
    // },
    {
      inputType: inputType.text,
      name: 'cuStreet',
      label: t('Street'),
      xs: 12,
      md: 6
    },
    {
      inputType: inputType.text,
      name: 'cuDistrict',
      label: t('District'),
      xs: 12,
      md: 6
    },
    {
      inputType: inputType.text,
      name: 'cuArea',
      label: t('Area'),
      xs: 12,
      md: 6
    },
    {
      inputType: inputType.text,
      name: 'cuCity',
      label: t('City'),
      xs: 12,
      md: 6
    },
    {
      inputType: inputType.text,
      name: 'cuCountry',
      label: t('Country'),
      xs: 12,
      md: 6
    }
  ]

  const initialValues: CustomerFormData = {
    name: '',
    customerId: '',
    cuMobile: '',
    // cuPhone1: '',
    // cuPhone2: '',
    cuStreet: '',
    cuDistrict: '',
    cuArea: '',
    cuCity: '',
    cuCountry: ''
  }

  const validationSchema = Yup.object({
    name: Yup.text({ isRequired: true, max: 100 }),
    customerId: Yup.text({ isRequired: false, max: 100 }),
    cuMobile: Yup.number().required('Mobile number is required'),
    // cuPhone1: Yup.number().required('Mobile number is required'),
    // cuPhone2: Yup.number().required('Mobile number is required'),
    cuStreet: Yup.text({ isRequired: false, max: 200 }),
    cuDistrict: Yup.text({ isRequired: false, max: 100 }),
    cuArea: Yup.text({ isRequired: false, max: 100 }),
    cuCity: Yup.text({ isRequired: false, max: 100 }),
    cuCountry: Yup.text({ isRequired: false, max: 100 })
  })

  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (
    values,
    helpers,
    submitType
  ) => {
    return promiseWrapper({
      fn: addCustomers,
      helpers: helpers,
      dataToSend: values,
      isNew: true,
      submitType
    })
  }

  return (
    <GenerateForm
      title={t('Add Customers')}
      isMultiLanguage={false}
      fields={fields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      isError={isError}
      loading={isLoading}
    />
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.customer,
  type: 'add'
})(AddCustomers)
