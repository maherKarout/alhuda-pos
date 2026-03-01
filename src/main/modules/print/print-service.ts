import { BrowserWindow } from 'electron'

export type PrintPdfResult = { success: true } | { success: false; error: string }

/**
 * Prints a PDF from a file URL by opening a temporary BrowserWindow,
 * loading the PDF, and triggering the print dialog.
 */
export async function printPdfFile(pdfFileUrl: string): Promise<PrintPdfResult> {
  let printWindow: BrowserWindow | null = null

  try {
    printWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        plugins: true
      }
    })

    await printWindow.loadURL(pdfFileUrl)

    printWindow.show()
    printWindow.focus()

    // Wait for content to load before printing
    await new Promise((resolve) => setTimeout(resolve, 7000))

    await printWindow.webContents.print({
      silent: true,
      printBackground: true
    })

    return { success: true }
  } catch (error) {
    console.error('PDF printing failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  } finally {
    if (printWindow) {
      printWindow.close()
    }
  }
}
