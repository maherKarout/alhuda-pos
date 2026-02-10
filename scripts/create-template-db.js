/**
 * Build-time script to create a fresh SQLite template DB from the Prisma schema.
 * This DB will be shipped with the app and copied to userData on first run,
 * so end users always start from a clean database (no dev data).
 */
const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

const root = path.resolve(__dirname, '..')
const schemaPath = path.join(root, 'prisma', 'schema.prisma')
const templatePath = path.join(root, 'prisma', 'template.db')

// Remove any previous template so we always start clean
if (fs.existsSync(templatePath)) {
  fs.unlinkSync(templatePath)
}

console.log('[create-template-db] Using schema:', schemaPath)
console.log('[create-template-db] Creating fresh template DB at:', templatePath)

// Use Prisma CLI to push the schema into the template DB
execSync(
  `npx prisma db push --schema="${schemaPath}" --url="file:${templatePath}"`,
  {
    stdio: 'inherit',
    cwd: root,
    env: process.env
  }
)

console.log('[create-template-db] Template DB created successfully.')

