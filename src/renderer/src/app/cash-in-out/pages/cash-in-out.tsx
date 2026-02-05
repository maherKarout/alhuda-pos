import { useGetCasherBoxMutation } from '@renderer/app/casher-screen'
import { setCasherBox } from '@renderer/app/login/services/slice'
import MainCard from '@renderer/components/cards/Main-card'
import { useAppDispatch } from '@renderer/hooks/useAppDispatch'
import { useAppSelector } from '@renderer/hooks/useAppSelector'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AuthorizedCheckWrapper, { ComponentPropsType } from 'src/components/authorized-check-wrapper'
import { MuiTabs } from 'src/components/mui-tabs'
import { privilegeFeature } from 'src/shared/privileges'
import CashInForm from '../components/cash-in/cash-in-form'
import CashOutForm from '../components/cash-out/cash-out-form'
import SuccessPopup from '../components/success-popup/success-popup'

function CashInOut({ canEdit, canDelete }: ComponentPropsType) {
  const { t } = useTranslation('translation')
  const [open, setOpen] = useState(false)
  const [printData, setPrintData] = useState<any | null>(null)
  const [getCasherBox, { isLoading: isLoadingGetCasherBox }] = useGetCasherBoxMutation()
  const dispatch = useAppDispatch()

  const onSuccess = () => {
    setOpen(true)
    getCasherBox()
      .unwrap()
      .then((res) => {
        dispatch(setCasherBox(res))
      })
  }
  const tabs = [
    {
      label: 'cashIn',
      content: <CashInForm onSuccess={onSuccess} onSetPrintData={setPrintData} />
    },
    {
      label: 'cashOut',
      content: <CashOutForm onSuccess={onSuccess} onSetPrintData={setPrintData} />
    }
  ]

  return (
    <MainCard title={t('cash-in-out')}>
      <MuiTabs tabs={tabs} ariaLabel="cash in out tabs" />
      {/* <PDFViewer width="100%" height="1000px">
        <CashInOutPdf account={account} />
      </PDFViewer> */}
      <SuccessPopup open={open} setOpen={setOpen} printData={printData} />
    </MainCard>
  )
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.order,
  type: 'view'
})(CashInOut)
