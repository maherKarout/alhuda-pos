import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Box, Button, Card, CardContent, Stack, Typography, TextField, Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import useCasherScreen from '../hooks/use-casher-screen'
import { getTotalAmountForOrder } from '../utils/calc-total-amount'
import {
  BodyOrder,
  useAddOrderCustomerInvoiceMutation,
  useAddOrderMutation,
  useCustomerOrderMutation,
  useGetCasherBoxMutation,
  useUpdateCustomerOrderMutation
} from '../services/api'
import GenericButton from '@renderer/components/generic-button'
import { setCasherBox } from '@renderer/app/login/services/slice'
import { useAppDispatch } from 'src/hooks/useAppDispatch'
import { CurrencyGuid, PaidStatus, TypeOrder } from '@renderer/consts'
import { setExchangeRates } from '@renderer/redux-config/global-config-slice'
import { useGlobalConfig } from '@renderer/hooks/use-global-config'
import { decimalPriceToNumber, priceToDecimalPrice } from '@renderer/helpers/price-to-decimal-price'
import { roundToNearest } from './helper/round-to-nearset'
import { useGetConfigForPosQuery } from '@renderer/app/config'
import useIsUpdateCustomerOrder from '../hooks/use-is-update-customer-order'
import { useGetInvoicesByIdQuery } from '@renderer/app/invoices'
import {
  CURRENCIES,
  getBaseCurrency,
  createEmptyAmountObject,
  getCurrencyGuid
} from '@renderer/config/currencies'
import { useAppSelector } from '@renderer/hooks/useAppSelector'
import CurrencyInputField from './currency-input-field'

interface CurrencyCalculations {
  [key: string]: number // Dynamic: { syp: number, usd: number, ... }
}

