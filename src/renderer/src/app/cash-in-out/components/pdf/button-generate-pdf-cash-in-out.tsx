import { Print as PrintIcon } from '@mui/icons-material'
import { Button, CircularProgress } from '@mui/material'
import { pdf } from '@react-pdf/renderer'
import { useAppSelector } from '@renderer/hooks/useAppSelector'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CashInOutPdf from './cash-in-out-pdf'

type ButtonGeneratePdfCashInOutProps = {
    setOpen: Function
    printData: any | null
}

function ButtonGeneratePdfCashInOut({ setOpen, printData }: ButtonGeneratePdfCashInOutProps) {
    const { t } = useTranslation('translation')
    const [isPrinting, setIsPrinting] = useState(false)
    const { account } = useAppSelector((state) => state.auth)

    const handlePrint = useCallback(async () => {
        try {
            setIsPrinting(true)
            const blob = await pdf(<CashInOutPdf account={account} printData={printData} />).toBlob()
            const blobUrl = URL.createObjectURL(blob)
            const printService = (window as any)?.printPdfFile?.printPdfFile

            if (typeof printService === 'function') {

                await printService(blobUrl)
            } else {
                alert('Electron print service not available, falling back to new window print.')
                console.warn('Electron print service not available, falling back to new window print.')
                const printWindow = window.open(blobUrl)
                printWindow?.addEventListener('beforeunload', () => URL.revokeObjectURL(blobUrl), {
                    once: true
                })
            }

            setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)
        } catch (error) {
            console.error('Failed to generate invoice PDF for printing', error)
        } finally {
            setIsPrinting(false)
            setOpen(false)
        }
    }, [account, printData, setOpen])

    return (
        <Button
            variant="outlined"
            startIcon={!isPrinting ? <PrintIcon /> : undefined}
            fullWidth
            onClick={handlePrint}
            disabled={isPrinting}
            sx={{
                py: 2,
                borderColor: '#E0E0E0',
                color: 'text.primary',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                width: '80%',
                maxWidth: 400,
                '&:hover': {
                    borderColor: '#BDBDBD',
                    backgroundColor: '#F5F5F5'
                }
            }}
        >
            {isPrinting ? <CircularProgress size={20} /> : t('Print Full Receipt')}
        </Button>
    )
}

export default ButtonGeneratePdfCashInOut