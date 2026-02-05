import { RouteObject } from 'react-router-dom'
import { accountsRoutes } from './accounts'
import { rolesRoutes } from './role'
import { homeRoutes } from './home'
import { profileRoutes } from './update-me'
import { TeamsRoutes } from './teams'
import { CasherScreenRoutes } from './casher-screen'
import { CustomersRoutes } from './customers'
import { CashInOutRoutes } from './cash-in-out'
import { InvoicesRoutes } from './invoices'
import { BranchesRoutes } from './branches'
import { PosUsersRoutes } from './pos-users'
import { PurchaseOrderRoutes } from './purchase-order'
import { AdminPurchaseOrderRoutes } from './admin-purchase-order'
import { InventoryRoutes } from './inventory'
import { ConfigRoutes } from './config'
import { CustomerOrdersRoutes } from './customer-orders'
const appRoutes: RouteObject[] = [
  accountsRoutes,
  rolesRoutes,
  homeRoutes,
  profileRoutes,
  TeamsRoutes,
  CasherScreenRoutes,
  CustomersRoutes,
  CashInOutRoutes,
  InvoicesRoutes,
  BranchesRoutes,
  PosUsersRoutes,
  PurchaseOrderRoutes,
  AdminPurchaseOrderRoutes,
  InventoryRoutes,
  ConfigRoutes,
  CustomerOrdersRoutes
].flat()

export default appRoutes
