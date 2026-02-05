import { ipcMain } from 'electron'
import { IpcChannels } from '../../ipc-channels'
import { localStorageService } from './local-storage.service'

function toResult<T>(data: T) {
  return { success: true as const, data }
}

function toError(error: unknown) {
  return {
    success: false as const,
    error: error instanceof Error ? error.message : String(error)
  }
}

export function registerLocalStorageIpc(): void {
  ipcMain.handle(IpcChannels.LOCAL_STORAGE_SET_ITEM, async (_, key: string, value: string) => {
    try {
      const data = localStorageService.setItem(key, value)
      return toResult(data)
    } catch (error) {
      return toError(error)
    }
  })

  ipcMain.handle(IpcChannels.TEST_INVOKE_TOKEN, async () => {
    return localStorageService.getStore()
  })
}
