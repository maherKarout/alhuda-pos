import React from 'react'
import { PDFViewer } from '@react-pdf/renderer'
import InvoicePdfFile from './generate-invoice-pdf'
import useInvoiceData from '../../hooks/use-invoice-data'

function InvoiceViewer() {
  const { invoiceData, invoiceLabels } = useInvoiceData()
  return (
    <PDFViewer width="100%" height="100%">
      <InvoicePdfFile data={invoiceData} labels={invoiceLabels} />
    </PDFViewer>
  )
}

export default InvoiceViewer
