/**
 * Central IPC registration. Import this once in main index to register all module IPC handlers.
 * Channel names are defined in ipc-channels.ts (enum).
 */
import { registerProductsIpc } from '../modules/products/products-ipc'
import { registerLocalStorageIpc } from '../modules/local-storage/local-storage-ipc'
import { registerAutoUpdaterIpc } from '../modules/auto-updater/auto-updater-ipc'
import { registerCustomersIpc } from '../modules/customers/customers-ipc'
import { registerOrdersIpc } from '../modules/orders/orders-ipc'
import { registerCasherBoxIpc } from '../modules/casher-box/casher-box-ipc'
import { registerPrintPdfIpc } from '../modules/print-pdf/print-pdf-ipc'

export function registerAllIpc(): void {
  registerProductsIpc()
  registerLocalStorageIpc()
  registerPrintPdfIpc()
  registerAutoUpdaterIpc()
  registerOrdersIpc()
  registerCustomersIpc()
  registerCasherBoxIpc()
}
