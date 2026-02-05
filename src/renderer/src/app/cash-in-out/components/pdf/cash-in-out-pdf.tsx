import { Document, Image, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
// import kufiStandardFont from '@renderer/assets/fonts/KufiStandard-Regular.ttf'
import logoUrl from 'src/assets/images/black-icon.png'
import balooBhaijaan2Font from '@renderer/assets/fonts/BalooBhaijaan2-Regular.ttf'
import { useTranslation } from 'react-i18next'
import { getSelectedBranchName } from '@renderer/helpers/get-set-branch-data'

// --- STYLESHEET ---
Font.register({
  family: 'BalooBhaijaan2',
  fonts: [{ src: balooBhaijaan2Font }]
})

const defaultInvoiceData = {
  companyArabicName: 'الهدى للبياضات',
  telephonePrefix: 'هاتف:',
  branchPhone: '55 123 4567',
  recipientName: '',
  amountReceived: 0,
  thankYouMessage: 'شكراً لزيارتكم .'
}

const formatAmount = (amount: number) => {
  return amount.toFixed(2)
}

const formatDate = (dateString: any) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (timeString: any) => {
  const time = new Date(timeString)
  return time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

type CashInOutPrintData = {
  // 'cashIn' => سند قبض, 'cashOut' => سند دفع
  kind?: 'cashIn' | 'cashOut'
  // Raw customer identifier and resolved display name
  customerId?: string
  customerName?: string
  // Raw reason code and already-translated reason label (for cash-out)
  reason?: string
  reasonLabel?: string
  // Optional free-text notes
  notes?: string
  amount?: {
    usd?: number
    syp?: number
  }
  amountType?: 'usd' | 'syp'
}

function CashInOutPdf({
  account,
  printData
}: {
  account: any
  printData?: CashInOutPrintData | null
}) {
  console.log("🚀 ~ CashInOutPdf ~ printData:", printData)
  const { t } = useTranslation('translation')
  const styles = StyleSheet.create({
    page: {
      backgroundColor: 'white',
      padding: 11, // Increased from 10
      fontFamily: 'BalooBhaijaan2',
      direction: 'rtl'
    },

    text: {
      fontSize: 10, // Increased from 9
      color: 'black',
      fontWeight: 'bold'
    },

    header: {
      textAlign: 'center',
      marginBottom: 9, // Increased from 8
      fontWeight: 'bold',
      fontSize: 14, // Increased from 13
      color: 'black'
    },

    divider: {
      borderTopWidth: 2, // Increased from 1
      borderTopStyle: 'dashed',
      borderTopColor: 'black',
      marginVertical: 5 // Increased from 8
    },

    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 5, // Increased from 4
      borderBottomWidth: 2, // Increased from 1
      borderBottomColor: 'black',
      borderBottomStyle: 'solid',
      fontSize: 12, // Increased from 11
      fontWeight: 'bold',
      direction: 'rtl'
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 3, // Increased from 2
      direction: 'rtl',
      alignItems: 'flex-start'
    },

    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 6, // Increased from 5
      fontSize: 12, // Increased from 11
      fontWeight: 'bold',
      direction: 'rtl'
    },
    amountText: {
      textAlign: 'left',
      fontSize: 12 // Increased from 11
    },
    labelText: {
      textAlign: 'right',
      fontSize: 12 // Increased from 11
    },

    footer: {
      textAlign: 'center',
      marginTop: 8 // Increased from 15
    },

    arabicText: {
      textAlign: 'right',
      direction: 'rtl'
    },
    rightAligned: {
      textAlign: 'right'
    },
    centerAligned: {
      textAlign: 'center'
    },
    quantityColumn: {
      width: '30%',
      textAlign: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })

  // Map the stored form data into the structure needed by the PDF
  const activeAmountType: 'usd' | 'syp' =
    printData?.amountType ||
    (printData?.amount?.usd && printData.amount.usd > 0 ? 'usd' : 'syp')

  const mappedInvoiceData = {
    ...defaultInvoiceData,
    accountName: getSelectedBranchName(),
    recipientName:
      printData?.customerName ||
      printData?.customerId ||
      printData?.reasonLabel ||
      printData?.reason ||
      defaultInvoiceData.recipientName,
    amountReceived:
      (activeAmountType === 'usd'
        ? printData?.amount?.usd
        : printData?.amount?.syp) ?? defaultInvoiceData.amountReceived,
    currencySymbol: activeAmountType === 'usd' ? 'USD' : 'SYP'
  }
  return (
    <Document>
      <Page size={{ width: 198, height: 600 }} style={styles.page}>
        <View style={styles.header}>
          <Image src={logoUrl} style={{ width: 51, height: 51, marginLeft: 11, margin: 'auto' }} />
          <Text style={{ fontWeight: 700, marginBottom: 5, fontSize: 15 }}>
            {mappedInvoiceData.companyArabicName}
          </Text>
          <Text style={styles.text}>
            {mappedInvoiceData.telephonePrefix}
            {mappedInvoiceData.branchPhone}
          </Text>
          <Text style={{ ...styles.text, fontSize: 12 }}>
            {printData?.kind === 'cashOut' ? 'سند دفع' : 'سند قبض'}
          </Text>
        </View>
        <View style={styles.divider} />

        <View
          style={{
            marginBottom: 12,
            direction: 'rtl',
            paddingHorizontal: 6,
            fontSize: 11
          }}
        >
          {/* Fixed Spacing: Added space before the colon */}
          {printData?.kind === 'cashIn' ? <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginBottom: 9,
              paddingLeft: 6
            }}
          >
            <Text
              style={{
                fontWeight: 700, // Used numeric 700
                fontSize: 11,
                borderBottom: '0px dashed black',
                textAlign: 'center',
                paddingBottom: 3
              }}
            >
              {mappedInvoiceData.recipientName || 'غير محدد'}
            </Text>
            <Text style={{ fontSize: 11, textAlign: 'center', fontWeight: 700 }}>
              : تم الاستلام من السيد{' '}
            </Text>
          </View> :
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: 9,
                paddingLeft: 6
              }}
            >
              <Text
                style={{
                  fontWeight: 700, // Used numeric 700
                  fontSize: 11,
                  borderBottom: '0px dashed black',
                  textAlign: 'center',
                  paddingBottom: 3
                }}
              >
                {printData?.reasonLabel || 'غير محدد'}
              </Text>
              <Text style={{ fontSize: 11, textAlign: 'center', fontWeight: 700 }}>
                تم تسديد الى { }
              </Text>
            </View>}

          {/* Fixed Spacing: Added space before the colon */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginBottom: 3,
              paddingLeft: 6
            }}
          >
            <Text
              style={{
                fontWeight: 700, // Used numeric 700
                fontSize: 11,
                borderBottom: '0px dashed black',
                textAlign: 'center',
                paddingBottom: 3
              }}
            >
              {mappedInvoiceData.accountName}
            </Text>
            <Text style={{ fontSize: 11, textAlign: 'center' }}>{printData?.kind === "cashOut" ? t('من صندوق') : ": إلى حساب "}</Text>
          </View>

          {/* Fixed Spacing: Added space before the colon */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginBottom: 13,
              paddingLeft: 6
            }}
          >
            <Text
              style={{
                fontWeight: 700, // Used numeric 700
                fontSize: 12,
                color: '#000',
                borderBottom: '0px dashed black',
                textAlign: 'center',
                paddingBottom: 3
              }}
            >
              {' ' + mappedInvoiceData.currencySymbol + ' '}
              {priceToDecimalPrice(formatAmount(mappedInvoiceData.amountReceived))}
            </Text>
            <Text style={{ fontSize: 12, textAlign: 'center', fontWeight: 700 }}>: مبلغ قدره </Text>
          </View>



          <Text style={{ fontSize: 10, marginTop: 5, textAlign: 'center', fontWeight: 400 }}>
            {printData?.notes}
          </Text>

          <Text style={{ fontSize: 10, marginTop: 5, textAlign: 'center', fontWeight: 400 }}>
            {formatDate(new Date())} {formatTime(new Date())}
          </Text>
          <Text style={{ fontSize: 10, marginTop: 5, textAlign: 'center', fontWeight: 400 }}>
            {account?.username}
          </Text>
        </View>

        <View style={styles.divider} />
        <View style={styles.footer}>
          <Text style={{ fontSize: 10, marginBottom: 3, textAlign: 'center' }}>
            {mappedInvoiceData.thankYouMessage}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default CashInOutPdf
