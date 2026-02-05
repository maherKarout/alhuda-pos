// import { getProductDataApi } from '../db/route/get-product-api'

// Sync interval in milliseconds (1 second = 1000ms)
const SYNC_INTERVAL = 11000

// Track if sync is already running to prevent overlapping calls
let isSyncing = false
let syncInterval: NodeJS.Timeout | null = null

// Start the data synchronization
export function startDataSync(): void {
  if (syncInterval) {
    console.log('📊 Data sync is already running')
    return
  }

  console.log('🚀 Starting data synchronization every 1 second...')

  syncInterval = setInterval(() => {
    syncData()
  }, SYNC_INTERVAL)

  // Call immediately on start
  syncData()
}

// Stop the data synchronization
export function stopDataSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval)
    syncInterval = null
    console.log('⏹️ Data synchronization stopped')
  }
}

// Main sync function
async function syncData(): Promise<void> {
  // Prevent overlapping sync calls
  if (isSyncing) {
    console.log('⏳ Sync already in progress, skipping...')
    return
  }

  isSyncing = true

  try {
    console.log('🔄 Syncing data at:', new Date().toISOString())
    // Call the product API
    // getProductDataApi((data) => {
    //   console.log('✅ Sync successful:', data)
    // })
  } catch (error) {
    console.error('❌ Sync error:', error)
  } finally {
    isSyncing = false
  }
}

// Auto-start sync when module is imported
// startDataSync() //todo disable sync for now

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📶 SIGTERM received, stopping data sync...')
  stopDataSync()
})

process.on('SIGINT', () => {
  console.log('📶 SIGINT received, stopping data sync...')
  stopDataSync()
})

// Export functions for manual control
export { syncData }
