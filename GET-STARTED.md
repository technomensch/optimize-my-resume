# Get Started - Optimize My Resume Local Development

You now have a complete local development environment set up! 🎉

## What You Have

✅ **React + Vite App** - Modern dev environment
✅ **Ollama Integration** - Free, unlimited AI models
✅ **Model Configuration** - Easy to customize
✅ **Complete Documentation** - Guides for everything
✅ **Quick Start Script** - Automated setup

## Fastest Way to Start

### Option 1: Automated (Recommended)

```bash
./quick-start.sh
```

This script:
- Checks prerequisites
- Installs dependencies
- Checks Ollama status
- Offers to download recommended model
- Guides you through setup

### Option 2: Manual

```bash
# 1. Install dependencies
npm install

# 2. Start Ollama (separate terminal)
ollama serve

# 3. Pull a model (if you haven't)
ollama pull llama3.1:8b

# 4. Start dev server
npm run dev
```

Then open http://localhost:3000

## First Time Setup (5-10 minutes)

### 1. Check Prerequisites

- [ ] Node.js installed: `node --version`
- [ ] Ollama installed: `ollama --version`
- [ ] At least 8GB RAM available

### 2. Install Ollama Model

```bash
# Recommended model (5GB download)
ollama pull llama3.1:8b
```

### 3. Start Development

```bash
npm run dev
```

## Quick Test

1. Open http://localhost:3000
2. Paste this test resume:

```
Software Engineer
Tech Corp | 2020-2022

- Built microservices architecture serving 1M+ users
- Reduced deployment time by 60% through CI/CD automation
- Led team of 3 engineers in migration to cloud infrastructure
```

3. Select "Llama 3.1" model
4. Click "Analyze Resume"
5. Wait 30-60 seconds for results

If you see analysis results, it's working! 🎉

## Customize Models

Want to add/remove/reorder models?

Edit [`src/config/models.json`](src/config/models.json):

```json
{
  "ollama": [
    {
      "id": "llama3.1:8b",
      "name": "🦙 Llama 3.1",
      "desc": "Recommended",
      "recommended": true
    }
    // Add more here
  ]
}
```

See [MODEL-CONFIGURATION-GUIDE.md](docs/MODEL-CONFIGURATION-GUIDE.md) for details.

## Next Steps

### Learn More

- [README-LOCAL-DEV.md](README-LOCAL-DEV.md) - Full documentation
- [SETUP-GUIDE.md](SETUP-GUIDE.md) - Detailed setup
- [MODEL-CONFIGURATION-GUIDE.md](docs/MODEL-CONFIGURATION-GUIDE.md) - Model customization
- [STATUS.md](STATUS.md) - Current status & roadmap

### Try Different Models

```bash
# Fast model
ollama pull mistral

# Analytical model
ollama pull gemma2:9b

# Creative model
ollama pull qwen2.5:7b

# Low RAM model
ollama pull phi3
```

Then refresh the page or click "Check Status".

### Common Issues

**"Ollama Not Running"**
```bash
ollama serve
```

**"No Models in Dropdown"**
```bash
ollama pull llama3.1:8b
```

**"Port 3000 in Use"**
```bash
lsof -ti:3000 | xargs kill -9
```

See [SETUP-GUIDE.md](SETUP-GUIDE.md) for more troubleshooting.

## Key Features

### 🆓 Free & Unlimited
- No API tokens required
- No usage limits
- No cloud dependency

### 🔒 Private
- Resume data never leaves your machine
- No external API calls
- Works completely offline (after setup)

### ⚙️ Flexible
- Easy to add/remove models
- Test different AI models
- Fast iteration

### 📚 Well Documented
- 5 comprehensive guides
- Quick start script
- Inline code comments

## File Structure

```
optimize-my-resume/
├── src/
│   ├── components/
│   │   └── ResumeAnalyzer-local.jsx      # Main UI (Ollama)
│   ├── services/
│   │   └── ollamaService.js              # Ollama API
│   ├── config/
│   │   └── models.json                   # ⭐ Edit this!
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── docs/
│   ├── MODEL-CONFIGURATION-GUIDE.md
│   └── v7.0.0-LOCAL-DEV-SETUP-SUMMARY.md
├── README-LOCAL-DEV.md              # Full docs
├── SETUP-GUIDE.md                   # Setup help
├── STATUS.md                        # Current status
├── GET-STARTED.md                   # This file
├── quick-start.sh                   # Auto setup
├── package.json
├── vite.config.js
└── postcss.config.js                # PostCSS (Tailwind v4)
```

## Development Workflow

1. **Start Ollama** (once per session)
   ```bash
   ollama serve
   ```

2. **Start Dev Server** (auto-reloads on changes)
   ```bash
   npm run dev
   ```

3. **Make Changes**
   - Edit files in `src/`
   - Page auto-refreshes

4. **Test**
   - Try different models
   - Test error cases
   - Verify UI works

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Getting Help

1. **Check Docs**: Start with README-LOCAL-DEV.md
2. **Console Logs**: Open browser console (F12)
3. **Debug Mode**: Click "Show Debug Info" in errors
4. **Ollama Logs**: Check terminal running `ollama serve`
5. **GitHub Issues**: Open an issue if stuck

## Production vs Local

| Feature | Local (This) | Production (Artifact) |
|---------|-------------|----------------------|
| Cost | Free | Token-based |
| Setup | Required | None |
| Speed | 20-60s | 10-30s |
| Privacy | 100% local | Cloud |
| Limits | None | 500K tokens/5hrs |
| Quality | Good | Excellent |

Use **Local** for:
- Development
- Testing
- When out of tokens
- Privacy-sensitive resumes

Use **Production** for:
- End users
- Best quality
- Fastest results
- No local setup

## Success! 🎉

If you can:
- ✅ See green "Ollama Connected" banner
- ✅ Select a model from dropdown
- ✅ Analyze a resume successfully

You're ready to develop!

## What's Next?

Future enhancements (Phase 2+):
- Bullet optimization
- Job description matching
- Resume history
- Multi-model comparison
- Export to PDF/DOCX

See [v7.0.0-LOCAL-DEV-SETUP-SUMMARY.md](docs/v7.0.0-LOCAL-DEV-SETUP-SUMMARY.md) for roadmap.

## Questions?

- Read the docs (all 5 guides)
- Check STATUS.md for known issues
- Open a GitHub issue

---

**Ready to start?** Run: `./quick-start.sh`

**Happy Coding!** 🚀
