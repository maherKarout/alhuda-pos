/**
 * Central enum for all IPC channel names.
 * Use these constants instead of string literals in main process and preload.
 */
export enum IpcChannels {
  // Products
  ADD_PRODUCTS = 'add-products',
  GET_PRODUCTS = 'get-products',
  GET_PRODUCTS_WITH_PAGINATION = 'get-products-with-pagination',
  GET_PRODUCTS_FOR_FIRST_LAUNCH_FROM_ONLINE_SERVER = 'get-products-for-first-launch-from-online-server',
  GET_PRODUCTS_COUNTS = 'get-products-counts',
  CREATE_LOCAL_ORDER = 'create-local-order',
  CREATE_LOCAL_ORDER_TEST = 'create-local-order-test',

  // Customers (CRUD)
  CUSTOMER_CREATE = 'customer-create',
  CUSTOMER_GET_BY_ID = 'customer-get-by-id',
  CUSTOMER_GET_ALL = 'customer-get-all',
  CUSTOMER_UPDATE = 'customer-update',
  CUSTOMER_DELETE = 'customer-delete',
  CUSTOMER_COUNT = 'customer-count',
  CUSTOMER_GET_ALL_FOR_FIRST_LAUNCH_FROM_ONLINE_SERVER = 'customer-get-all-for-first-launch-from-online-server',

  // LocalStorage
  LOCAL_STORAGE_SET_ITEM = 'localStorage_ItemSet',
  TEST_INVOKE_TOKEN = 'test_invoke_token',

  // Print
  PRINT_PDF_FILE = 'print_pdf_file',

  // Auto-updater (renderer sends, main listens)
  CHECK_FOR_UPDATES = 'check-for-updates',
  DOWNLOAD_UPDATE = 'download-update',
  QUIT_AND_INSTALL = 'quit-and-install',
  UPDATE_STATUS = 'update-status',

  // CasherBox (local single row)
  CASHER_BOX_GET_OR_CREATE = 'casher-box-get-or-create',
  CASHER_BOX_UPDATE = 'casher-box-update',
  CASHER_BOX_GET_RATE = 'casher-box-get-rate',
  CASHER_BOX_UPDATE_RATE = 'casher-box-update-rate',

  // Dev / ping
  PING = 'ping',
  CHECK_SERVER_ONLINE = 'check-server-online'
}
