import { pdf } from '@react-pdf/renderer'
import React, { useCallback, useState } from 'react'
import useInvoiceData from '../../hooks/use-invoice-data'
import InvoicePdfFile from './generate-invoice-pdf'
import { Button, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Print as PrintIcon } from '@mui/icons-material'

function DownloadPdfInvoice() {
  const { invoiceData, invoiceLabels } = useInvoiceData()
  const { t } = useTranslation('translation')
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = useCallback(async () => {
    try {
      setIsPrinting(true)
      const blob = await pdf(<InvoicePdfFile data={invoiceData} labels={invoiceLabels} />).toBlob()
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
    }
  }, [invoiceData, invoiceLabels])

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

export default DownloadPdfInvoice
