import { CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import { Avatar, Box, Card, CardContent, Stack, Typography } from '@mui/material'
import SimpleDialog from '@renderer/components/dialog'
import { useTranslation } from 'react-i18next'
import ButtonGeneratePdfCashInOut from '../pdf/button-generate-pdf-cash-in-out'

type Props = {
  open: boolean
  setOpen: Function
  printData: any | null
}
function SuccessPopup({ setOpen, open, printData }: Props) {
  const { t } = useTranslation('translation')
  const handleNewOrder = () => {
    setOpen(false)
  }
  return (
    <SimpleDialog
      title=""
      open={open}
      setOpen={setOpen}
    >
      <Card sx={{ minHeight: '300px', width: '400px', display: 'flex', flexDirection: 'column', padding: "20px" }}>
        <CardContent sx={{ flex: 1, padding: 4 }}>
          <Stack
            spacing={4}
            alignItems="center"
            justifyContent="center"
            sx={{ height: '100%', textAlign: 'center' }}
          >
            {/* Success Icon */}
            <Box>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: '#E8F5E8',
                  margin: '0 auto',
                  mb: 2
                }}
              >
                <CheckCircleIcon
                  sx={{
                    fontSize: 50,
                    color: '#4CAF50'
                  }}
                />
              </Avatar>
            </Box>
            {/* Success Message */}
            <Box>
              <Typography variant="h4" fontWeight="bold" color="#4CAF50" sx={{ mb: 2 }}>
                {t('Payment Successful')}
              </Typography>
              <Typography variant="h5" fontWeight="500" color="text.secondary">
                {/* SYP {totalAmount.toLocaleString()} */}
              </Typography>
            </Box>
            <ButtonGeneratePdfCashInOut setOpen={setOpen} printData={printData} />
          </Stack>
        </CardContent>
      </Card>
    </SimpleDialog>
  )
}

export default SuccessPopup
