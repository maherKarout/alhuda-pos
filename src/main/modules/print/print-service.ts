import { BrowserWindow } from 'electron'

export type PrintResult = { success: true } | { success: false; error: string }

/**
 * Opens a hidden window, loads the PDF URL, and triggers print dialog.
 */
export async function printPdfFromUrl(pdfFileUrl: string): Promise<PrintResult> {
  let printWindow: BrowserWindow | null = null

  try {
    printWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        plugins: true
      }
    })

    await printWindow.loadURL(pdfFileUrl)

    await new Promise<void>((resolve, reject) => {
      if (!printWindow) {
        resolve()
        return
      }

      const doPrint = () => {
        if (!printWindow) {
          resolve()
          return
        }
        printWindow.webContents.print(
          {
            silent: false,
            printBackground: false,
            margins: { marginType: 'none' },
            scaleFactor: 100
          },
          (success, failureReason) => {
            if (!success) {
              reject(new Error(failureReason))
            } else {
              resolve()
            }
            if (printWindow) {
              printWindow.close()
              printWindow = null
            }
          }
        )
      }

      printWindow.webContents.once('did-finish-load', () => {
        setTimeout(doPrint, 1000)
      })
    })

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  } finally {
    if (printWindow && !printWindow.isDestroyed()) {
      printWindow.close()
      printWindow = null
    }
  }
}
