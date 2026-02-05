import { autoUpdater } from 'electron-updater'
import { BrowserWindow, dialog } from 'electron'

// Simple logger
const log = {
  info: (...args: any[]) => console.log('[AutoUpdater]', ...args),
  error: (...args: any[]) => console.error('[AutoUpdater]', ...args)
}

// Configure auto-updater
autoUpdater.autoDownload = false // Don't download automatically
autoUpdater.autoInstallOnAppQuit = true // Install update when app quits

class AutoUpdaterManager {
  private mainWindow: BrowserWindow | null = null

  constructor() {
    this.setupEventHandlers()
  }

  setMainWindow(window: BrowserWindow) {
    this.mainWindow = window
  }

  private setupEventHandlers() {
    // Checking for updates
    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for update...')
      this.sendStatusToWindow('checking-for-update')
    })

    // Update available
    autoUpdater.on('update-available', (info) => {
      log.info('Update available:', info)
      this.sendStatusToWindow('update-available', info)

      // Show dialog to user
      // if (this.mainWindow) {
      //   dialog
      //     .showMessageBox(this.mainWindow, {
      //       type: 'info',
      //       title: 'Update Available',
      //       message: `A new version (${info.version}) is available. Would you like to download it now?`,
      //       buttons: ['Download', 'Later'],
      //       defaultId: 0,
      //       cancelId: 1
      //     })
      //     .then((result) => {
      //       if (result.response === 0) {
      //         autoUpdater.downloadUpdate()
      //       }
      //     })
      // }
    })

    // No update available
    autoUpdater.on('update-not-available', (info) => {
      log.info('Update not available:', info)
      this.sendStatusToWindow('update-not-available', info)
    })

    // Download progress
    autoUpdater.on('download-progress', (progressObj) => {
      let logMessage = `Download speed: ${progressObj.bytesPerSecond}`
      logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`
      logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`
      log.info(logMessage)
      this.sendStatusToWindow('download-progress', progressObj)
    })

    // Update downloaded
    autoUpdater.on('update-downloaded', (info) => {
      log.info('Update downloaded:', info)
      this.sendStatusToWindow('update-downloaded', info)

      // Show dialog to user
      if (this.mainWindow) {
        dialog
          .showMessageBox(this.mainWindow, {
            type: 'info',
            title: 'Update Ready',
            message: 'Update downloaded. The application will restart to install the update.',
            buttons: ['Restart Now', 'Later'],
            defaultId: 0,
            cancelId: 1
          })
          .then((result) => {
            if (result.response === 0) {
              // Quit and install
              setImmediate(() => autoUpdater.quitAndInstall())
            }
          })
      }
    })

    // Error occurred
    autoUpdater.on('error', (error) => {
      log.error('Error in auto-updater:', error)
      this.sendStatusToWindow('update-error', { message: error.message })

      // if (this.mainWindow) {
      //   dialog.showMessageBox(this.mainWindow, {
      //     type: 'error',
      //     title: 'Update Error',
      //     message: 'An error occurred while checking for updates.',
      //     detail: error.message
      //   })
      // }
    })
  }

  private sendStatusToWindow(event: string, data?: any) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('update-status', { event, data })
    }
  }

  // Check for updates
  checkForUpdates() {
    console.log(
      '🚀 ~ AutoUpdaterManager ~ checkForUpdates ~ process.env.NODE_ENV:',
      process.env.NODE_ENV
    )
    if (process.env.NODE_ENV === 'development') {
      log.info('Skipping update check in development mode')
      return
    }
    autoUpdater.checkForUpdates()
  }

  // Download update
  downloadUpdate() {
    autoUpdater.downloadUpdate()
  }

  // Quit and install
  quitAndInstall() {
    autoUpdater.quitAndInstall()
  }
}

export const autoUpdaterManager = new AutoUpdaterManager()
