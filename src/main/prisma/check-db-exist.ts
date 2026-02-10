import path from 'path'
import fs from 'fs'
import { app } from 'electron'

export async function ensureDatabaseExists() {
  // Only manage DB for packaged app; in dev you can use .env as before.
  if (!app.isPackaged) {
    return
  }

  // 1. Path to userData DB (where the running app will read/write)
  const dbPath = path.join(app.getPath('userData'), 'database.db')
  const dbDir = path.dirname(dbPath)

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  // 2. If DB doesn't exist yet, seed it from the built-in template
  if (!fs.existsSync(dbPath)) {
    const templatePath = path.join(process.resourcesPath, 'prisma', 'template.db')
    if (fs.existsSync(templatePath)) {
      fs.copyFileSync(templatePath, dbPath)
      console.log('Database created from template at:', dbPath)
    } else {
      console.warn('Template DB not found at:', templatePath)
    }
  }

  // 3. Point Prisma to this DB
  const dbUrl = `file:${dbPath}`
  process.env.DATABASE_URL = dbUrl
  console.log('DATABASE_URL set to:', dbUrl)
}
