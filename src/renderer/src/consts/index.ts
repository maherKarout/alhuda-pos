enum PaidStatus {
  paid = 'paid',
  notPaid = 'not-paid'
}
export { PaidStatus }

export enum AccountRole {
  USER = 'user',
  ADMIN = 'admin',
  OPERATOR = 'operator',
  SUPER_ADMIN = 'super_admin',
  POS_SUPERVISOR = 'pos_supervisor',
  POS_ADMIN = 'pos_admin',
  ACCOUNTANT = 'accountant',
  CASHIER = 'cashier'
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  AMOUNT = 'amount'
}

// CurrencyGuid enum kept for backward compatibility
// Note: For new currencies, use getCurrencyGuid() from @renderer/config/currencies
export enum CurrencyGuid {
  USD = 'FD5D0B28-2F9D-4C0F-AE0B-E31E36CF2E14',
  SYP = '936ECC1A-68A3-412A-843A-2AEF07D52B02'
}
export enum PurchaseStatus {
  UNDER_PROCESS = 'under_process',
  IN_PROGRESS = 'in_progress',
  SENT = 'sent',
  DELIVERED = 'delivered',
  REFUNDED = 'refunded',
  REFUND_DONE = 'refund_done'
}

export enum TypePayment {
  PAYMENT = 'payment',
  RECEIPT = 'receipt'
}

export enum TypeOrder {
  RESERVATION = 'RESERVATION',
  NORMAL = 'NORMAL'
}

export enum OrderType {
  RETURN = 'return',
  SALE = 'sale',
  CUSTOMER = 'customer',
  REFUND_PURCHASE = 'refund_purchase'
}

// ====================== cash in out ======================
export enum PurchaseReasonType {
  SUPPLIER = 'supplier',
  EXPENSES = 'expenses',
  CUSTOMER = 'customer'
}
