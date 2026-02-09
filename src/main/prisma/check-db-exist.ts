import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import { app } from 'electron'

export async function ensureDatabaseExists() {
  // 1. Define the path to your SQLite file
  // Using appData ensures it persists between updates
  const dbPath = path.join(app.getPath('userData'), 'database.db')
  const dbUrl = `file:${dbPath}`

  // 2. Set the DATABASE_URL environment variable dynamically
  process.env.DATABASE_URL = dbUrl

  // 3. Check if the database folder exists (optional but safe)
  const dbDir = path.dirname(dbPath)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  try {
    // 4. Run the migration
    // We use the prisma-client path to find the migrations folder
    const schemaPath = path.join(__dirname, '../../prisma/schema.prisma')

    // This command applies migrations without needing the full Prisma CLI
    execSync(`npx prisma migrate deploy --schema="${schemaPath}"`, {
      env: { ...process.env, DATABASE_URL: dbUrl }
    })

    console.log('Database is ready and migrated.')
  } catch (error) {
    console.error('Failed to migrate database:', error)
    // Handle error (maybe show a dialog to the user)
  }
}
