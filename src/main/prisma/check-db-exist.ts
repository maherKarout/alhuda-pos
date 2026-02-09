import { execSync } from 'child_process'
import { app } from 'electron'
import path from 'path'

export function ensureDatabase() {
  try {
    const prismaPath = path.join(
      process.resourcesPath,
      'app.asar.unpacked',
      'node_modules',
      '.bin',
      'prisma'
    )

    execSync(`"${prismaPath}" db push`, {
      stdio: 'inherit'
    })

    console.log('✅ Database ensured')
  } catch (e) {
    console.error('❌ Failed to setup database', e)
  }
}
