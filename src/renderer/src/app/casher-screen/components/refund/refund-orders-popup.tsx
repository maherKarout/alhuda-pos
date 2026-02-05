import { Box } from '@mui/material'
import { useAddCustomersMutation } from '@renderer/app/customers'
import SimpleDialog from '@renderer/components/dialog'
import { promiseWrapper } from '@renderer/helpers/promise-wrapper'
import { DynamicFormTypeFields, FormikOnSubmitType, inputType } from '@renderer/types'
import { useTranslation } from 'react-i18next'
import GenerateForm from 'src/components/generate-form-component'
import { Yup } from 'src/validation'
import useGetCustomers from '../../hooks/use-get-customers'
import { ItemType } from '../../hooks/use-casher-screen'
import OrderSelection from './order-selection'
import { TResponseInvoiceById } from '@renderer/app/invoices'
import OrderItems from './order-items'
import PopupConfirmRefund from './popup-confrim-refund'
import { useState } from 'react'
import OkButton from './ok-button'
type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type TInitialValuesType = {
  customerId: string
  orderId: string
  items: TResponseInvoiceById['products'][0][]
}
function RefundOrderPopup({ open, setOpen }: Props) {
  const { t } = useTranslation('translation')
  const [addCustomers, { isLoading, isError }] = useAddCustomersMutation()

  const [openConfirmPopup, setOpenConfirmPopup] = useState(false)
  const {
    data: customersData,
    isLoading: isLoadingCustomers,
    isError: isErrorCustomers
  } = useGetCustomers()

  const customersOptions = customersData?.data?.map((customer: any) => ({
    key: customer?.name,
    value: customer?.customerId
  }))
  const fields: DynamicFormTypeFields = [
    {
      inputType: inputType.select,
      name: 'customerId',
      label: t('Customer'),
      xs: 12,
      md: 6,
      options: customersOptions
    },
    {
      inputType: inputType.custom,
      name: 'orderId',
      label: t('Order'),
      xs: 12,
      md: 6,
      renderComponent: <OrderSelection />
    },
    {
      inputType: inputType.custom,
      name: 'orderId',
      label: t('Order'),
      xs: 12,
      md: 12,
      renderComponent: <OrderItems />
    },
    {
      inputType: inputType.custom,
      name: 'orderId',
      label: t('Order'),
      xs: 12,
      md: 12,
      renderComponent: (
        <PopupConfirmRefund
          open={openConfirmPopup}
          setOpen={setOpenConfirmPopup}
          closeRefundPopup={() => setOpen(false)}
        />
      )
    },
    {
      inputType: inputType.custom,
      name: 'orderId',
      label: t('Order'),
      xs: 12,
      md: 12,
      renderComponent: (
        <OkButton
          onClick={() => {
            setOpenConfirmPopup(true)
          }}
        />
      )
    }
  ]

  const initialValues: TInitialValuesType = {
    customerId: '',
    orderId: '',
    items: []
  }
  const validationSchema = Yup.object({})

  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (
    values,
    helpers,
    submitType
  ) => {
    setOpenConfirmPopup(true)
  }

  return (
    <SimpleDialog title={t('refund-order')} open={open} setOpen={setOpen} maxWidth="lg">
      <Box sx={{ width: '60vw', p: 0 }}>
        <GenerateForm
          title={t('')}
          isMultiLanguage={false}
          fields={fields}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          isError={isError}
          loading={isLoading}
          hideSubmitButton
        />
      </Box>
    </SimpleDialog>
  )
}

export default RefundOrderPopup
