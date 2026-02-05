import { ipcMain } from 'electron'
import { IpcChannels } from '../../ipc-channels'
import { printPdfFromUrl } from './print-service'

function toIpcResult(result: { success: true } | { success: false; error: string }) {
  return result.success
    ? { success: true, data: undefined }
    : { success: false, error: result.error }
}

export function registerPrintIpc(): void {
  ipcMain.handle(IpcChannels.PRINT_PDF_FILE, async (_, pdfFileUrl: string) => {
    const result = await printPdfFromUrl(pdfFileUrl)
    return toIpcResult(result)
  })
}
