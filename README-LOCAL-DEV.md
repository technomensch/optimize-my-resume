# Local Development Environment - Ollama Integration

This document describes the local development setup for Optimize My Resume using Ollama AI models.

> **Latest Version**: v7.0.1
> **Branch**: `main` (merged from v7.0.1-analyzer-gui-fixes)
> **Last Updated**: January 2026

## Overview

- **Production**: Uses Claude API (artifact in Claude.ai) - requires tokens, cloud-based
- **Local Dev**: Uses Ollama (this setup) - free, unlimited, runs on your machine

## Recent Updates (v7.0.1)

The v7.0.1 release includes important fixes and improvements:

### Tailwind CSS v4 Migration
- **What Changed**: Migrated from Tailwind v3 to v4 syntax
- **Impact**: Removed `tailwind.config.js`, updated `src/index.css` to use `@import "tailwindcss"`
- **Why It Matters**: v4 uses CSS-based configuration instead of JS config files
- **More Info**: [Tailwind v4 Styling Fix Lessons Learned](docs/lessons-learned/debugging/Lessons_Learned_Tailwind_v4_Styling_Fix.md)

### Ollama Model Tag Matching
- **What Changed**: Added tag normalization to handle `:latest` suffix behavior
- **Impact**: Models now correctly appear in dropdown even when config uses short names (e.g., `"mistral"` matches API's `"mistral:latest"`)
- **Why It Matters**: Prevents "install model" prompts for already-installed models
- **More Info**: [Ollama Model Tag Matching Lessons Learned](docs/lessons-learned/debugging/Lessons_Learned_Ollama_Model_Tag_Matching.md)

### Component Rename
- **What Changed**: `ResumeAnalyzer.jsx` → `ResumeAnalyzer-local.jsx`
- **Why**: Distinguishes local Ollama implementation from production Claude artifact version

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Ollama** installed and running
   - Install: https://ollama.ai/download
   - Start: `ollama serve` (in a separate terminal)
3. **Ollama Models** (at least one required):
   ```bash
   # Recommended - best for resume analysis
   ollama pull llama3.1:8b

   # Optional - other models
   ollama pull mistral      # Note: Ollama stores as mistral:latest
   ollama pull gemma2:9b
   ollama pull qwen2.5:7b
   ollama pull phi3         # Note: Ollama stores as phi3:latest
   ```

> **Note on Model Tags**: When you pull a model without specifying a tag (e.g., `ollama pull mistral`), Ollama automatically appends `:latest`. The app handles this automatically - you don't need to worry about tag matching. See [Ollama Tag Matching Guide](docs/lessons-learned/debugging/Lessons_Learned_Ollama_Model_Tag_Matching.md) for details.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Ollama (if not already running)
```bash
# In a separate terminal
ollama serve
```

### 3. Run the Development Server
```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
optimize-my-resume/
├── src/
│   ├── components/
│   │   └── ResumeAnalyzer-local.jsx  # Main UI component (Ollama version)
│   ├── services/
│   │   └── ollamaService.js          # Ollama API integration
│   ├── config/
│   │   └── models.json               # ⭐ Model configuration (EDIT THIS!)
│   ├── App.jsx                       # App shell with Ollama status
│   ├── main.jsx                      # React entry point
│   └── index.css                     # Tailwind CSS (v4 syntax)
├── docs/
│   ├── plans/
│   │   └── v7.0.1-analyzer-gui-fixes.md
│   └── lessons-learned/
│       └── debugging/
│           ├── Lessons_Learned_Tailwind_v4_Styling_Fix.md
│           └── Lessons_Learned_Ollama_Model_Tag_Matching.md
├── index.html                        # HTML entry point
├── vite.config.js                    # Vite configuration
├── postcss.config.js                 # PostCSS configuration (Tailwind v4)
└── package.json                      # Dependencies and scripts
```

**Key Configuration Files:**
- **`src/index.css`**: Uses Tailwind v4 `@import "tailwindcss"` syntax (not `@tailwind` directives)
- **`postcss.config.js`**: PostCSS configuration with `@tailwindcss/postcss` plugin
- **`src/config/models.json`**: Model definitions for dropdown
- **No `tailwind.config.js`**: Tailwind v4 uses CSS-based configuration

> **Important**: If you're upgrading from v7.0.0 or migrating from Tailwind v3, see the [Tailwind v4 Migration Guide](docs/lessons-learned/debugging/Lessons_Learned_Tailwind_v4_Styling_Fix.md).

## Customizing Models

### Easy Method: Edit Config File

Open `src/config/models.json` and modify the `ollama` array:

```json
{
  "ollama": [
    {
      "id": "llama3.1:8b",              // ← Model ID (must match Ollama)
      "name": "🦙 Llama 3.1",            // ← Display name
      "desc": "Recommended - Best for resumes", // ← Description
      "recommended": true                // ← Shows first in dropdown
    },
    {
      "id": "mistral",
      "name": "⚡ Mistral",
      "desc": "Fast - Quick analysis"
    }
    // Add more models here...
  ]
}
```

**To add a new model:**
1. Install it: `ollama pull model-name`
2. Add to `models.json`
3. Restart dev server

**Model Name Matching:**
- You can use short names (`"mistral"`) or tagged names (`"mistral:latest"`)
- The app automatically handles tag normalization
- If a model shows "click to install" but it's already installed, see [Troubleshooting](#model-not-appearing-in-dropdown)

**To change order:**
- Just reorder the array in `models.json`

**To remove a model:**
- Delete it from the array

### Available Properties

- `id` (required): Exact Ollama model name
- `name` (required): Display name with emoji
- `desc` (required): Short description
- `recommended` (optional): Set to `true` for auto-selection

## Features

### Local Development Benefits

✅ **Unlimited Usage** - No token limits
✅ **Offline Capable** - Works without internet (after models downloaded)
✅ **Privacy** - Resume data never leaves your machine
✅ **Free** - No API costs
✅ **Fast Iteration** - Experiment with different models
✅ **Model Flexibility** - Easy to add/remove/test models

### Ollama Status Indicator

The app shows Ollama connection status:
- 🟢 **Connected** - Ollama running, models available
- 🔴 **Disconnected** - Ollama not running
- 🔵 **Checking** - Testing connection

### Model Auto-Detection

The app only shows models that are:
1. Configured in `models.json`
2. Actually installed on your system

If a configured model is missing, the app shows installation instructions.

## Troubleshooting

### "Ollama Not Running" Error

**Solution:**
```bash
# Start Ollama in a separate terminal
ollama serve
```

### "Model Not Found" Error

**Solution:**
```bash
# Pull the model
ollama pull llama3.1:8b
```

### JSON Parsing Errors

**Cause:** Model produced invalid JSON (common with complex resumes)

**Solutions:**
1. Switch to Llama 3.1 (best JSON accuracy)
2. Simplify resume (3-4 positions, 2-3 bullets each)
3. Try again (models can be inconsistent)

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in vite.config.js
```

### Slow Analysis

**Cause:** Large resume or underpowered hardware

**Solutions:**
1. Use smaller model (Mistral, Phi-3)
2. Reduce resume size
3. Upgrade RAM (8GB minimum recommended)

## Model Recommendations

| Model | Speed | Quality | RAM | Best For |
|-------|-------|---------|-----|----------|
| **llama3.1:8b** | ⭐⭐⭐ | ⭐⭐⭐⭐ | 8GB | General use (recommended) |
| **mistral** | ⭐⭐⭐⭐ | ⭐⭐⭐ | 6GB | Quick analysis |
| **gemma2:9b** | ⭐⭐ | ⭐⭐⭐⭐ | 10GB | Detailed technical analysis |
| **qwen2.5:7b** | ⭐⭐⭐ | ⭐⭐⭐⭐ | 8GB | Creative bullet rewrites |
| **phi3** | ⭐⭐⭐⭐ | ⭐⭐⭐ | 4GB | Low RAM systems |

### Model Not Appearing in Dropdown

**Symptom:** Model installed (shows in `ollama list`) but doesn't appear in UI dropdown

**Cause:** Tag mismatch between config and API response

**Solution:**
1. Check installed models: `ollama list`
   - Example output: `mistral:latest`
2. Check your `src/config/models.json`:
   - If it says `"id": "mistral"`, this should work automatically
   - If it says `"id": "mistral:7b"` but Ollama has `mistral:latest`, they won't match
3. Update config to match: Use the exact tag from `ollama list` OR use the short name (without tag)

**Best Practice:** Use short names in config (`"mistral"`, `"phi3"`) and let Ollama add the tag

**More Info:** [Ollama Model Tag Matching Lessons Learned](docs/lessons-learned/debugging/Lessons_Learned_Ollama_Model_Tag_Matching.md)

### Tailwind Styles Not Rendering

**Symptom:** White background, no styling, broken UI

**Cause:** Tailwind v4 requires different CSS syntax than v3

**Solution:**
1. Check `src/index.css` - should use:
   ```css
   @import "tailwindcss";

   @layer base {
     /* your styles */
   }
   ```

   NOT:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

2. Verify `postcss.config.js` includes `@tailwindcss/postcss` plugin

3. Ensure `tailwind.config.js` is deleted (conflicts with v4)

4. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

5. Restart dev server: `npm run dev`

**More Info:** [Tailwind v4 Styling Fix Lessons Learned](docs/lessons-learned/debugging/Lessons_Learned_Tailwind_v4_Styling_Fix.md)

## Development vs Production

### Local Dev (This Setup)
- Uses Ollama models
- Free and unlimited
- Runs on your machine
- Best for development and testing
- Component: `src/components/ResumeAnalyzer-local.jsx`

### Production (Claude Artifact)
- Uses Claude API (Haiku/Sonnet/Opus)
- Cloud-based
- Token limits apply
- Best for end users
- Component: Archive reference versions in `docs/plans/`

### Switching Between Environments

**To test Claude integration locally:**
1. Checkout a feature branch
2. Create separate component for Claude integration
3. Create `.env` with Claude API key
4. Modify to use Claude API instead of Ollama

> **Note**: The local and production versions use different components to avoid conflicts. `ResumeAnalyzer-local.jsx` is specifically for Ollama integration.

## Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Endpoints

### Ollama API (http://localhost:11434)

- `GET /api/tags` - List installed models (returns full tags like `mistral:latest`)
- `POST /api/generate` - Generate completion
- `POST /api/chat` - Chat completion

> **Note**: The `/api/tags` endpoint returns model names with tags (e.g., `mistral:latest`), while you typically pull models with short names (`mistral`). The app normalizes these automatically.

## Next Steps

### Phase 2: Additional Features

Future enhancements for this local dev environment:

1. **Bullet Optimization** - Rewrite individual bullets
2. **Job Description Matching** - Compare resume to JD
3. **Multi-Model Comparison** - Test same resume with different models
4. **Resume History** - Save and compare analyses
5. **Export Options** - PDF, DOCX, JSON formats

## Known Issues & Solutions

This section documents known issues and their solutions. For detailed implementation guides, see the [Lessons Learned documentation](docs/lessons-learned/README.md).

### Tailwind v4 Migration Issues
- **Issue**: Styles not rendering after upgrade to Tailwind v4
- **Root Cause**: v3 `@tailwind` directives incompatible with v4
- **Solution**: See [Tailwind v4 Styling Fix Guide](docs/lessons-learned/debugging/Lessons_Learned_Tailwind_v4_Styling_Fix.md)
- **Status**: ✅ Resolved in v7.0.1

### Ollama Model Tag Matching
- **Issue**: Installed models showing as "not available" in UI
- **Root Cause**: Config uses short names, API returns tagged names
- **Solution**: See [Ollama Tag Matching Guide](docs/lessons-learned/debugging/Lessons_Learned_Ollama_Model_Tag_Matching.md)
- **Status**: ✅ Resolved in v7.0.1

### Browser Caching After Build Changes
- **Issue**: CSS changes not appearing after Tailwind v4 migration
- **Root Cause**: Browser caching PostCSS output
- **Solution**: Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows/Linux) + restart dev server
- **Prevention**: Always hard refresh after changing build configuration
- **Status**: ⚠️ Known behavior (browser caching)

### Model Auto-Selection Not Working
- **Issue**: Recommended model not auto-selecting on first load
- **Root Cause**: Tag mismatch between config and API response
- **Solution**: Already handled by tag normalization in v7.0.1
- **Status**: ✅ Resolved in v7.0.1

### Contributing

To add features to this local dev environment:

1. Create feature branch from `main`
2. Make changes
3. Test with multiple Ollama models
4. Ensure Tailwind v4 compatibility
5. Submit PR

**Before submitting:**
- Test with hard browser refresh (Cmd+Shift+R)
- Verify dev server restart works
- Test with at least 2 different Ollama models
- Check that tag matching works (test with both short and tagged model names)

## License

Same as main project.

## Support & Documentation

### Issue Reporting
- **Ollama Issues**: https://github.com/ollama/ollama/issues
- **Project Issues**: https://github.com/technomensch/optimize-my-resume/issues

### Documentation
- **This Guide**: README-LOCAL-DEV.md (local development)
- **Setup Guide**: SETUP-GUIDE.md (installation)
- **Lessons Learned**: docs/lessons-learned/README.md
- **Implementation Plans**: docs/plans/v7.0.1-analyzer-gui-fixes.md

### Recent Updates
- **v7.0.1** (Jan 2026): Tailwind v4 migration, Ollama tag matching fixes
- **v7.0.0** (Jan 2026): Initial local development environment

---

**Current Version**: v7.0.1
**Last Updated**: January 2026
**Maintained By**: Project contributors

**Note**: This is the local development version. For the production Claude-based artifact, see the main README and `docs/plans/` directory.
