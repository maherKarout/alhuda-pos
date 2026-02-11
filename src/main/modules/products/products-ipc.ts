import axios from 'axios'
import { baseUrlElectron } from '../../../shared/endpoints'
import { ipcMain } from 'electron'
import { IpcChannels } from '../../ipc-channels'
import { PropsGetAll, ProductService, type ProductType } from './product.service'

const productService = new ProductService()

export function registerProductsIpc(): void {
  ipcMain.handle(IpcChannels.ADD_PRODUCTS, async (_, products: unknown) => {
    return await productService.addProducts((products ?? []) as ProductType[])
  })

  ipcMain.handle(IpcChannels.GET_PRODUCTS_WITH_PAGINATION, async (_, params: PropsGetAll) => {
    return await productService.getAllProductsWithPagination(params)
  })
  ipcMain.handle(
    IpcChannels.GET_PRODUCTS_FOR_FIRST_LAUNCH_FROM_ONLINE_SERVER,
    async (_, token: string) => {
      try {
        return await productService.getAllProductsForFirtsLaunchFromOnlineServer(token)
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) }
      }
    }
  )
  // ====================== Get products count ======================
  ipcMain.handle(IpcChannels.GET_PRODUCTS_COUNTS, async () => {
    return await productService.getProductsCount()
  })
}
