# Quick Start: Auto-Update Setup ✅

## ✨ What's Been Added

Your Electron app now has a complete auto-update system! Here's what's included:

### 📁 New Files Created

- ✅ `src/main/auto-updater.ts` - Auto-update logic
- ✅ `src/renderer/src/components/auto-update-notification.tsx` - Update UI
- ✅ `AUTO_UPDATE_GUIDE.md` - Complete documentation

### 🔧 Modified Files

- ✅ `src/main/index.ts` - Integrated auto-updater
- ✅ `src/preload/index.ts` - Added update API
- ✅ `src/preload/index.d.ts` - TypeScript definitions
- ✅ `src/renderer/src/App.tsx` - Added update notifications
- ✅ `src/renderer/src/locales/ar/translation.json` - Arabic translations
- ✅ `electron-builder.yml` - Update configuration options

## 🚀 Quick Start (3 Steps)

### Step 1: Choose Your Update Server

Pick one option and update `electron-builder.yml`:

**Option A: GitHub Releases** (Easiest)

```yaml
publish:
  provider: github
  owner: your-github-username
  repo: your-repo-name
```

**Option B: Your Own Server**

```yaml
publish:
  provider: generic
  url: https://your-domain.com/updates
```

### Step 2: Build Your App

```bash
pnpm run build:win
```

### Step 3: Publish Updates

**For GitHub:**

```bash
# Set your GitHub token
export GH_TOKEN=your_github_token

# Build and publish
npx electron-builder --win --publish always
```

**For Your Server:**

1. Upload `releases/latest.yml` to `https://your-domain.com/updates/latest.yml`
2. Upload `.exe` file to `https://your-domain.com/updates/YourApp-Setup-1.0.0.exe`

## 🎯 How It Works

1. **App Starts** → Checks for updates automatically
2. **Update Found** → Shows notification in top-right corner
3. **User Clicks "Download"** → Progress bar appears
4. **Download Complete** → "Restart Now" button appears
5. **User Restarts** → New version installed!

## 🧪 Test It

1. Build version 1.0.0:

```bash
pnpm run build:win
```

2. Upload to your update server

3. Change version to 1.0.1 in `package.json`

4. Build version 1.0.1:

```bash
pnpm run build:win
```

5. Upload 1.0.1 files

6. Run version 1.0.0 → Should detect and download 1.0.1!

## 📱 UI Preview

The update notifications appear in the **top-right corner** with:

- 🔵 Blue "Update Available" notification
- 📊 Progress bar during download
- ✅ Green "Update Ready" when complete
- 🌐 Full Arabic/English support

## ⚙️ Configuration

### Disable Auto-Check on Startup

In `src/main/index.ts`, comment out:

```typescript
setTimeout(() => {
  autoUpdaterManager.checkForUpdates()
}, 3000)
```

### Add Manual Update Button

```tsx
<Button onClick={() => window.autoUpdater.checkForUpdates()}>Check for Updates</Button>
```

### Change Update Check Interval

```typescript
// Check every hour
setInterval(
  () => {
    autoUpdaterManager.checkForUpdates()
  },
  60 * 60 * 1000
)
```

## 🔍 Debugging

**See logs in console:**

```
[AutoUpdater] Checking for update...
[AutoUpdater] Update available: { version: '1.0.1' }
[AutoUpdater] Download speed: 1234567 - Downloaded 50%
```

**Common Issues:**

- ❌ CORS error → Enable CORS on your server
- ❌ Can't find updates → Check `latest.yml` URL
- ❌ Not working in dev → Auto-update only works in production builds

## 📚 Next Steps

1. **Read** `AUTO_UPDATE_GUIDE.md` for detailed documentation
2. **Choose** your update hosting method
3. **Configure** `electron-builder.yml` with your settings
4. **Build** and test your first update
5. **Deploy** to production!

## 🎉 You're Ready!

Your app now has professional auto-update capabilities. Users will always have the latest version with zero hassle!

---

For detailed documentation, see `AUTO_UPDATE_GUIDE.md`
