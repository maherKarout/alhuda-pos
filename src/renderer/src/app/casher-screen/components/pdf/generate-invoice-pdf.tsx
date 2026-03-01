import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
import React from 'react'
import balooBhaijaan2Font from '@renderer/assets/fonts/BalooBhaijaan2-Regular.ttf'
// import kufiStandardFont from '@renderer/assets/fonts/KufiStandard-Regular.ttf'
import logoUrl from 'src/assets/images/black-icon.png'

// --- STYLESHEET ---
Font.register({
  family: 'BalooBhaijaan2',
  fonts: [{ src: balooBhaijaan2Font, fontWeight: 400 }]
})

// Font.register({
//   family: 'Kufi Standard',
//   fonts: [
//     { src: kufiStandardFont, fontWeight: 400 },
//     { src: kufiStandardFont, fontWeight: 700 }
//   ]
// })

const styles = StyleSheet.create({
  // CRITICAL: Custom page size for 80mm receipt roll.
  // 80mm (8cm) is approximately 226.77 points (1 point = 1/72 inch).
  // Height is set large (e.g., 500mm or ~1417 points) for a continuous roll.
  page: {
    backgroundColor: 'white',
    padding: 10,
    fontFamily: 'BalooBhaijaan2',
    direction: 'rtl' // RTL layout for entire page
    // width: "200px",
    // height: "200px"
  },

  // General text styling for the receipt body
  text: {
    fontSize: 9,
    color: 'black'
  },

  // Header section
  header: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 13,
    color: 'black'
  },

  // Divider (created using a border line)
  divider: {
    borderTopWidth: 1,
    borderTopStyle: 'dashed',
    borderTopColor: 'black',
    marginVertical: 8
  },

  // Item List Header/Row structure (using flex for columns)
  // RTL order: Amount (left), Quantity (center), Item (right)
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    fontSize: 11,
    fontWeight: 'bold',
    direction: 'rtl'
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    direction: 'rtl',
    alignItems: 'flex-start'
  },

  // Total line structure
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    fontSize: 11,
    fontWeight: 'bold',
    direction: 'rtl'
  },
  // Left-aligned for numbers (RTL standard)
  amountText: {
    textAlign: 'left',
    fontSize: 11
  },
  // Right-aligned for labels (RTL standard)
  labelText: {
    textAlign: 'right',
    fontSize: 11
  },

  // Footer
  footer: {
    textAlign: 'center',
    marginTop: 15
  },

  // Specific styles for right-aligned Arabic text
  arabicText: {
    textAlign: 'right',
    direction: 'rtl' // Explicitly set text direction
  },
  rightAligned: {
    textAlign: 'right'
  },
  centerAligned: {
    textAlign: 'center'
  },
  // Ensure the quantity prefix ('x') aligns to the left of the number
  quantityColumn: {
    width: '30%', // Adjust width as needed
    textAlign: 'center',
    flexDirection: 'row', // To align 'x' and number
    justifyContent: 'center',
    alignItems: 'center'
  }
})

interface InvoiceItem {
  name: string
  quantity: number
  amount: number
}

export interface InvoiceData {
  branchPhone: string
  orderNumber: string
  date: string
  time: string
  cashierName?: string
  customerName?: string
  items: InvoiceItem[]
  subtotal: number
  discount: number
  discountPercentage?: number
  tax: number
  total: number
  balance: number
}

interface InvoiceLabels {
  companyName: string
  companyArabicName: string
  branchName: string
  orderPrefix: string
  discountPrefix: string
  discountSuffix: string
  taxLabel: string
  subtotalLabel: string
  totalLabel: string
  balanceLabel: string
  quantityPrefix: string
  telephonePrefix: string
  itemHeader: string
  quantityHeader: string
  amountHeader: string
  thankYouMessage: string
  visitAgainMessage: string
  customerLabel: string
  userLabel: string
  printDateLabel: string
}

interface InvoicePdfProps {
  data: InvoiceData
  labels: InvoiceLabels
}

