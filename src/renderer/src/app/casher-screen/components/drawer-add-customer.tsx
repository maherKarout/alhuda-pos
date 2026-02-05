import { Box, Drawer } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import GenerateForm from '@renderer/components/generate-form-component'
import { DynamicFormTypeFields, inputType, FormikOnSubmitType } from '@renderer/types'
import { Yup } from '@renderer/validation'
import { useAddCustomersMutation } from '@renderer/app/customers'
import { promiseWrapper } from '@renderer/helpers/promise-wrapper'
import useCasherScreen from '../hooks/use-casher-screen'

type Props = {
  setOpen: Function
  open: boolean
  setInputValue: (value: string) => void
}

export interface CustomerFormData {
  name: string
  customerId?: string
  cuMobile: string
  cuStreet?: string
  cuDistrict?: string
  cuArea?: string
  cuCity?: string
  cuCountry?: string
}

const initialValues: CustomerFormData = {
  name: '',
  customerId: '',
  cuMobile: '',
  cuStreet: '',
  cuDistrict: '',
  cuArea: '',
  cuCity: '',
  cuCountry: ''
}

const validationSchema = Yup.object({
  name: Yup.text({ isRequired: true, max: 100 }),
  customerId: Yup.text({ isRequired: false, max: 100 }),
  cuMobile: Yup.number().typeError('invalid').required('required'),
  cuStreet: Yup.text({ isRequired: false, max: 200 }),
  cuDistrict: Yup.text({ isRequired: false, max: 100 }),
  cuArea: Yup.text({ isRequired: false, max: 100 }),
  cuCity: Yup.text({ isRequired: false, max: 100 }),
  cuCountry: Yup.text({ isRequired: false, max: 100 })
})

function DrawerAddCustomer({ open, setOpen, setInputValue }: Props) {
  const { t } = useTranslation('translation')
  const { orders, setOrders, currentOrder } = useCasherScreen()
  const [addCustomer, { isError }] = useAddCustomersMutation()

  const fields: DynamicFormTypeFields = [
    {
      inputType: inputType.text,
      name: 'name',
      label: t('Name'),
      xs: 12,
      md: 12
    },

    {
      inputType: inputType.text,
      name: 'cuMobile',
      label: t('Phone Number'),
      xs: 12,
      md: 12
    },
    {
      inputType: inputType.text,
      name: 'cuStreet',
      label: t('Street'),
      xs: 12,
      md: 12
    },
    {
      inputType: inputType.text,
      name: 'cuDistrict',
      label: t('District'),
      xs: 12,
      md: 12
    },
    {
      inputType: inputType.text,
      name: 'cuArea',
      label: t('Area'),
      xs: 12,
      md: 12
    },
    {
      inputType: inputType.text,
      name: 'cuCity',
      label: t('City'),
      xs: 12,
      md: 12
    },
    {
      inputType: inputType.text,
      name: 'cuCountry',
      label: t('Country'),
      xs: 12,
      md: 12
    }
  ]
  const onSubmit: FormikOnSubmitType<CustomerFormData> = async (values, helpers, submitType) => {
    return promiseWrapper({
      fn: addCustomer,
      helpers: helpers,
      dataToSend: values,
      isNew: true,
      submitType,
      customFeedback: (res) => {
        setOpen(false)
        setOrders?.((prev) => {
          const newOrders = [...prev]
          newOrders[currentOrder].customerId = res.data?.id as string
          return newOrders
        })
        setInputValue(values.name)
      }
    })
  }

  const handleCancel = () => {
    setOpen(false)
    setInputValue('')
  }

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      anchor="right"
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          paddingTop: '0px'
        }
      }}
    >
      <Box sx={{ p: '0px' }}>
        <GenerateForm
          title={t('Add Customer Details')}
          initialValues={initialValues}
          fields={fields}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          submitButtonTitle={t('Save')}
          loading={false}
          isError={false}
          submitButtonSx={{ minWidth: '250px' }}
        />
      </Box>
    </Drawer>
  )
}

export default DrawerAddCustomer
