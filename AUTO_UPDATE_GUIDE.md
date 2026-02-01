# Auto-Update Guide for Alhuda POS

This guide explains how to use the auto-update system in your Electron application.

## 🚀 Features

- ✅ Automatic update checking on app startup
- ✅ User-friendly notifications for available updates
- ✅ Download progress indicator
- ✅ One-click install and restart
- ✅ Multi-language support (Arabic/English)
- ✅ Error handling and logging

## 📋 How It Works

1. **App starts** → Auto-updater checks for updates after 3 seconds
2. **Update available** → User gets notification with download option
3. **User clicks download** → Progress bar shows download status
4. **Download complete** → User can restart to install or postpone
5. **User clicks restart** → App quits and installs the update

## 🔧 Configuration Options

### Option 1: GitHub Releases (Recommended)

Best for open-source projects or if you use GitHub.

1. Update `electron-builder.yml`:

```yaml
publish:
  provider: github
  owner: your-github-username
  repo: your-repo-name
  releaseType: release
```

2. Create a GitHub token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` scope
   - Set environment variable: `GH_TOKEN=your_token`

3. Build and publish:

```bash
pnpm run build:win
npx electron-builder --win --publish always
```

### Option 2: Generic HTTP Server

Host update files on your own server.

1. Update `electron-builder.yml`:

```yaml
publish:
  provider: generic
  url: https://your-server.com/updates
```

2. Build your app:

```bash
pnpm run build:win
```

3. Upload these files to your server:
   - `releases/latest.yml` → `https://your-server.com/updates/latest.yml`
   - `releases/alhuda-app-POS-Setup-1.0.0-x64.exe` → `https://your-server.com/updates/alhuda-app-POS-Setup-1.0.0-x64.exe`

4. Enable CORS on your server (important!):

```nginx
# Nginx example
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Methods GET;
```

### Option 3: Amazon S3

1. Update `electron-builder.yml`:

```yaml
publish:
  provider: s3
  bucket: your-bucket-name
  region: us-east-1
```

2. Set AWS credentials:

```bash
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
```

3. Build and publish:

```bash
pnpm run build:win
npx electron-builder --win --publish always
```

## 📁 File Structure

```
src/
├── main/
│   ├── index.ts              # Main process entry (auto-update initialization)
│   └── auto-updater.ts       # Auto-updater logic and event handlers
├── preload/
│   ├── index.ts              # Preload script (exposes API to renderer)
│   └── index.d.ts            # TypeScript definitions
└── renderer/
    └── src/
        ├── App.tsx           # Main app (includes AutoUpdateNotification)
        └── components/
            └── auto-update-notification.tsx  # Update UI component
```

## 🔄 Version Management

### Updating Your App Version

1. Update version in `package.json`:

```json
{
  "version": "1.0.1"
}
```

2. Build new version:

```bash
pnpm run build:win
```

3. Publish update files to your chosen provider (GitHub, server, S3)

### Version Numbering Best Practices

- **Major.Minor.Patch** (e.g., 1.0.1)
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes

## 🧪 Testing Auto-Updates

### Development Testing

1. Update `dev-app-update.yml` with your test server:

```yaml
provider: generic
url: http://localhost:3000/updates
updaterCacheDirName: electron-app-with-vite-updater
```

2. Build version 1.0.0:

```bash
pnpm run build:win
```

3. Upload files to test server

4. Update version to 1.0.1 in `package.json`

5. Build version 1.0.1:

```bash
pnpm run build:win
```

6. Upload new files to test server

7. Run version 1.0.0 → It should detect and download 1.0.1

### Production Testing

1. Build with production settings
2. Test on clean machine without dev tools
3. Verify update notifications appear
4. Test update download and installation
5. Confirm app version after restart

## 🎨 UI Customization

The update notifications are built with Material-UI and support RTL (Arabic). You can customize them in `auto-update-notification.tsx`:

### Change Colors

```tsx
<Alert severity="info" sx={{ backgroundColor: 'your-color' }}>
```

### Change Position

```tsx
<Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
```

### Auto-hide Notifications

```tsx
<Snackbar autoHideDuration={6000}>
```

## 🌐 Manual Update Check

Users can manually check for updates by calling:

```tsx
window.autoUpdater.checkForUpdates()
```

You can add a menu item or button for this:

```tsx
<Button onClick={() => window.autoUpdater.checkForUpdates()}>Check for Updates</Button>
```

## 🔍 Debugging

### Enable Auto-Update Logs

The auto-updater logs are in the console. To see them:

1. Open DevTools in production build
2. Look for `[AutoUpdater]` logs

### Common Issues

**Issue**: Updates not detecting

- **Solution**: Check `latest.yml` is accessible at your update URL
- Test: `curl https://your-server.com/updates/latest.yml`

**Issue**: CORS errors

- **Solution**: Enable CORS on your update server
- Headers needed: `Access-Control-Allow-Origin: *`

**Issue**: Download fails

- **Solution**: Ensure executable file is accessible
- Check file permissions and URL

**Issue**: Auto-update disabled in development

- **Solution**: This is by design. Use production build to test

## 📝 Build Commands

```bash
# Development
pnpm run dev                    # Run app in development mode

# Production Build
pnpm run build                  # Build app
pnpm run build:win             # Build for Windows
pnpm run build:mac             # Build for macOS
pnpm run build:linux           # Build for Linux

# Publish Updates
npx electron-builder --win --publish always    # Build and publish
```

## 🔐 Code Signing (Recommended for Windows)

For Windows, code sign your app to avoid security warnings:

1. Get a code signing certificate
2. Update `electron-builder.yml`:

```yaml
win:
  certificateFile: path/to/certificate.pfx
  certificatePassword: your-password
```

## 📚 Additional Resources

- [electron-updater docs](https://www.electron.build/auto-update)
- [electron-builder docs](https://www.electron.build/)
- [Release strategies](https://www.electron.build/configuration/publish)

## 🆘 Support

If you encounter issues:

1. Check the console logs
2. Verify your publish configuration
3. Test the update URL manually
4. Check CORS headers
5. Review electron-builder documentation

---

**Note**: Auto-updates only work in production builds, not in development mode.
