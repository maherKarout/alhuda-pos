export enum privilegeKeys {
  //all
  all = 'all',
  //role management
  createRole = 'createRole',
  viewRole = 'viewRole',
  updateRole = 'updateRole',
  deleteRole = 'deleteRole',
  //operator management
  createOperator = 'createOperator',
  viewOperator = 'viewOperator',
  updateOperator = 'updateOperator',
  deleteOperator = 'deleteOperator',

  //order management
  createOrder = 'createOrder',
  viewOrder = 'viewOrder',
  updateOrder = 'updateOrder',

  //POS management
  createPOS = 'createPOS',
  viewPOS = 'viewPOS',
  updatePOS = 'updatePOS',
  deletePOS = 'deletePOS',

  //warehouse management
  createWearhouse = 'createWearhouse',
  viewWearhouse = 'viewWearhouse',
  updateWearhouse = 'updateWearhouse',
  deleteWearhouse = 'deleteWearhouse',

  //statistics
  viewStatistics = 'viewStatistics',

  //products management
  createProducts = 'createProducts',
  viewProducts = 'viewProducts',
  updateProducts = 'updateProducts',
  deleteProducts = 'deleteProducts',

  //POS product management
  createPOSProduct = 'createPOSProduct',
  viewPOSProduct = 'viewPOSProduct',
  updatePOSProduct = 'updatePOSProduct',

  //payment management
  createPayment = 'createPayment',
  viewPayment = 'viewPayment',
  updatePayment = 'updatePayment',
  deletePayment = 'deletePayment',

  //category management
  createCategory = 'createCategory',
  viewCategory = 'viewCategory',
  updateCategory = 'updateCategory',
  deleteCategory = 'deleteCategory',

  //customer management
  createCustomer = 'createCustomer',
  viewCustomer = 'viewCustomer',
  updateCustomer = 'updateCustomer',
  deleteCustomer = 'deleteCustomer',

  //Purchase
  createPurchase = 'createPurchase',
  viewPurchase = 'viewPurchase',
  updatePurchase = 'updatePurchase',
  deletePurchase = 'deletePurchase',

  //Pos Purchase
  createPOSPurchase = 'createPOSPurchase',
  viewPOSPurchase = 'viewPOSPurchase',
  updatePOSPurchase = 'updatePOSPurchase',
  deletePOSPurchase = 'deletePOSPurchase',

  //Config management
  viewConfig = 'viewConfig',
  updateConfig = 'updateConfig'
}

export const privilegesArray = [
  //role management
  'createRole',
  'viewRole',
  'updateRole',
  'deleteRole',
  //operator management
  'createOperator',
  'viewOperator',
  'updateOperator',
  'deleteOperator',

  //order management
  'createOrder',
  'viewOrder',
  'updateOrder',

  //POS management
  'createPOS',
  'viewPOS',
  'updatePOS',
  'deletePOS',

  //warehouse management
  'createWearhouse',
  'viewWearhouse',
  'updateWearhouse',
  'deleteWearhouse',

  //statistics
  'viewStatistics',

  //products management
  'createProducts',
  'viewProducts',
  'updateProducts',
  'deleteProducts',

  //POS product management
  'createPOSProduct',
  'viewPOSProduct',
  'updatePOSProduct',

  //payment management
  'createPayment',
  'viewPayment',
  'updatePayment',
  'deletePayment',

  //category management
  'createCategory',
  'viewCategory',
  'updateCategory',
  'deleteCategory',

  //customer management
  'createCustomer',
  'viewCustomer',
  'updateCustomer',
  'deleteCustomer',

  //Purchase
  'createPurchase',
  'viewPurchase',
  'updatePurchase',
  'deletePurchase',

  //Pos Purchase
  'createPOSPurchase',
  'viewPOSPurchase',
  'updatePOSPurchase',
  'deletePOSPurchase',

  //Config management
  'viewConfig',
  'updateConfig'
] as const

export enum privilegeFeature {
  role = 'Role',
  operator = 'Operator',
  order = 'Order',
  pos = 'POS',
  Statistics = 'Statistics',
  products = 'Products',
  posProduct = 'POSProduct',
  payment = 'Payment',
  category = 'Category',
  customer = 'Customer',
  purchase = 'Purchase',
  posPurchase = 'POSPurchase',
  config = 'Config'
}
const privilegeFeatures = [
  'Role',
  'Operator',
  'Order',
  'POS',
  'Products',
  'POSProduct',
  'Payment',
  'Category',
  'Customer',
  'Purchase',
  'POSPurchase',
  'Config'
] as const

const createPrivilegeFeatures = [...privilegeFeatures] as const

const updatePrivilegeFeatures = [...privilegeFeatures] as const

const deletePrivilegeFeatures = [...privilegeFeatures] as const

const viewPrivilegeFeatures = [...privilegeFeatures, 'Statistics'] as const

export type privilegesType = (typeof privilegesArray)[number]

export type CreatePrivilegeFeatureType = (typeof createPrivilegeFeatures)[number]

export type UpdatePrivilegeFeatureType = (typeof updatePrivilegeFeatures)[number]

export type DeletePrivilegeFeatureType = (typeof deletePrivilegeFeatures)[number]

export type ViewPrivilegeFeatureType = (typeof viewPrivilegeFeatures)[number]