function PricingAndCurrency() {
  const { isServerOnline } = useAppSelector((state) => state.globalConfig)
  const isUpdateCustomerOrder = useIsUpdateCustomerOrder()
  const idOrderCustomer = useIsUpdateCustomerOrder()

  const { data: customerOrderData } = useGetInvoicesByIdQuery(idOrderCustomer as string, {
    skip: !isUpdateCustomerOrder
  })
  const { data: configData } = useGetConfigForPosQuery()
  const approximation = configData?.approximationRatio || 0
  const { t } = useTranslation('translation')
  const dispatch = useAppDispatch()
  const { exchangeRates } = useGlobalConfig()
  const { orders, setOrders, currentOrder, ResponseInvoiceDetails, discount } = useCasherScreen()
  const baseCurrency = getBaseCurrency()

  // Get exchange rates for all currencies
  const getExchangeRate = (currencyCode: string): number => {
    return exchangeRates?.find((rate) => rate.code === currencyCode)?.price || 1
  }

  const [addOrder] = useAddOrderMutation()
  const [addCustomerOrder] = useCustomerOrderMutation()
  const [updateCustomerOrder] = useUpdateCustomerOrderMutation()
  const [addOrderCustomerInvoice] = useAddOrderCustomerInvoiceMutation()
  const [getCasherBox] = useGetCasherBoxMutation()

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Input states for dynamic columns - using Record to support all currencies
  const [amountReceived, setAmountReceived] =
    useState<Record<string, number>>(createEmptyAmountObject())
  const [cashOut, setCashOut] = useState<Record<string, number>>(createEmptyAmountObject())
  const [hardDiscount, setHardDiscount] = useState(0)

  // Get total amount from order context using utility function
  const items = orders[currentOrder]?.items || []
  const totalAmount = getTotalAmountForOrder(items, {
    taxAmount: 0, // Auto tax (fixed amount)
    discountType: discount?.type,
    discountAmount: discount?.amount
  })
  // ====================== Is Customer Order ======================
  const isCustomerOrder = orders[currentOrder]?.type === TypeOrder.RESERVATION

  // Get current order type
  const currentOrderType = orders[currentOrder]?.type || TypeOrder.NORMAL

  // Button titles based on order type
  const buttonTitles = {
    [TypeOrder.NORMAL]: {
      back: t('Back'),
      confirmSaleWithDiscount: t('confirm sale with discount'),
      confirmSaleWithTransfer: t('confirm sale with transfer remaining'),
      discountValue: t('discount value'),
      discountPercentage: t('discount percentage'),
      remainingForCustomer: t('remaining for customer account')
    },
    [TypeOrder.RESERVATION]: {
      back: t('Back'),
      confirmSaleWithDiscount: t('confirm booking with discount'),
      confirmSaleWithTransfer: t('confirm booking with transfer remaining'),
      discountValue: t('discount value'),
      discountPercentage: t('discount percentage'),
      remainingForCustomer: t('remaining for customer account')
    }
  }

  // Get current button titles based on order type
  const titles = buttonTitles[currentOrderType]

  // Calculations based on provided formulas
  const calculations = useMemo((): CurrencyCalculations => {
    const result: CurrencyCalculations = {}
    const baseCode = baseCurrency.code

    // 1. Calculate Total Value Received in terms of Base Currency (SYP)
    // Start with Base payments
    let totalReceivedInBase = amountReceived[baseCode] - cashOut[baseCode]

    // Add every other currency payment converted to Base
    CURRENCIES.forEach((currency) => {
      if (currency.code !== baseCode) {
        const rate = getExchangeRate(currency.code)
        totalReceivedInBase += (amountReceived[currency.code] - cashOut[currency.code]) * rate
      }
    })

    // 2. Calculate the "True Remaining" amount in Base
    const trueRemainingBase = totalAmount - totalReceivedInBase
    result[baseCode] = +trueRemainingBase.toFixed(3)

    // 3. Convert that ONE remaining balance into all other currencies
    CURRENCIES.forEach((currency) => {
      if (currency.code !== baseCode) {
        const rate = getExchangeRate(currency.code)

        // If I owe 450,000 SYP, I owe (450,000 / Rate) in this currency
        const currencyValue = trueRemainingBase / rate
        result[currency.code] = +currencyValue.toFixed(3)
      }
    })

    return result
  }, [totalAmount, amountReceived, cashOut, baseCurrency, exchangeRates])

  const handleBack = () => {
    if (!setOrders || currentOrder === undefined) return
    setOrders((prev) => {
      const newOrders = [...prev]
      newOrders[currentOrder] = {
        ...newOrders[currentOrder],
        currentStep: Math.max(0, newOrders[currentOrder].currentStep - 1)
      }
      return newOrders
    })
  }

  const handleConfirmSale = useCallback(
    (orderDiscount?: number) => {
      console.log('🚀 ~ PricingAndCurrency ~ orderDiscount:', orderDiscount)
      // Check if button is disabled
      // if (calculations.syp !== 0 && calculations.usd !== 0) {
      //   return
      // }
      if (setOrders && currentOrder !== undefined) {
        setOrders((prev) => {
          const newOrders = [...prev]
          newOrders[currentOrder] = {
            ...newOrders[currentOrder],
            orderDiscount: orderDiscount
          }
          return newOrders
        })
      }

      // Build amount object for API (keeping current format for backward compatibility)
      const amountForAPI: Record<string, number> = {}
      CURRENCIES.forEach((currency) => {
        amountForAPI[currency.code] = amountReceived[currency.code] - cashOut[currency.code]
      })

      // For backward compatibility, ensure usd and syp are present
      const amount: { usd: number; syp: number; [key: string]: number } = {
        usd: amountForAPI.usd || 0,
        syp: amountForAPI.syp || 0,
        ...amountForAPI
      }

      const body: BodyOrder = {
        items: items.map((item) => ({
          productGuid: item.id,
          quantity: item.quantity,
          itemNote: item?.note
        })),
        amount: amount,
        paymentMethod: 'CASH',
        currency:
          (getCurrencyGuid(baseCurrency.code) as unknown as CurrencyGuid) || CurrencyGuid.SYP,
        status: PaidStatus.paid,
        customer: orders[currentOrder]?.customerId || '',
        // orderId: new Date().getTime().toString(),
        totalPrice: orderDiscount ? +totalAmount : +totalAmount + -calculations[baseCurrency.code],
        // orderDiscount: orderDiscount,
        orderDiscount: orderDiscount ?? calculations[baseCurrency.code],
        // approximationDiscountValue: orderDiscount !== undefined ? roundToNearest(+totalAmount, approximation) - +totalAmount : undefined,
        approximationDiscountValue:
          Math.trunc(roundToNearest(+totalAmount, approximation) - +totalAmount) ?? 0,
        customerOrderId: idOrderCustomer as string | undefined
      }
      // ====================== Send total amount to customer order ======================
      if (isCustomerOrder) {
        body.totalPrice = +totalAmount
      }
      // const fun = isCustomerOrder ? idOrderCustomer ? updateCustomerOrder : addCustomerOrder : idOrderCustomer ? addOrderCustomerInvoice : addOrder
      let fun

      if (isCustomerOrder) {
        // Case 1: This is a Customer Order
        if (idOrderCustomer) {
          fun = updateCustomerOrder // Update existing
        } else {
          fun = addCustomerOrder // Add new
        }
      } else {
        // Case 2: This is a normal Order
        if (idOrderCustomer) {
          fun = addOrderCustomerInvoice // Add invoice (???)
        } else {
          fun = addOrder // Add new
        }
      }
      if (!isServerOnline) {
        setIsSubmitting(true)
        fun = window.api.createLocalOrder
        fun(body).then(() => {
          dispatch(setCasherBox({ typeUpdate: 'update-with-calc', values: body.amount }))
          // Advance to payment successful step (step 2)
          if (!setOrders || currentOrder === undefined) return
          setOrders((prev) => {
            const newOrders = [...prev]
            newOrders[currentOrder] = {
              ...newOrders[currentOrder],
              currentStep: newOrders[currentOrder].currentStep + 1
            }
            return newOrders
          })
          setIsSubmitting(false)
        })
        return
      }
      setIsSubmitting(true)
      fun(body)
        .unwrap()
        .then((res) => {
          setIsSubmitting(false)
          ResponseInvoiceDetails.current = {
            billNumber: res?.billNumber,
            customerBalance: res?.customerBalance,
            orderGuid: res?.orderGuid
          }
          getCasherBox()
            .unwrap()
            .then((res) => {
              dispatch(setCasherBox(res))
              // dispatch(setExchangeRates(res))
            })
            .catch((error) => {
              console.log(error)
            })
          // Advance to payment successful step (step 2)
          if (!setOrders || currentOrder === undefined) return
          setOrders((prev) => {
            const newOrders = [...prev]
            newOrders[currentOrder] = {
              ...newOrders[currentOrder],
              currentStep: newOrders[currentOrder].currentStep + 1
            }
            return newOrders
          })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    },
    [
      calculations,
      amountReceived,
      cashOut,
      baseCurrency,
      ResponseInvoiceDetails,
      currentOrder,
      items,
      orders,
      totalAmount,
      isCustomerOrder,
      idOrderCustomer,
      getCasherBox,
      dispatch,
      addOrder,
      addCustomerOrder,
      updateCustomerOrder,
      addOrderCustomerInvoice
    ]
  )

  // Handle Enter key press
  // useEffect(() => {
  //   const handleKeyPress = (event: KeyboardEvent) => {
  //     if (event.key === 'Enter') {
  //       event.preventDefault()
  //       handleConfirmSale()
  //     }
  //   }

  //   window.addEventListener('keydown', handleKeyPress)

  //   return () => {
  //     window.removeEventListener('keydown', handleKeyPress)
  //   }
  // }, [handleConfirmSale])

  // const isConfirmSaleDisabled = calculations.syp !== 0 && calculations.usd !== 0

  const isConfirmSaleDisabled = roundToNearest(+totalAmount, approximation) < +totalAmount
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, padding: 3 }}>
        <Stack spacing={3} sx={{ height: '100%' }}>
          {/* To Pay Section */}
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{
              backgroundColor: (theme) => theme.palette.action.hover,
              borderRadius: 2,
              padding: 3,
              textAlign: 'center'
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('To Pay')}
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary.main"
                sx={{ fontSize: '2.2rem' }}
              >
                {baseCurrency.label} {totalAmount.toLocaleString()}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0, fontSize: '2.2rem' }}>
              ≈
            </Typography>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('Approximation')}
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="success.main"
                sx={{ fontSize: '2.2rem' }}
              >
                {baseCurrency.label} {roundToNearest(+totalAmount, approximation).toLocaleString()}
              </Typography>
            </Box>
          </Stack>

          {/* Currency Table with Fixed First Column */}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            {/* Table Headers */}
            <Grid container spacing={0} sx={{ mb: 2 }}>
              {/* Fixed Column Header */}
              <Grid size={4}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ padding: 1 }}
                >
                  {t('Total in currencies')}
                </Typography>
              </Grid>

              {/* Dynamic Column Headers */}
              <Grid size={4}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ padding: 1, textAlign: 'center' }}
                >
                  {t('Amount Received')}
                </Typography>
              </Grid>

              <Grid size={4}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ padding: 1, textAlign: 'center' }}
                >
                  {t('Cash Out')}
                </Typography>
              </Grid>
            </Grid>

            {/* Dynamic Currency Rows */}
            {CURRENCIES.map((currency) => (
              <Grid
                key={currency.code}
                container
                spacing={0}
                sx={{ mb: currency.code !== CURRENCIES[CURRENCIES.length - 1].code ? 1 : 0 }}
              >
                {/* Fixed Column - Currency */}
                <Grid size={4}>
                  <Box
                    sx={(theme) => ({
                      backgroundColor: (theme) => theme.palette.action.hover,
                      padding: 2,
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`
                    })}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 40 }}>
                        {currency.label}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {calculations[currency.code]?.toLocaleString() || '0'}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>

                {/* Dynamic Columns - Amount Received */}
                <Grid size={4}>
                  <Box sx={{ padding: 1 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={
                        amountReceived[currency.code] === 0
                          ? ''
                          : priceToDecimalPrice(amountReceived[currency.code]?.toString() || '0') ||
                            ''
                      }
                      onChange={(e) => {
                        const newValue = decimalPriceToNumber(e.target.value) || 0
                        setAmountReceived((prev) => ({
                          ...prev,
                          [currency.code]: newValue
                        }))
                      }}
                      placeholder="00"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          textAlign: 'center'
                        }
                      }}
                      inputProps={{
                        style: { textAlign: 'center' }
                      }}
                    />
                  </Box>
                </Grid>

                {/* Dynamic Columns - Cash Out */}
                <Grid size={4}>
                  <Box sx={{ padding: 1 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={
                        cashOut[currency.code] === 0
                          ? ''
                          : priceToDecimalPrice(cashOut[currency.code]?.toString() || '0') || ''
                      }
                      onChange={(e) => {
                        const newValue = decimalPriceToNumber(e.target.value) || 0
                        setCashOut((prev) => ({
                          ...prev,
                          [currency.code]: newValue
                        }))
                      }}
                      placeholder="00"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          textAlign: 'center'
                        }
                      }}
                      inputProps={{
                        style: { textAlign: 'center' }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            ))}
            {/* Discont Row */}
            <Grid container spacing={0} sx={{ marginTop: '10px' }}>
              {/* Fixed Column - Discount */}
              <Grid size={4}>
                <Box
                  sx={(theme) => ({
                    backgroundColor: (theme) => theme.palette.action.hover,
                    padding: 2,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`
                  })}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 40 }}>
                      {t('Discount')} {t(baseCurrency.label)}
                    </Typography>
                    {/* <Typography variant="body1" fontWeight="bold">
                      {calculations.usd}
                    </Typography> */}
                  </Stack>
                </Box>
              </Grid>
              <Grid size={4}>
                <Box sx={{ padding: 1 }}>
                  <CurrencyInputField
                    variant="outlined"
                    size="small"
                    // type="number"
                    value={hardDiscount}
                    onChange={(value) => setHardDiscount(value)}
                    placeholder={titles?.discountValue}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        textAlign: 'center'
                      }
                    }}
                    inputProps={{
                      style: { textAlign: 'center' }
                    }}
                  />
                </Box>
              </Grid>
              {/* Dynamic Columns - Discount */}
              <Grid size={4}>
                <Box sx={{ padding: 1 }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    disabled
                    value={((hardDiscount / +totalAmount) * 100).toFixed(2) + '%'}
                    // onChange={ }
                    placeholder={titles.discountPercentage}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        textAlign: 'center'
                      }
                    }}
                    inputProps={{
                      style: { textAlign: 'center' }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
            {/* ====================== Show the rest of the bill ======================*/}
            {Boolean(hardDiscount) && (
              <Grid container spacing={0} sx={{ marginTop: '10px' }}>
                <Grid size={4}>
                  <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 40 }}>
                    {titles.remainingForCustomer}{' '}
                    {priceToDecimalPrice(
                      (
                        roundToNearest(totalAmount, approximation) +
                        -hardDiscount -
                        amountReceived[baseCurrency.code]
                      ).toString()
                    )}
                  </Typography>
                </Grid>
              </Grid>
            )}
            {/* ====================== Show the the rest of the customer when open to complete customer order ======================*/}
            {isUpdateCustomerOrder && (
              <Grid container spacing={0} sx={{ marginTop: '10px' }}>
                <Grid size={4}>
                  <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 40 }}>
                    المبلغ المتبقي للعميل:{' '}
                    {priceToDecimalPrice(
                      (totalAmount - (customerOrderData?.totalPreviousPayment ?? 0)).toString()
                    )}{' '}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{
                flex: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                height: 48
              }}
            >
              {titles.back}
            </Button>

            {!isCustomerOrder && (
              <GenericButton
                title={
                  titles.confirmSaleWithDiscount +
                  ' ' +
                  priceToDecimalPrice(calculations[baseCurrency.code].toString()) +
                  ' ' +
                  t(baseCurrency.label)
                }
                loading={!Boolean(hardDiscount) && isSubmitting}
                onClick={() => handleConfirmSale(-calculations[baseCurrency.code])}
                // disabled={calculations[baseCurrency.code] <= 0}
                // disabled={isConfirmSaleDisabled}
                disabled={
                  hardDiscount > 0 ||
                  Object.values(amountReceived).reduce((sum, val) => sum + val, 0) === 0 ||
                  Boolean(isUpdateCustomerOrder)
                }
                sx={{
                  flex: 1,
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  height: 48,
                  borderRadius: '5px',
                  // height: 'auto',
                  '&:hover': {
                    backgroundColor: '#45a049'
                  }
                }}
              />
            )}
            <GenericButton
              title={titles.confirmSaleWithTransfer}
              // loading={(Boolean(hardDiscount) || isCustomerOrder) && (isCustomerOrder ? isAddingCustomerOrder || isUpdatingCustomerOrder : isAddingOrder)}
              loading={(Boolean(hardDiscount) || isCustomerOrder) && isSubmitting}
              onClick={() => handleConfirmSale(hardDiscount)}
              // disabled={calculations.syp !== 0 && calculations.usd !== 0}
              // disabled={isConfirmSaleDisabled}
              sx={{
                flex: 1,
                backgroundColor: '#4CAF50',
                color: 'white',
                textTransform: 'none',
                fontWeight: 'bold',
                height: 48,
                borderRadius: '5px',
                // height: 'auto',
                '&:hover': {
                  backgroundColor: '#45a049'
                }
              }}
            />
          </Stack>
          {/* <Typography variant="body2" color="warning.main" sx={{ mb: 0, fontSize: '0.9rem', mx: "auto", textAlign: 'center', paddingBottom: "10px", marginTop: "0px" }}>{t('سوف يتم خصم الرقم الباقي من الفاتورة')}</Typography> */}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default PricingAndCurrency
