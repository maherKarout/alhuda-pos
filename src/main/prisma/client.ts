import 'dotenv/config'
import { app } from 'electron'
import path from 'path'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import type { PrismaClient as PrismaClientType } from '@prisma/client'

function getPrismaClientCtor(): { PrismaClient: typeof PrismaClientType } {
  // In packaged app, load the generated client directly from resources/.prisma/client
  if (app.isPackaged) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(path.join(process.resourcesPath, '.prisma', 'client'))
  }

  // In dev, use the normal @prisma/client package
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('@prisma/client')
}

const { PrismaClient } = getPrismaClientCtor()

// Get database URL from .env
const connectionString = process.env.DATABASE_URL!

// Create adapter for SQLite
const adapter = new PrismaBetterSqlite3({ url: connectionString })

// Create Prisma Client instance
export const prisma = new PrismaClient({ adapter })
