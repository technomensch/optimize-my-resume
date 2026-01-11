# Setup Guide - Local Development with Ollama

Quick start guide for setting up the local development environment.

## Prerequisites Check

Before starting, verify you have:

- [ ] Node.js (v16+)
  ```bash
  node --version  # Should show v16 or higher
  ```

- [ ] npm
  ```bash
  npm --version
  ```

- [ ] Ollama installed
  ```bash
  ollama --version
  ```

If Ollama is not installed: https://ollama.ai/download

## Installation Steps

### 1. Clone and Switch to Branch

```bash
cd /path/to/optimize-my-resume
git checkout 7.0.0-create-local-dev-test-environment
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- React & React DOM
- Vite (dev server & build tool)
- Tailwind CSS (styling)
- Lucide React (icons)

### 3. Install Ollama Models

Install at least one model (Llama 3.1 recommended):

```bash
# Recommended - best balance of speed/quality
ollama pull llama3.1:8b

# Optional - faster, lower quality
ollama pull mistral

# Optional - analytical
ollama pull gemma2:9b

# Optional - creative
ollama pull qwen2.5:7b

# Optional - precise, low RAM
ollama pull phi3
```

**Check installed models:**
```bash
ollama list
```

### 4. Start Ollama Server

Open a **separate terminal** and run:

```bash
ollama serve
```

Leave this running in the background.

**⚠️ Important**: Keep this terminal open while developing!

### 5. Start Development Server

In your **original terminal**:

```bash
npm run dev
```

The app will open at: http://localhost:3000

## Verify Setup

### Check 1: Ollama Connection

Look for green banner at top of app:
```
✅ Local Ollama Connected
X models available • Unlimited usage
```

If you see red banner:
- Make sure `ollama serve` is running
- Click "Check Status" button to retry

### Check 2: Models Loaded

Open the model dropdown. You should see:
- All installed models listed
- Recommended model (Llama 3.1) auto-selected

### Check 3: Analysis Works

1. Paste a test resume
2. Select a model
3. Click "Analyze Resume"
4. Wait for results (30-60 seconds)

## Common Setup Issues

### Issue: "Ollama Not Running"

**Solution:**
```bash
# Start Ollama in a separate terminal
ollama serve
```

### Issue: No Models in Dropdown

**Cause**: No models installed

**Solution:**
```bash
ollama pull llama3.1:8b
```

Then refresh the page or click "Check Status".

### Issue: Port 3000 Already in Use

**Error**: `Port 3000 is already in use`

**Solution 1** - Kill the process:
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

**Solution 2** - Use different port:

Edit `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,  // ← Change this
    open: true
  }
})
```

### Issue: Module Not Found Errors

**Cause**: Dependencies not installed

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Tailwind Styles Not Working

**Cause**: Tailwind not configured properly

**Solution:**
```bash
# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer
npm run dev
```

## Customization

### Change Which Models Appear

Edit `src/config/models.json`:

```json
{
  "ollama": [
    {
      "id": "llama3.1:8b",
      "name": "🦙 Llama 3.1",
      "desc": "Recommended",
      "recommended": true
    }
    // Add/remove models here
  ]
}
```

See [docs/MODEL-CONFIGURATION-GUIDE.md](docs/MODEL-CONFIGURATION-GUIDE.md) for details.

### Change Port

Edit `vite.config.js`:

```javascript
server: {
  port: 3001,  // Change to any available port
  open: true
}
```

### Change Ollama URL

Edit `src/services/ollamaService.js`:

```javascript
const OLLAMA_BASE_URL = 'http://localhost:11434';  // Change if Ollama is remote
```

## Development Workflow

### Typical Development Session

1. **Start Ollama** (separate terminal):
   ```bash
   ollama serve
   ```

2. **Start Dev Server** (main terminal):
   ```bash
   npm run dev
   ```

3. **Make Changes**:
   - Edit code in `src/`
   - App auto-reloads on save

4. **Test**:
   - Analyze test resumes
   - Try different models
   - Check error handling

5. **Stop** (Ctrl+C in both terminals)

### Hot Reload

Vite automatically reloads when you edit:
- ✅ `.jsx` files - instant reload
- ✅ `.css` files - instant reload
- ✅ `.json` configs - requires manual refresh (F5)
- ❌ `vite.config.js` - restart server

### Building for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

Build output goes to `dist/` folder.

## Project Structure

```
optimize-my-resume/
├── src/
│   ├── components/
│   │   └── ResumeAnalyzer.jsx      # Main UI component
│   ├── services/
│   │   └── ollamaService.js        # Ollama API client
│   ├── config/
│   │   └── models.json             # Model configuration
│   ├── App.jsx                     # App shell
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Tailwind imports
├── public/                         # Static assets
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind configuration
├── package.json                    # Dependencies & scripts
└── README-LOCAL-DEV.md             # This file
```

## Next Steps

Once setup is complete:

1. **Read**: [README-LOCAL-DEV.md](README-LOCAL-DEV.md) - Full documentation
2. **Customize**: [docs/MODEL-CONFIGURATION-GUIDE.md](docs/MODEL-CONFIGURATION-GUIDE.md) - Model setup
3. **Develop**: Start building features!

## Troubleshooting Resources

- **Ollama Docs**: https://github.com/ollama/ollama/blob/main/docs/api.md
- **Vite Docs**: https://vitejs.dev/guide/
- **React Docs**: https://react.dev/
- **Tailwind Docs**: https://tailwindcss.com/docs

## Getting Help

If you're stuck:

1. Check console for errors (F12 → Console)
2. Look at Network tab (F12 → Network)
3. Check Ollama server logs (terminal running `ollama serve`)
4. Read error messages carefully
5. Open an issue: https://github.com/technomensch/optimize-my-resume/issues

## Success!

If you see:
- ✅ Green "Ollama Connected" banner
- ✅ Models in dropdown
- ✅ Resume analysis works

You're ready to develop! 🎉

---

**Next**: Read [README-LOCAL-DEV.md](README-LOCAL-DEV.md) for full features and usage.
