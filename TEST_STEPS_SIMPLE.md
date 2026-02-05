# Simple Testing Steps 🚀

## Prerequisites

- Node.js installed
- Project built at least once

## 5-Minute Test

### 1️⃣ Install http-server (one-time setup)

```bash
pnpm install -g http-server
```

### 2️⃣ Build Version 1.0.0

```bash
# Make sure package.json has "version": "1.0.0"
pnpm run build:win
```

**Result**: Files created in `releases/` folder

### 3️⃣ Start Update Server

```bash
# Windows
test-update.bat

# Mac/Linux
chmod +x test-update.sh
./test-update.sh
```

**Result**: Server running at http://localhost:8080

**Keep this terminal open!** ⚠️

### 4️⃣ Install & Run Version 1.0.0

- Go to `releases/` folder
- Double-click `alhuda-app-POS-Setup-1.0.0-x64.exe`
- Install the app
- Launch it

**What to expect:**

- App opens
- Console shows: "Checking for update..."
- Console shows: "Update not available" (because 1.0.0 is latest)

### 5️⃣ Create Version 1.0.1

**In a NEW terminal:**

1. Update `package.json`:

```json
{
  "version": "1.0.1" // Changed from 1.0.0
}
```

2. Build new version:

   ```bash
   pnpm run build:win
   ```

3. Copy new files to update server:

```bash
# Windows
copy releases\latest.yml update-server\
copy "releases\alhuda-app-POS-Setup-1.0.1-x64.exe" update-server\

# Mac/Linux
cp releases/latest.yml update-server/
cp releases/alhuda-app-POS-Setup-1.0.1-x64.exe update-server/
```

### 6️⃣ Test Auto-Update! 🎉

1. **Close version 1.0.0** if it's still running

2. **Open version 1.0.0 again** (the installed version)

3. **Wait 3-5 seconds...**

4. **You should see:**

   ✅ **Dialog appears:**

   ```
   Update Available

   A new version (1.0.1) is available.
   Would you like to download it now?

   [Later]  [Download]
   ```

   ✅ **Notification in top-right corner** (blue info icon)

   ✅ **Console logs:**

   ```
   [AutoUpdater] Checking for update...
   [AutoUpdater] Update available: { version: '1.0.1' }
   ```

5. **Click "Download"**

   ✅ **Progress bar appears**

   ✅ **Console shows download progress:**

   ```
   [AutoUpdater] Download speed: 1234567 - Downloaded 25%
   [AutoUpdater] Download speed: 1234567 - Downloaded 50%
   [AutoUpdater] Download speed: 1234567 - Downloaded 100%
   ```

6. **When download completes:**

   ✅ **Dialog appears:**

   ```
   Update Ready

   Update downloaded. The application will restart
   to install the update.

   [Later]  [Restart Now]
   ```

7. **Click "Restart Now"**

   ✅ **App closes and reopens**

   ✅ **Now running version 1.0.1!**

---

## Visual Checklist

| Step | Action              | Expected Result                            |
| ---- | ------------------- | ------------------------------------------ |
| 1    | Install http-server | `pnpm install -g http-server` succeeds     |
| 2    | Build v1.0.0        | `releases/` folder has .exe and latest.yml |
| 3    | Run test-update.bat | Server starts at http://localhost:8080     |
| 4    | Install v1.0.0      | App installs and runs                      |
| 5    | Check console       | "Update not available" message             |
| 6    | Change to v1.0.1    | package.json shows 1.0.1                   |
| 7    | Build v1.0.1        | New files in releases/                     |
| 8    | Copy to server      | Files copied to update-server/             |
| 9    | Run v1.0.0          | Update dialog appears                      |
| 10   | Click Download      | Progress bar shows                         |
| 11   | Click Restart       | App updates to 1.0.1                       |

---

## Quick Troubleshooting

### ❌ "Update not available" when testing 1.0.1

**Check:**

```bash
# Is the server running?
curl http://localhost:8080/latest.yml

# Does it show version 1.0.1?
type update-server\latest.yml
```

**Fix:** Copy the new latest.yml to update-server/

### ❌ CORS errors

**Fix:** Make sure you're using `--cors` flag:

```bash
http-server --cors -p 8080
```

### ❌ Download fails

**Check:** File exists and name matches

```bash
dir update-server\*.exe
```

### ❌ Nothing happens after 3 seconds

**Try manual check:**

1. Open DevTools (Ctrl+Shift+I)
2. In Console, run:

```javascript
window.autoUpdater.checkForUpdates()
```

---

## Success! What's Next?

✅ **Auto-update is working!**

Now choose your production hosting:

- **GitHub Releases** - Free, easy
- **Your Server** - Full control
- **AWS S3** - Scalable

See `AUTO_UPDATE_GUIDE.md` for production setup.

---

## Pro Tips

💡 **Add version display** to see updates visually:

```tsx
// In App.tsx
<div>Version {require('../../../package.json').version}</div>
```

💡 **Test multiple updates** in sequence:

- 1.0.0 → 1.0.1 → 1.0.2

💡 **Clear cache** between tests:

```bash
# Windows: Delete
%APPDATA%\alhuda-pos-updater

# Mac: Delete
~/Library/Application Support/alhuda-pos-updater
```

---

**Happy Testing! 🎉**
