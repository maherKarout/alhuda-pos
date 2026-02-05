import { BrowserWindow, globalShortcut, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.ico?asset'
import { APP_CONFIG } from '../config/app-config'

let mainWindow: BrowserWindow | null = null

export function createMainWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: APP_CONFIG.window.width,
    height: APP_CONFIG.window.height,
    minWidth: APP_CONFIG.window.minWidth,
    minHeight: APP_CONFIG.window.minHeight,
    show: false,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      // In build, preload is emitted as ESM: out/preload/index.mjs
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) return

    mainWindow.show()

    // Register global shortcut for devtools
    globalShortcut.register('CommandOrControl+Shift+I', () => {
      mainWindow?.webContents.toggleDevTools()
    })

    // Open DevTools automatically in development
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools()
    }

    // Set main window for auto-updater and check for updates
    // autoUpdaterManager.setMainWindow(mainWindow)
    // setTimeout(() => {
    //   autoUpdaterManager.checkForUpdates()
    // }, 3000)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}
