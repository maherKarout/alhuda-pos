import { ipcMain } from 'electron'
import { IpcChannels } from '../../ipc-channels'
import { CasherBoxService } from './casher-box.service'

const casherBoxService = new CasherBoxService()

export function registerCasherBoxIpc(): void {
  ipcMain.handle(IpcChannels.CASHER_BOX_GET_OR_CREATE, async () => {
    return await casherBoxService.get()
  })

  ipcMain.handle(
    IpcChannels.CASHER_BOX_UPDATE,
    async (_, amounts: { usd?: number; syp?: number; exchangeRate?: number }) => {
      return await casherBoxService.update(amounts ?? {})
    }
  )

  ipcMain.handle(IpcChannels.CASHER_BOX_GET_RATE, async () => {
    return await casherBoxService.getRate()
  })

  ipcMain.handle(IpcChannels.CASHER_BOX_UPDATE_RATE, async (_, rate: number) => {
    return await casherBoxService.updateRate(rate)
  })
}
