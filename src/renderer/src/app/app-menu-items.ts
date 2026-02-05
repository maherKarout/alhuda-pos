import { menuItemType } from 'src/types'
import { accountsMenuItem } from './accounts'
import { rolesMenuItem } from './role'
import { homeMenuItems } from './home'
import { TeamsMenuItem } from './teams'
import { CasherScreenMenuItem } from './casher-screen'
import { CustomersMenuItem } from './customers'
import { CashInOutMenuItem } from './cash-in-out'
import { InvoicesMenuItem } from './invoices'
import { BranchesMenuItem } from './branches'
import { PosUsersMenuItem } from './pos-users'
import { PurchaseOrderMenuItem } from './purchase-order'
import { AdminPurchaseOrderMenuItem } from './admin-purchase-order'
import { InventoryMenuItem } from './inventory'
import { ConfigMenuItem } from './config'
import { CustomerOrdersMenuItem } from './customer-orders'

const appMenuItem: menuItemType[] = [
  // homeMenuItems,
  CasherScreenMenuItem,
  CustomersMenuItem,
  CustomerOrdersMenuItem  ,
  // TeamsMenuItem,
  CashInOutMenuItem,
  InvoicesMenuItem,
  BranchesMenuItem,
  // PosUsersMenuItem,
  PurchaseOrderMenuItem,
  AdminPurchaseOrderMenuItem,
  accountsMenuItem,
  rolesMenuItem,
  InventoryMenuItem,
  ConfigMenuItem,
].flat()
export default appMenuItem
