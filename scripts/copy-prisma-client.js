/**
 * Ensure Prisma's generated client is available at a path that works in production.
 *
 * Prisma (with pnpm) generates the client under:
 *   node_modules/.pnpm/@prisma+client@<ver>_<hash>/node_modules/.prisma/client/...
 * and @prisma/client/default.js does:
 *   require('.prisma/client/default')
 * which resolves relative to @prisma/client's directory.
 *
 * In dev, pnpm symlinks make this work, but when packaging with electron-builder/ASAR
 * those symlinks are not preserved, so we must copy:
 *
 *   <pnpm store>/.prisma  -->  node_modules/@prisma/client/.prisma
 *
 * Run this before electron-builder (e.g. in build:win).
 */
const path = require('path')
const fs = require('fs')

const root = path.resolve(__dirname, '..')
const pnpmDir = path.join(root, 'node_modules', '.pnpm')
const clientStorePrefix = '@prisma+client@'

function findPrismaStorePrismaDir() {
  if (!fs.existsSync(pnpmDir)) return null

  const entries = fs.readdirSync(pnpmDir)
  const prismaEntry = entries.find((name) => name.startsWith(clientStorePrefix))
  if (!prismaEntry) return null

  const candidate = path.join(pnpmDir, prismaEntry, 'node_modules', '.prisma')

  return fs.existsSync(candidate) ? candidate : null
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name))
    }
  } else {
    fs.copyFileSync(src, dest)
  }
}

const source = findPrismaStorePrismaDir()
if (!source) {
  console.warn(
    'scripts/copy-prisma-client.js: unable to find generated Prisma client under node_modules/.pnpm. Run "npx prisma generate" first.'
  )
  process.exit(0)
}

const target = path.join(root, 'node_modules', '@prisma', 'client', '.prisma')

if (fs.existsSync(target)) {
  try {
    fs.rmSync(target, { recursive: true })
  } catch (_) {
    // ignore
  }
}

copyRecursive(source, target)
console.log(`Copied Prisma client from "${source}" to "${target}" for packaging.`)
