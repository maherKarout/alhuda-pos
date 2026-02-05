import { ipcMain } from 'electron'
import { IpcChannels } from '../../ipc-channels'
import {
  CreateCustomerInput,
  CustomersService,
  PropsGetAllCustomers,
  UpdateCustomerInput
} from './customers.service'

const customersService = new CustomersService()

export function registerCustomersIpc(): void {
  // ====================== Create ======================
  ipcMain.handle(IpcChannels.CUSTOMER_CREATE, async (_, input: CreateCustomerInput) => {
    return await customersService.create(input)
  })

  // ====================== Get by id ======================
  ipcMain.handle(IpcChannels.CUSTOMER_GET_BY_ID, async (_, id: string) => {
    return await customersService.getById(id)
  })

  // ====================== Get all (with pagination) ======================
  ipcMain.handle(IpcChannels.CUSTOMER_GET_ALL, async (_, params: PropsGetAllCustomers) => {
    return await customersService.getAll(params ?? {})
  })

  // ====================== Update ======================
  ipcMain.handle(
    IpcChannels.CUSTOMER_UPDATE,
    async (_, id: string, input: UpdateCustomerInput) => {
      return await customersService.update(id, input)
    }
  )

  // ====================== Delete ======================
  ipcMain.handle(IpcChannels.CUSTOMER_DELETE, async (_, id: string) => {
    return await customersService.delete(id)
  })

  // ====================== Count ======================
  ipcMain.handle(IpcChannels.CUSTOMER_COUNT, async () => {
    return await customersService.count()
  })

  // ====================== Get all customers for first launch app ======================
  ipcMain.handle(IpcChannels.CUSTOMER_GET_ALL_FOR_FIRST_LAUNCH_FROM_ONLINE_SERVER, async (_, token: string) => {
    return await customersService.getAllCustomersForFirstLaunchFromOnlineServer(token)
  })
}
