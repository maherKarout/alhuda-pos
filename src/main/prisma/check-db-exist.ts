import path from 'path'
import fs from 'fs'
import { app } from 'electron'

/**
 * Production DB setup:
 * - Dev/CLI keep using .env: file:./db/dev.db
 * - Packaged app copies the read-only template from resources/prisma/template.db
 *   to a writable per-user path (userData/database.db) when absent, then sets
 *   DATABASE_URL so Prisma always operates on the writable DB.
 */
export async function ensureDatabaseExists(): Promise<void> {
  if (!app.isPackaged) {
    // In dev, DATABASE_URL comes from .env and points to ./db/dev.db
    return
  }

  const templatePath = path.join(process.resourcesPath, 'prisma', 'template.db')
  const userDataDir = app.getPath('userData')
  const writableDbPath = path.join(userDataDir, 'database.db')

  if (!fs.existsSync(writableDbPath)) {
    if (!fs.existsSync(templatePath)) {
      console.warn('Packaged DB template not found at:', templatePath)
    } else {
      fs.mkdirSync(userDataDir, { recursive: true })
      fs.copyFileSync(templatePath, writableDbPath)
      console.log('[ensureDatabaseExists] Copied template DB to:', writableDbPath)
    }
  }

  const dbUrl = `file:${writableDbPath}`
  process.env.DATABASE_URL = dbUrl
  console.log('[ensureDatabaseExists] DATABASE_URL set to:', dbUrl)
}
