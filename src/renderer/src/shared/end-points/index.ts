import RefundOrderPopup from '@renderer/app/casher-screen/components/refund/refund-orders-popup'
import { baseUrl } from 'src/env/base-url'

const getEndPoint = (endPoint: string) => () => {
  const url = new URL(endPoint, baseUrl)
  return url
}

export const endPoints = {
  loginEndPoint: getEndPoint('/admin/auth/login'),
  accountsEndPoint: getEndPoint('/admin/operator'),
  roleEndPoint: getEndPoint('/admin/role'),
  privilegesEndPoint: getEndPoint('/admin/privilege'),
  uploadFileEndPoint: getEndPoint('/localFile/uploadLocalFile'),
  updatePassword: getEndPoint('/admin/operator/updatePassword'),
  meEnPoint: getEndPoint('/admin/operator/getMe'),
  updateMe: getEndPoint('/admin/operator/updateMe'),
  warhorseEndPointEndpoint: getEndPoint('/warhorse'),
  teamEndpoint: getEndPoint('/admin/team'),
  posEndPoint: getEndPoint('/admin/pos'),
  posEndPointWithoutAuth: getEndPoint('/pos/all'),
  casherScreenEndPoint: getEndPoint('/casher-screen'),
  categoriesEndPoint: getEndPoint('/admin/category'),
  initialValuesType: getEndPoint('/pos/customer'),
  customerEndPoint: getEndPoint('/pos/customer'),
  customerPaymentsEndPoint: getEndPoint('/pos/payment/customer'),
  posUsersEndPoint: getEndPoint('/admin/operator/pos'),
  orderEndPoint: getEndPoint('/pos/order'),
  productsEndPoint: getEndPoint('/pos/products'),
  customerNotCompletedOrdersEndPoint: getEndPoint('/pos/order/customer/not-completed'),
  addCashInEndPoint: getEndPoint('/pos/payment/receipt'),
  addCashOutEndPoint: getEndPoint('/pos/payment/purchase'),
  getCasherBoxEndpoint: getEndPoint('/pos/casher-box'),
  getExchangeRatesEndPoint: getEndPoint('/pos/currency'),
  casherLoginEndPoint: getEndPoint('/pos/auth/login'),
  getCashersEndPoint: getEndPoint('/pos/cashers'),
  handOverEndPoint: getEndPoint('/pos/auth/shift-handover'),
  getHandOverDataEndPoint: getEndPoint('/pos/auth/shift-handover/data'),
  sendConfirmHandOverEndPoint: getEndPoint('/pos/auth/shift-handover/verify'),
  purchaseOrderEndPoint: getEndPoint('/pos/purchase'),
  adminPurchaseOrderEndPoint: getEndPoint('/admin/purchase'),
  superAdminPurchaseOrderEndpoint: getEndPoint('/admin/purchase-order'),
  superAdminPurchaseEndpoint: getEndPoint('/admin/purchase'),
  getProductBySerialNumberEndPoint: getEndPoint('/pos/products/bar-code'),
  getOrdersByCustomerIdEndPoint: getEndPoint('/pos/order/customer'),
  sendRefundOrderEndpoint: getEndPoint('/pos/order/refund'),
  inventoryEndPointEndpoint: getEndPoint('/pos/products/inventory'),
  configEndPointEndpoint: getEndPoint('/admin/config'),
  configEndPointForPos: getEndPoint('/pos/config'),
  customerOrderEndpoint: getEndPoint('/pos/order/customer '),
  allCustomersOrdersEndpoint: getEndPoint('/pos/order/customer/all'),
  orderCustomerInvoiceEndpoint: getEndPoint('/pos/order/customer/invoice')
} as const
