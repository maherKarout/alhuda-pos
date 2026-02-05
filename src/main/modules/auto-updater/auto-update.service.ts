import { autoUpdater } from 'electron-updater'
import { BrowserWindow } from 'electron'
import { IpcChannels } from '../../ipc-channels'
import axios from 'axios'
import { baseUrlElectron, endPoints } from '../../../shared/endpoints'

const log = {
  info: (...args: unknown[]) => console.log('[UpdateService]', ...args),
  error: (...args: unknown[]) => console.error('[UpdateService]', ...args)
}

/** Service that wraps electron-updater and notifies the renderer via IPC. */
export class UpdateService {
  private mainWindow: BrowserWindow | null = null

  constructor() {
    autoUpdater.autoDownload = false
    autoUpdater.autoInstallOnAppQuit = true
    this.setupEventHandlers()
  }

  setMainWindow(window: BrowserWindow | null): void {
    this.mainWindow = window
  }

  private setupEventHandlers(): void {
    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for update...')
      this.sendStatusToWindow('checking-for-update')
    })

    autoUpdater.on('update-available', (info) => {
      log.info('Update available:', info)
      this.sendStatusToWindow('update-available', info)
    })

    autoUpdater.on('update-not-available', (info) => {
      log.info('Update not available:', info)
      this.sendStatusToWindow('update-not-available', info)
    })

    autoUpdater.on('download-progress', (progressObj) => {
      log.info(
        `Download: ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`
      )
      this.sendStatusToWindow('download-progress', progressObj)
    })

    autoUpdater.on('update-downloaded', (info) => {
      log.info('Update downloaded:', info)
      this.sendStatusToWindow('update-downloaded', info)
    })

    autoUpdater.on('error', (error: Error) => {
      log.error('Error:', error)
      this.sendStatusToWindow('update-error', { message: error.message })
    })
  }

  private sendStatusToWindow(event: string, data?: unknown): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(IpcChannels.UPDATE_STATUS, { event, data })
    }
  }

  checkForUpdates(): void {
    if (process.env.NODE_ENV === 'development') {
      log.info('Skipping update check in development')
      return
    }
    autoUpdater.checkForUpdates()
  }

  downloadUpdate(): void {
    autoUpdater.downloadUpdate()
  }

  quitAndInstall(): void {
    autoUpdater.quitAndInstall()
  }

  isConnectionError(error: unknown): boolean {
    if (!axios.isAxiosError(error)) return false

    // No response means no internet or server unreachable
    return !error.response
  }
  // ====================== Check Server Online ======================
  async checkServerIsOnline(): Promise<boolean> {
    try {
      // Try your main products endpoint (or any existing endpoint)
      const response = await axios.get(
        `${baseUrlElectron}${endPoints.productsEndPoint().pathname}`,
        {
          params: { page: 1, limit: 1 }, // Minimal data
          timeout: 5000,
          headers: {
            'Cache-Control': 'no-cache'
          },
          // Accept ANY response status (2xx, 3xx, 4xx, 5xx)
          validateStatus: () => true
        }
      )

      // ✅ If we get ANY response (even 401, 404, 500), server IS online!
      return true
      console.log(`✅ Server responded with status: ${response.status}`)
    } catch (error) {
      // ❌ If axios throws an error with NO response, server is offline
      if (axios.isAxiosError(error) && !error.response) {
        return false
        console.log('❌ Server is offline (no response)')
      } else {
        // Got a response with error status = server is online!
        return true
        console.log(`⚠️ Server online but returned error: ${error}`)
      }
    }

    return false
  }
}

export const updateService = new UpdateService()
