import { ipcMain } from 'electron'
import { printPdfFile } from './print-pdf.service'
import { IpcChannels } from '../../ipc-channels'

/**
 * Registers IPC handler for printing PDF from a file URL.
 */
export function registerPrintPdfIpc(): void {
  ipcMain.handle(IpcChannels.PRINT_PDF_FILE, async (_event, pdfFileUrl: string) => {
    return printPdfFile(pdfFileUrl)
  })
}
