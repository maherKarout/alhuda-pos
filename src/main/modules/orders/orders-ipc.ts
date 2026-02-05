import { ipcMain } from 'electron'
import { IpcChannels } from '../../ipc-channels'
import { CreateLocalOrderInput } from './dto/dto'
import { OrderService } from './order.service'

const orderService = new OrderService()

export function registerOrdersIpc(): void {
  // ====================== Create local order ======================
  ipcMain.handle(IpcChannels.CREATE_LOCAL_ORDER, async (_, order: CreateLocalOrderInput) => {
    return await orderService.createLocalOrder(order)
  })
  // ====================== Create local order test ======================
  ipcMain.handle(IpcChannels.CREATE_LOCAL_ORDER_TEST, async () => {
    return await orderService.createLocalOrderTest()
  })
}
