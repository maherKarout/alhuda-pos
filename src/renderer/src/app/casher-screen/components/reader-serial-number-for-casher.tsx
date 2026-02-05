import React from 'react'
import ScannerSafeForm from '../../../components/reader-serial-number/reader-serial-number'
import useCasherScreen from '../hooks/use-casher-screen'
import { showStringErrorToasts } from '@renderer/components/toasts'
import { useTranslation } from 'react-i18next'
import { useGetProductBySerialNumberMutation } from '../services/api'

function ReaderSerialNumberForCasher() {
  const { t } = useTranslation()
  const { setOrders, currentOrder } = useCasherScreen()
  const [getProductById, { isLoading, isError, error, isSuccess }] =
    useGetProductBySerialNumberMutation()

  const handleScannerChange = async (scannedValue: string) => {
    try {
      const data = await getProductById(scannedValue)
      const product = data.data?.data

      if (product) {
        // Check if the product already exists in the items array
        if (setOrders) {
          setOrders((prevState) => {
            const currentOrderData = prevState?.[currentOrder]
            const items = currentOrderData?.items || []
            const existingIndex = items.findIndex((item) => item.id === product.id)

            // Define a DTO for the item that matches ItemType structure
            const productDTO = {
              id: product.id,
              name: product.name,
              code: product.code,
              price: product.individualPrice, // Map individualPrice to price
              individualPrice: product.individualPrice,
              quantity: 1,
              discountPercentage: 0,
              discountValue: 0
            }

            let newItems
            if (existingIndex !== -1) {
              // Product already exists, increment quantity
              newItems = items.map((item, idx) =>
                idx === existingIndex ? { ...item, quantity: (item.quantity || 1) + 1 } : item
              )
            } else {
              // Product does not exist, add as new item
              newItems = [...items, productDTO]
            }

            // Update the specific order in the orders array
            const updatedOrders = [...prevState]
            updatedOrders[currentOrder] = {
              ...currentOrderData,
              items: newItems
            }

            return updatedOrders
          })
        }
      }
    } catch (error) {
      showStringErrorToasts(t('Product not found'))
    }
  }

  return (
    <div>
      <ScannerSafeForm onChange={handleScannerChange} />
    </div>
  )
}

export default ReaderSerialNumberForCasher
