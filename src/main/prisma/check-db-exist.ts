import path from 'path'
import fs from 'fs'
import { app } from 'electron'

/**
 * Production DB setup:
 * - Dev/CLI keep using .env: file:./db/dev.db
 * - Packaged app uses the built-in template DB under resources/prisma/template.db
 *   (no per-user copy).
 */
export async function ensureDatabaseExists() {
  if (!app.isPackaged) {
    // In dev, DATABASE_URL comes from .env and points to ./db/dev.db
    return
  }

  // Single DB file shipped with the app (created at build time)
  const dbPath = path.join(process.resourcesPath, 'prisma', 'template.db')
  if (!fs.existsSync(dbPath)) {
    console.warn('Packaged DB not found at:', dbPath)
  }

  const dbUrl = `file:${dbPath}`
  process.env.DATABASE_URL = dbUrl
  console.log('[ensureDatabaseExists] DATABASE_URL set to:', dbUrl)
}
