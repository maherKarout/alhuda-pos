import { ElectronAPI } from '@electron-toolkit/preload'
import { PropsGetAll } from '../main/modules/products/services'

type FetchResult<T> = { success: true; data: T } | { success: false; error: string }

export interface Product {
  id: string
  name: string
  code: string
  individualPrice: number
  wholesalePrice: number
  category: string
}

interface Customer {
  id: string
  customerId: string
  name: string
  phone: string
}

interface RendererApi {
  getAllProductsWithPagination: (propsGetAll: PropsGetAll) => Promise<FetchResult<Product[]>>
  getProductById: (id: string) => Promise<FetchResult<Product>>
  addProductsToDatabase: (products: unknown) => Promise<FetchResult<Product[]>>
  getAllProductsForFirtsLaunchFromOnlineServer: (token: string) => Promise<FetchResult<Product[]>>
  checkServerOnline: () => Promise<FetchResult<boolean>>
  getProductsCounts: () => Promise<FetchResult<number>>
  createLocalOrder: (order: BodyLocalOrder) => Promise<FetchResult<LocalOrder>>
  createLocalOrderTest: () => Promise<FetchResult<LocalOrder>>
  getAllCustomersWithPagination: (params: {
    searchValue?: string
    limit?: number
    page?: number
    total?: boolean
  }) => Promise<FetchResult<{ data: Customer[]; totalRecords: number }>>
  getAllCustomersForFirstLaunchFromOnlineServer: (token: string) => Promise<FetchResult<Customer[]>>
  getCusomersCounts: () => Promise<FetchResult<number>>
  getCasherBox: () => Promise<FetchResult<CasherBox>>
  updateCasherBox: (amounts: { usd?: number; syp?: number }) => Promise<FetchResult<CasherBox>>
}

interface AutoUpdaterAPI {
  checkForUpdates: () => void
  downloadUpdate: () => void
  quitAndInstall: () => void
  onUpdateStatus: (callback: (event: string, data: any) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: RendererApi
    electronLocalStorage: LocalStorage
    autoUpdater: AutoUpdaterAPI
    printPdfFile: {
      printPdfFile: (pdfFileUrl: string) => Promise<void>
    }
  }
}
