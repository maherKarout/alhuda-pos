import { useGetAllProductsQuery } from '@renderer/app/casher-screen'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { setLastSyncedDate } from '@renderer/redux-config/global-config-slice'

function useSynData() {
  const { token } = useSelector((state: any) => state.auth)
  const [loading, setLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const dispatch = useDispatch()

  // ====================== Sync functions (add more here as needed) ======================

  async function syncProducts() {
    try {
      const productsCounts = await window.api.getProductsCounts()
      if (productsCounts?.success && productsCounts.data !== 0) {
        console.log('Products already synced')
        return
      }
      const result = await window.api.getAllProductsForFirtsLaunchFromOnlineServer(token)
      if (result?.success && result.data) {
        window.api.addProductsToDatabase(result.data)
        dispatch(setLastSyncedDate(new Date()))
      }
    } catch (error) {
      console.log('syncProducts error:', error)
      alert('error in sync data')
    }
  }

  async function syncCustomers() {
    try {
      const customersCounts = await window.api.getAllCustomersForFirstLaunchFromOnlineServer(token)
      if (customersCounts?.success && customersCounts.data.length !== 0) {
        console.log('Customers already synced')
        return
      }
    } catch (error) {
      console.log('syncCustomers error:', error)
    }
  }
  // Add more sync functions here, e.g.:
  // async function syncCustomers() { ... }
  // async function syncOrders() { ... }

  async function syncData() {
    setIsSyncing(true)
    try {
      alert('syncing data...')
      await syncProducts()
      await syncCustomers()
      // await syncOrders()
      alert('data synced successfully!')
    } finally {
      setIsSyncing(false)
    }
  }

  // ====================== Run sync when ready ======================

  useEffect(() => {
    syncData()
  }, [loading, token])
}

export default useSynData
