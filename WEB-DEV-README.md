# Web Development Mode

This project can be run in the browser for faster development iterations using the React renderer without Electron.

## 🚀 Quick Start

### Development in Browser

```bash
pnpm run dev:web
```

This will:

- Start Vite dev server on `http://localhost:3000`
- Automatically open your browser
- Enable Hot Module Replacement (HMR)
- Load environment variables from `.env` file

### Development in Electron

```bash
pnpm run dev
```

### Build for Web

```bash
pnpm run build:web
```

Output will be in `dist-web/` directory.

## 🔧 Environment Variables

The project uses environment variables from the `.env` file:

```env
VITE_API_PROTOCOL=http://
VITE_API_HOST=192.168.4.14
VITE_API_PORT=:4440
VITE_API_PREFIX=/api
VITE_API_VERSION1=/v1
VITE_FALLBACK_LNG=ar
VITE_GOOGLE_MAP_KEY=your_key_here
```

All environment variables are automatically loaded and available via `import.meta.env.VITE_*`.

## ⚠️ Limitations

When running in web mode (browser), certain features may not work:

1. **Electron APIs** - Features using `window.electron` or IPC communication
2. **File System Access** - Native file operations
3. **Desktop-specific features** - System tray, notifications, etc.

## 📝 Scripts

- `pnpm run dev:web` - Run in browser (port 3000)
- `pnpm run build:web` - Build for web deployment
- `pnpm run dev` - Run in Electron
- `pnpm run build` - Build for Electron

## 🌐 Network Access

To expose the dev server on your network (accessible from other devices):

```bash
pnpm run dev:web
```

The `--host` flag is already included in the script, so the server will be accessible from:

- Local: `http://localhost:3000`
- Network: `http://<your-ip>:3000`

## 🛠️ Configuration

The web development configuration is in `vite.renderer.config.ts`. It includes:

- Path aliases (same as Electron renderer)
- Environment variable loading
- Port configuration (3000)
- Auto-open browser
- Build output directory (`dist-web/`)
