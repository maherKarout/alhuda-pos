// // // import 'dotenv/config'
// // // import { app } from 'electron'
// // // import path from 'path'
// // // import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
// // // import type { PrismaClient as PrismaClientType } from '@prisma/client'

// // // function getPrismaClientCtor(): { PrismaClient: typeof PrismaClientType } {
// // //   // In packaged app, load the generated client directly from resources/.prisma/client
// // //   if (app.isPackaged) {
// // //     // eslint-disable-next-line @typescript-eslint/no-var-requires
// // //     return require(path.join(process.resourcesPath, '.prisma', 'client'))
// // //   }

// // //   // In dev, use the normal @prisma/client package
// // //   // eslint-disable-next-line @typescript-eslint/no-var-requires
// // //   return require('@prisma/client')
// // // }

// // // const { PrismaClient } = getPrismaClientCtor()

// // // // Get database URL from .env
// // // const connectionString = process.env.DATABASE_URL!

// // // // Create adapter for SQLite
// // // const adapter = new PrismaBetterSqlite3({ url: connectionString })

// // // // Create Prisma Client instance
// // // export const prisma = new PrismaClient({ adapter })

// // // Import directly from your generated folder
// // import { PrismaClient } from '../../generated/client'
// // import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
// // import path from 'path'
// // import { app } from 'electron'

// // // Define engine path for production
// // const enginePath = app.isPackaged
// //   ? path.join(
// //       process.resourcesPath,
// //       'app.asar.unpacked',
// //       'node_modules',
// //       '.prisma',
// //       'client',
// //       'query-engine-windows.exe'
// //     )
// //   : undefined

// // const connectionString = process.env.DATABASE_URL!
// // const adapter = new PrismaBetterSqlite3({ url: connectionString })

// // export const prisma = new PrismaClient({
// //   adapter,
// //   // Tell Prisma where the unpacked binary is
// //   __internal: {
// //     engine: {
// //       binaryPath: enginePath
// //     }
// //   }
// // })

// // import { PrismaClient } from '../../generated/client' // Or wherever your client is generated
// // import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
// // import Database from 'better-sqlite3'
// // import path from 'path'
// // import { app } from 'electron'

// // // 1. Determine the correct DB path (using app.getPath for production)
// // const dbPath = app.isPackaged
// //   ? path.join(app.getPath('userData'), 'database.db')
// //   : path.join(__dirname, '../../prisma/dev.db')

// // // 2. Initialize the native driver
// // const sqlite = new Database(dbPath)

// // // 3. Initialize the Prisma Adapter
// // const adapter = new PrismaBetterSqlite3(sqlite)

// // // 4. Instantiate PrismaClient (No __internal needed!)
// // export const prisma = new PrismaClient({ adapter })

// // src/main/prisma/client.ts

// // import { PrismaClient } from '../../generated/client'
// import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
// import path from 'path'
// import { app } from 'electron'
// import { PrismaClient } from '@prisma/client'

// // 1. Get the absolute path to your database
// const dbPath = app.isPackaged
//   ? path.join(app.getPath('userData'), 'database.db')
//   : path.resolve(__dirname, '../../prisma/dev.db')

// // 2. Initialize the adapter with the 'url' property
// // Note: Prisma 7 SQLite adapters require the "file:" prefix
// const adapter = new PrismaBetterSqlite3({
//   url: `file:${dbPath}`
// })

// // 3. Instantiate the client
// export const prisma = new PrismaClient({ adapter })

import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
// import { PrismaClient } from '../../generated/prisma'
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaBetterSqlite3({ url: connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }
