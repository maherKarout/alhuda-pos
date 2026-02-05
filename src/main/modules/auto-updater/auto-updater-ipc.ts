import { ipcMain } from 'electron'
import { IpcChannels } from '../../ipc-channels'
import axios from 'axios'
import { baseUrlElectron } from '../../../shared/endpoints'
import { updateService } from './auto-update.service'

/**
 * Registers IPC listeners for auto-updater and dev ping.
 */
export function registerAutoUpdaterIpc(): void {
  ipcMain.on(IpcChannels.PING, () => {
    // Dev: pong
  })

  ipcMain.on(IpcChannels.CHECK_FOR_UPDATES, () => {
    updateService.checkForUpdates()
  })

  ipcMain.on(IpcChannels.DOWNLOAD_UPDATE, () => {
    updateService.downloadUpdate()
  })

  ipcMain.on(IpcChannels.QUIT_AND_INSTALL, () => {
    updateService.quitAndInstall()
  })
  ipcMain.handle(IpcChannels.CHECK_SERVER_ONLINE, async () => {
    return await updateService.checkServerIsOnline()
  })
}
