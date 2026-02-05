import { Button } from '@mui/material'
import { useFormikContext } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TInitialValuesType } from './refund-orders-popup'

type Props = {
  onClick: () => void
}
function OkButton({ onClick }: Props) {
  const { t } = useTranslation('translation')
  const { values } = useFormikContext<TInitialValuesType>()

  const isDisabled =
    (values?.items?.length ?? 0) > 0
      ? values.items.every((item: any) => item.quantity === item.mainQuantity)
      : true

  return (
    <Button
      sx={{ margin: 'auto', display: 'block', width: '100px' }}
      variant="contained"
      disabled={isDisabled}
      onClick={() => onClick()}
    >
      {t('ok')}
    </Button>
  )
}

export default OkButton
