import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { registerAllIpc } from './ipc'
import { createMainWindow, getMainWindow } from './window/main-window'
import { APP_CONFIG } from './config/app-config'

/**
 * Initialize single instance lock and app lifecycle events
 */
export function initializeApp(): void {
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    // If the app is NOT the primary instance, quit immediately.
    app.quit()
    return
  }

  // The app IS the primary instance.
  // Set up a listener for when a second attempt is made.
  app.on('second-instance', () => {
    const mainWindow = getMainWindow()
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  // This method will be called when Electron has finished initialization.
  app.whenReady().then(() => {
    // Set up Electron utilities
    electronApp.setAppUserModelId(APP_CONFIG.appUserModelId)

    // Watch window shortcuts (F12 for DevTools, etc.)
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    // Register all IPC handlers (products, local-storage, print, auto-updater)
    registerAllIpc()

    // Create the main window
    createMainWindow()

    // macOS: Recreate window when dock icon is clicked
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
      }
    })
  })

  // Quit when all windows are closed (except on macOS)
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