const InvoicePdfFile = ({ data, labels }: InvoicePdfProps) => {
  // Merge data and labels for easier access
  const invoiceData = {
    ...data,
    ...labels,
    orderDate: data.date,
    orderTime: data.time,
    branchPhone: data.branchPhone
  }
  const formatAmount = (amount: number) => {
    return amount.toFixed(2)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    const time = new Date(timeString)
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <Document>
      <Page size={{ width: 198, height: 600 }} style={styles.page}>
        {/* <Page size={"LETTER"} style={styles.page} > */}
        {/* Header */}
        <View style={styles.header}>
          <Image src={logoUrl} style={{ width: 50, height: 50, marginLeft: 10, margin: 'auto' }} />
          <Text style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>
            {invoiceData.companyArabicName}
          </Text>
          {/* {invoiceData.companyName && (
            <Text style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>
              {invoiceData.companyName}
            </Text>
          )} */}
          {invoiceData.branchName && (
            <Text style={{ ...styles.text, marginBottom: 2 }}>{invoiceData.branchName}</Text>
          )}
          <Text style={styles.text}>
            {invoiceData.telephonePrefix}
            {invoiceData.branchPhone}
          </Text>
        </View>
        {/* Divider */}
        <View style={styles.divider} />
        {/* Order Info */}
        <View style={{ textAlign: 'center', marginBottom: 8, direction: 'rtl' }}>
          <Text style={{ fontSize: 9, marginBottom: 4, fontWeight: 'bold' }}>
            {invoiceData.orderPrefix}
            {invoiceData.orderNumber}
          </Text>
          {invoiceData.customerName && (
            <Text style={{ fontSize: 9, marginBottom: 2, fontWeight: 'bold' }}>
              {invoiceData.customerLabel}: {invoiceData.customerName}
            </Text>
          )}
          {invoiceData.cashierName && (
            <Text style={{ fontSize: 9, marginBottom: 2, fontWeight: 'bold' }}>
              {invoiceData.userLabel}: {invoiceData.cashierName}
            </Text>
          )}
          <Text style={{ fontSize: 9, marginBottom: 2, fontWeight: 'bold' }}>
            {formatDate(invoiceData.orderDate)} • {formatTime(invoiceData.orderTime)}
          </Text>
        </View>
        {/* Items Header Row - RTL order: Amount (left), Quantity (center), Item (right) */}
        <View style={styles.itemHeader}>
          <Text style={{ width: '35%', textAlign: 'left', fontWeight: 'bold' }}>
            {invoiceData.amountHeader}
          </Text>
          <Text style={{ width: '15%', textAlign: 'center', fontWeight: 'bold' }}>
            {invoiceData.quantityHeader}
          </Text>
          <Text style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>
            {invoiceData.itemHeader}
          </Text>
        </View>
        {/* Items List */}
        <View style={{ marginBottom: 8 }}>
          {invoiceData.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              {/* Amount - left aligned */}
              <Text style={{ width: '35%', textAlign: 'left', fontSize: 9 }}>
                {priceToDecimalPrice(formatAmount(item.amount))}
              </Text>
              {/* Quantity - center aligned */}
              <View
                style={{
                  width: '15%',
                  textAlign: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text style={{ fontSize: 9 }}>{invoiceData.quantityPrefix}</Text>
                <Text style={{ fontSize: 9 }}>{item.quantity}</Text>
              </View>
              {/* Item name - right aligned */}
              <Text style={{ width: '50%', textAlign: 'right', fontSize: 9 }}>{item.name}</Text>
            </View>
          ))}
        </View>
        {/* Divider */}
        <View style={styles.divider} />
        {/* Totals Section - RTL: values on left, labels on right */}
        <View style={{ marginBottom: 8 }}>
          {/* Subtotal */}
          <View style={styles.itemRow}>
            <Text style={{ width: '50%', textAlign: 'left', fontSize: 9 }}>
              {priceToDecimalPrice(formatAmount(invoiceData.subtotal))}
            </Text>
            <Text style={{ width: '50%', textAlign: 'right', fontSize: 9, fontWeight: 'bold' }}>
              {invoiceData.subtotalLabel}
            </Text>
          </View>

          {/* Discount */}
          <View style={styles.itemRow}>
            <Text style={{ width: '50%', textAlign: 'left', fontSize: 9 }}>
              {priceToDecimalPrice(formatAmount(invoiceData.discount))}
            </Text>
            <Text style={{ width: '50%', textAlign: 'right', fontSize: 9, fontWeight: 'bold' }}>
              {invoiceData.discountPrefix}
              {(invoiceData.discountPercentage ?? 0) > 0
                ? `(-${invoiceData.discountPercentage}%)`
                : ''}
            </Text>
          </View>

          {/* Tax (if uncommented) */}
          {/*
            <View style={styles.itemRow}>
              <Text style={{ width: '50%', textAlign: 'left' }}>{priceToDecimalPrice(formatAmount(invoiceData.tax))}</Text>
              <Text style={{ width: '50%', textAlign: 'right' }}>{invoiceData.taxLabel}</Text>
            </View>
            */}
        </View>
        {/* Divider */}
        <View style={styles.divider} />
        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={{ ...styles.amountText, fontWeight: 'bold' }}>
            {priceToDecimalPrice(formatAmount(invoiceData.total + invoiceData.discount))}
          </Text>
          <Text style={{ ...styles.labelText, fontWeight: 'bold' }}>{invoiceData.totalLabel}</Text>
        </View>
        {/* Balance/Change */}
        {/* <View style={styles.totalRow}>
          <Text style={{ ...styles.amountText, fontWeight: 'bold' }}>
            {priceToDecimalPrice(formatAmount(invoiceData.balance || 0))}
          </Text>
          <Text style={{ ...styles.labelText, fontWeight: 'bold' }}>
            {invoiceData.balanceLabel}
          </Text>
        </View> */}
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ fontSize: 9, marginBottom: 2, textAlign: 'center' }}>
            {invoiceData.thankYouMessage}
          </Text>
          <Text style={{ fontSize: 9, textAlign: 'center' }}>{invoiceData.visitAgainMessage}</Text>
          <Text style={{ fontSize: 8, marginTop: 4, textAlign: 'center' }}>
            {invoiceData.printDateLabel}: {formatDate(invoiceData.orderDate)}{' '}
            {formatTime(invoiceData.orderTime)}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default InvoicePdfFile
