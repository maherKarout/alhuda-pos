import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IpcChannels } from '../main/ipc-channels'
import { ProductType, PropsGetAll } from '../main/modules/products/product.service'
import { CreateLocalOrderInput } from '../main/modules/orders/dto/dto'

// Custom APIs for renderer (channel names from IpcChannels enum)
const api = {
  getAllProductsWithPagination: (propsGetAll: PropsGetAll) =>
    ipcRenderer.invoke(IpcChannels.GET_PRODUCTS_WITH_PAGINATION, propsGetAll),
  addProductsToDatabase: (products: ProductType[]) =>
    ipcRenderer.invoke(IpcChannels.ADD_PRODUCTS, products),
  getAllProductsForFirtsLaunchFromOnlineServer: (token: string) =>
    ipcRenderer.invoke(IpcChannels.GET_PRODUCTS_FOR_FIRST_LAUNCH_FROM_ONLINE_SERVER, token),
  checkServerOnline: () => ipcRenderer.invoke(IpcChannels.CHECK_SERVER_ONLINE),
  getProductsCounts: () => ipcRenderer.invoke(IpcChannels.GET_PRODUCTS_COUNTS),
  createLocalOrder: (order: CreateLocalOrderInput) =>
    ipcRenderer.invoke(IpcChannels.CREATE_LOCAL_ORDER, order),
  createLocalOrderTest: () => ipcRenderer.invoke(IpcChannels.CREATE_LOCAL_ORDER_TEST),
  getAllCustomersWithPagination: (params: {
    searchValue?: string
    limit?: number
    page?: number
    total?: boolean
  }) => ipcRenderer.invoke(IpcChannels.CUSTOMER_GET_ALL, params),
  getAllCustomersForFirstLaunchFromOnlineServer: (token: string) =>
    ipcRenderer.invoke(IpcChannels.CUSTOMER_GET_ALL_FOR_FIRST_LAUNCH_FROM_ONLINE_SERVER, token),
  getCusomersCounts: () => ipcRenderer.invoke(IpcChannels.CUSTOMER_COUNT),
  getCasherBox: () => ipcRenderer.invoke(IpcChannels.CASHER_BOX_GET_OR_CREATE),
  updateCasherBox: (amounts: { usd?: number; syp?: number }) =>
    ipcRenderer.invoke(IpcChannels.CASHER_BOX_UPDATE, amounts)
}

const localStorageAPI = {
  setItem: (key: string, value: string) =>
    ipcRenderer.invoke(IpcChannels.LOCAL_STORAGE_SET_ITEM, key, value),
  testInvokeToken: () => ipcRenderer.invoke(IpcChannels.TEST_INVOKE_TOKEN)
}

const autoUpdaterAPI = {
  checkForUpdates: () => ipcRenderer.send(IpcChannels.CHECK_FOR_UPDATES),
  downloadUpdate: () => ipcRenderer.send(IpcChannels.DOWNLOAD_UPDATE),
  quitAndInstall: () => ipcRenderer.send(IpcChannels.QUIT_AND_INSTALL),
  onUpdateStatus: (callback: (event: string, data: any) => void) => {
    const subscription = (
      _event: Electron.IpcRendererEvent,
      args: { event: string; data: any }
    ) => {
      callback(args.event, args.data)
    }
    ipcRenderer.on(IpcChannels.UPDATE_STATUS, subscription)
    return () => {
      ipcRenderer.removeListener(IpcChannels.UPDATE_STATUS, subscription)
    }
  }
}

const printPdfFileAPI = {
  printPdfFile: (pdfFileUrl: string) => ipcRenderer.invoke(IpcChannels.PRINT_PDF_FILE, pdfFileUrl)
}

console.log('🚀 ~ process.contextIsolated:', process.contextIsolated)
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronLocalStorage', localStorageAPI)
    contextBridge.exposeInMainWorld('autoUpdater', autoUpdaterAPI)
    contextBridge.exposeInMainWorld('printPdfFile', printPdfFileAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.electronLocalStorage = localStorageAPI
  // @ts-ignore (define in dts)
  window.autoUpdater = autoUpdaterAPI
  // @ts-ignore (define in dts)
  window.printPdfFile = printPdfFileAPI
}
